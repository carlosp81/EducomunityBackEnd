'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeguidorRecursoSchema = Schema({
  
	fecha_creacion : String,
    usuario: { type: Schema.ObjectId, ref:'Usuario'},// usuario seguidor
    recurso: { type: Schema.ObjectId, ref:'RecursoEducativo'}, //Recurso seguido
    tipo : String, // grupo, evento, blog
    invitacion : Boolean // true : invitacion (grupo o evento)   || false : Seguimiento ( grupo, evento o blog);
});
module.exports = mongoose.model('SeguidoresRecurso', SeguidorRecursoSchema);
