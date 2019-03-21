'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FechaSchema = Schema({

    fecha: String,
    descripcion: String,
 	recurso: { type: Schema.ObjectId, ref: 'RecursoEducativo'}
});

module.exports = mongoose.model('Fecha', FechaSchema);
