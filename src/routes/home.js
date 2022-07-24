const express = require('express');
const { chequeoAutentificacion } = require('../funciones/funcAute')
const homeRouter = express.Router();
const {
  createProduct,
  webCarga,
  getProducts,
  getOnlyProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require('../controller/productController');


homeRouter.get('/', chequeoAutentificacion, getProducts);
homeRouter.get('/onlyProducts', getOnlyProducts);
homeRouter.post('/carga/', createProduct);
homeRouter.delete('/carga/:id', deleteProductById);
homeRouter.post('/carga/:id', updateProductById);
homeRouter.get('/carga/', webCarga);

module.exports = homeRouter;