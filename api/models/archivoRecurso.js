'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArchivoRecursoSchema = Schema({
  
	fecha_creacion : String,
    archivo : String,
    recurso : { type: Schema.ObjectId, ref:'RecursoEducativo'}
});
module.exports = mongoose.model('ArchivosRecurso', ArchivoRecursoSchema);
