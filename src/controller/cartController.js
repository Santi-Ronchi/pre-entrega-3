const Carrito = require('../container/cartContainer')
const carro = new Carrito()
const Productos = require('../container/productContainer')
const producto = new Productos()    


const {createTransport} = require('nodemailer');
const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'vernie.durgan17@ethereal.email',
      pass: 'gwnA2xbJARyMWgrBMZ'
  }
});


const twilio = require('twilio')
const accountSid = 'AC1be114ca37a48c091f65ca0228c79b2c';
const authToken = '1a27e41a24d0a7249d77e53f54d87869';
const client = twilio(accountSid, authToken)


module.exports = {
    mostrarCarro: async (req, res) => {
        try {
            const data = await carro.buscarCarrito(req.session.carrito)
            const productos =[]
            const produs = await producto.getAll() 
            data.forEach(element => {
                productos.push(produs.find(item => item.id == element))   
            })
            const nombre = req.user.nombre;
            const foto = req.user.foto;
            let idCart = req.session.carrito;          
            res.render('carrito', {nombre, foto, idCart, productos })
        } catch (error) {
            res.status(500).send({
            status: 500,
            messages: error.message,
            });
        }
    },

    efectuarCompra: async (req, res) => {
        console.log('dentro de comprar productos')
        const cart = carro.buscarCarrito(req.session.carrito)
        // mandar mail
        const usuarioExistente = {nombre: req.user.nombre, email: req.user.username, direccion: req.user.direccion, edad: req.user.edad, telefono: req.user.telefono }
        const mailOptions = { 
          from: 'Servidor Node.js',
          to: 'vernie.durgan17@ethereal.email',
          subject: 'Compra Terminada',
          html: `nuevo pedido de NOMBRE:${usuarioExistente.nombre}, EMAIL:${usuarioExistente.email},fecha de nacimiento:${usuarioExistente.edad}, direccion: ${usuarioExistente.direccion}, telefono: ${usuarioExistente.telefono}. Pedido:${cart}`
        }
        await transporter.sendMail(mailOptions)

        // mandar whatsapp al cliente
        try {
            const message = await client.messages.create({
                body: 'Su pedido ha sido recibido exitosamente y se encuentra en proceso.!',
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+${usuarioExistente.telefono}`
            })
            console.log(message)
        } catch (error) {
            console.log(error)
        }
        //crear uno nuevo y asignar
        let carritoId = await carro.createCarrito()
        req.session.carrito = carritoId
        res.redirect('/api/home')
    }

}


