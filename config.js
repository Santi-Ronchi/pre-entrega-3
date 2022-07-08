const args = require('./src/funciones/funcMinimist')
require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8080,
    HOST: args.host || '127.0.0.1' ,
    NODE_ENV: args.node_env || 'development',
    MODO: args.modo || 'CLUSTER',
    URL: 'mongodb+srv://sronchi:asd456@cluster0.dgjch.mongodb.net/ecommerce?retryWrites=true&w=majority'
    
}