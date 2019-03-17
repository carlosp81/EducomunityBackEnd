'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({  
    nombre : String,
    fecha_creacion : String
});

module.exports = mongoose.model('Categoria', CategoriaSchema);