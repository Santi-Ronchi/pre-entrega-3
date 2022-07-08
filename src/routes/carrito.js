const express = require('express');
const cartRouter = express.Router();
const { chequeoAutentificacion } = require('../funciones/funcAute')
const {
    mostrarCarro
  } = require('../controlador/carrito');

cartRouter.get('/', chequeoAutentificacion, mostrarCarro)

module.exports = cartRouter;