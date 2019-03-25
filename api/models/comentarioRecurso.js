'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentarioRecursoSchema = Schema({
 
    comentario: String,
    fecha_creacion: String,
   	usuario: { type: Schema.ObjectId, ref: 'Usuario'},
   	recurso: { type: Schema.ObjectId, ref: 'RecursosEducativo'}
});

module.exports = mongoose.model('ComentariosRecurso', ComentarioRecursoSchema);