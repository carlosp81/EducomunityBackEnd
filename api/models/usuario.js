'use strict'

//LIBRERIAS
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  
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