const express = require('express');
const { chequeoAutentificacion } = require('../funciones/funcAute')
const homeRouter = express.Router();
const {
  createProduct,
  webCarga,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require('../controlador/productos');


homeRouter.get('/', chequeoAutentificacion, getProducts);//ok
homeRouter.post('/carga/', createProduct);
homeRouter.get('/carga/', webCarga);

module.exports = homeRouter;