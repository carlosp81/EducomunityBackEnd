'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//La calificación es un contador de calificación-aprovación en los recursos educativos (likes)
var CalificacionSchema = Schema({
  
	fecha_creacion : String,
    usuario: { type: Schema.ObjectId, ref:'Usuario'},// usuario que califica
    recurso: { type: Schema.ObjectId, ref:'RecursoEducativo'} //recurso calificado    
});

// (Calificacione para que en la base de datos aparezca Calificaciones)
module.exports = mongoose.model('Calificacione', CalificacionSchema);
