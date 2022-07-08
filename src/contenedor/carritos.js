const {conexionMongoDB,disconnectMongoDB} = require('../daos/mongo/mongodb');
const schemaCarritos = require('../modal/carritos');

class Carrito {
  //ok
  async createCarrito() {
    try {
      await conexionMongoDB();
      const data = await schemaCarritos.create({
        productos: []
        });
      await disconnectMongoDB();
        return data._id;
    } catch (error) {
      throw Error(error.message);
    }
  }
//ok
  async buscarCarrito(idCarrito) {
    try {
      await conexionMongoDB();
      const data = await schemaCarritos.findById(idCarrito)
      await disconnectMongoDB();
      const productos = data.productos
        return productos;
    } catch (error) {
      throw Error(error.message);
    }
  }


// ok
  async addProductToCart(idCart, idProduct) {
    try {
      await conexionMongoDB()
        await schemaCarritos.updateOne({ _id: idCart }, { $push: { productos: idProduct } })
      await disconnectMongoDB();
        return 'se agrego el producto correctamente';
    } catch (error) {
      throw Error(error.message);
    }
  }
//ok
  async deleteCartById(id) {
    try {
      await conexionMongoDB()
      await schemaCarritos.findByIdAndRemove(id);
      await disconnectMongoDB();
      return 'El carrito se borro con exito';
    } catch (error) {
      throw Error(error.message);
    }
  }
//ok
  async deleteProductCart(idCart, idProduct) {
    try {
      await conexionMongoDB()
      await schemaCarritos.updateOne({ _id: idCart }, { $pull: { productos: idProduct } })
      await disconnectMongoDB();
    } catch (error) {
      throw Error(error.message);
    }
  }

}

module.exports = Carrito