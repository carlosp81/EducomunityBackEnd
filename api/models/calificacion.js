'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//La calificación es un contador de calificación-aprovación en los recursos educativos (likes)
var CalificacionSchema = Schema({

    calificacionId: { type: Schema.ObjectId, ref:'Calificacion'},
    usuarioId: { type: Schema.ObjectId, ref:'Usuario'}, // usuario que califica
    recursoId: { type: Schema.ObjectId, ref:'RecursoEducativo'}, //recurso calificado    
    fecha_creacion: String,
    active: Boolean

});
        
// (Calificacione para que en la base de datos aparezca Calificaciones)
module.exports = mongoose.model('Calificacion', CalificacionSchema);
