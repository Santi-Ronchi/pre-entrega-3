const express = require('express');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const config = require('./config')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

/*----------- Server -----------*/
if (config.MODO == 'CLUSTER' && cluster.isPrimary){
  console.log(`Master ${process.pid} is running`)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  cluster.on('exit', (worker) => {
    cluster.fork()
    console.log(`worker ${worker.process.pid} died`)
  })
} else {


/* APP */
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))


  /* SESSION */
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(
  session({
    secret: '1234567890!@#$%^&*()',
    cookie:{
      httpOnly: false,
      secure:false,
      maxAge: 600000
    },
    rolling:true,
    resave: true,
    saveUninitialized: true,
  })
)

/* TWILIO */

const twilio = require('twilio')

const accountSid = 'AC1be114ca37a48c091f65ca0228c79b2c';
const authToken = '1a27e41a24d0a7249d77e53f54d87869';
const client = twilio(accountSid, authToken)




/* ETHEREAL */

const {createTransport} = require('nodemailer');
const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'vernie.durgan17@ethereal.email',
      pass: 'gwnA2xbJARyMWgrBMZ'
  }
});


/* PASSPORT */
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Usuario = require('./src/container/userContainer')
const usuario = new Usuario()
const { isValidPassword , createHash } = require('./src/funciones/funcBcrypt')


app.use(passport.initialize())
app.use(passport.session())

passport.use(
  'register',
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      const existe = await usuario.buscarUsuario(username)
      if (existe) {
        return done(null, false)
      } else {
        const usuarioExistente = {nombre: req.body.nombre, email: username, password: createHash(password),direccion: req.body.direccion, edad: req.body.edad, telefono: req.body.telefono , foto: 'perfil.jpg' }
        const data = await usuario.createUsuario(usuarioExistente)
        //manda mail a ethereal
        const mailOptions = { 
          from: 'Servidor Node.js',
          to: 'vernie.durgan17@ethereal.email',
          subject: 'Nuevo Registro',
          html: `<h1 style="color: blue;">NOMBRE:${usuarioExistente.nombre}, EMAIL:${usuarioExistente.email},fecha de nacimiento:${usuarioExistente.edad}, direccion: ${usuarioExistente.direccion}, telefono: ${usuarioExistente.telefono}</h1>`
        }
        await transporter.sendMail(mailOptions)
        
        done(null, { email: data.email })
      }
    }
  )
)

passport.use(
  'login',
  new LocalStrategy( async (username, password, done) => {
    const existe = await usuario.buscarUsuario(username)
    if (!existe) {
      return done(null, false)
    }

    if (!isValidPassword(existe, password)){
      return done(null, false)
    } 
    return done(null, {nombre:existe.nombre,email:existe.email,foto:existe.foto})
  })
)

passport.serializeUser((usuario, done) => {
  done(null, usuario.email)
})

passport.deserializeUser(async (email, done) => {
  const usuarioDz = await usuario.buscarUsuario(email)
  done(null, usuarioDz)
})

// socket io
const Carrito = require('./src/container/cartContainer')
const carrito = new Carrito()


io.on('connection', socket => {
  
  // agregar al carrito
  socket.on('agregarProducto', async valor => {
   await carrito.addProductToCart(valor.idCart, valor.idProd)
  })

  // eliminar del carrito
  socket.on('eliminarProductos', async valor => {
    await carrito.deleteProductCart(valor.idCart, valor.idProd)
  })
})

/* HANDLEBARS */
const hbs = require('express-handlebars')
app.set('views', './src/views')
app.engine(
   '.hbs',
    hbs.engine({
      defaultLayout: 'main',
      layoutsDir: './src/views/layouts',
      partialsDir: './src/views/partials',
      extname: '.hbs',
    })
)

app.set('view engine', '.hbs')

/* RUTAS */
const loginRouter = require('./src/routes/login')
const homeRouter = require('./src/routes/home')
const cartRouter = require('./src/routes/cart')
const perfilRouter = require('./src/routes/profile')

app.use('/api', loginRouter);
app.use('/api/home', homeRouter);
app.use('/api/carrito', cartRouter)
app.use('/api/perfil', perfilRouter);

app.use('/',(req, res) => {
  try {
      res.render('bienvenido')
  } catch (error) {
    res.status(500).send({
      status: 500,
      messages: error.message,
    });
  }
})

/* SERVER */
const numCPUs = require('os').cpus().length

const connectedServer = httpServer.listen(config.PORT, () => {
  console.log(`servidor levantado en PORT:${config.PORT} y numero de processo:${numCPUs}`)
})

connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

}