const mongoose = require('mongoose')
const config =  require('../../config')

async function conexionMongoDB() {
    let rta = await mongoose.connect( config.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
} 

function disconnectMongoDB() {
    return mongoose.disconnect()
}

module.exports = {conexionMongoDB,disconnectMongoDB};