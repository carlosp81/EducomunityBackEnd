'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var app = require('./app');

//Puerto donde se ejecuta la aplicación
var port = 3800;

//conexion a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/QuisDB')
.then(() => {
  console.log("la conexión a la base de datos QuisDB se ha realizado correctamente ");
  
  //crear servidor
  app.listen(port, () => {
    console.log("Servidor corriendo en http://localhost:3800");
  });
})
.catch(err => console.log(err));