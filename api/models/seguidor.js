'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeguidorSchema = Schema({
  
    usuario: { type: Schema.ObjectId, ref:'Usuario'},// usuario que sigue
    usuario_seguido: { type: Schema.ObjectId, ref:'Usuario'} //usuario seguido
});

module.exports = mongoose.model('Seguidor', SeguidorSchema);