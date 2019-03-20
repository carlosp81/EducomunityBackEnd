'use strict'

//LIBRERIAS
const mongoose = require('mongoose');
const app = require('./app');

//Puerto donde se ejecuta la aplicación
var port = 3800;

//conexion a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://dbuis:bucabuca3461@cluster0-gw5al.mongodb.net/test?retryWrites=true', {useNewUrlParser: true})
.then(() => {
  console.log("la conexión a la base de datos QuisDB se ha realizado correctamente ");
  
  //crear servidor
  app.listen(port, () => {
    console.log("Servidor corriendo en http://localhost:3800");
  });
})
.catch(err => console.log(err));