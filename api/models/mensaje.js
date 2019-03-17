'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MensajeSchema = Schema({
  
    texto: String,
    emisor: { type: Schema.ObjectId, ref: 'Usuario'},
    receptor: { type: Schema.ObjectId, ref: 'Usuario'},
    fecha_creacion: String,
    visto: String
});

module.exports = mongoose.model('Mensaje', MensajeSchema);