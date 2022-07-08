const Carrito = require('../contenedor/carritos')
const Carro = new Carrito()
const Productos = require('../contenedor/productos')
const producto = new Productos()    
    
module.exports = {
    mostrarCarro: async (req, res) => {
        try {
            const data = await Carro.buscarCarrito(req.session.carrito)
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
    }

}


