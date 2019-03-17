'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  
    nombre: String,
    apellido:String, 
    fecha_creacion: String,
    email: String,
    ciudad: String,
    telefono: String,
    ocupacion: String,
    universidad: String,
    password: String,
    rol: String,
    estado: String,
    foto: String

});

module.exports = mongoose.model('Usuario', UserSchema);