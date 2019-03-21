'use strict'

//LIBRERIAS
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config()


//Puerto donde se ejecuta la aplicación
const port = process.env.PORT;
const mcc = process.env.MONGO_URI;

//conexion a la base de datos

if(mcc) {
    mongoose.Promise = global.Promise;
    mongoose.connect(mcc, {useNewUrlParser: true})
    .then(() => {
      console.log("la conexión a la base de datos QuisDB se ha realizado correctamente ");
      
      //crear servidor
      app.listen(port, () => {
        console.log("Servidor corriendo en http://localhost:3800");
      });
    })
} else {
     console.log('mongoose connection is successful on');
}
