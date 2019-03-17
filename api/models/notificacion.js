'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Notificación es el aviso de actividad relacionada con el usuario  (comentarios, likes, seguidores, invitaciones)
var NotificacionSchema = Schema({
    usuario : { type: Schema.ObjectId, ref: 'Usuario'},
    recurso : { type: Schema.ObjectId, ref: 'RecursoEducativo'},
    descripción: String
});

module.exports = mongoose.model('Notificacione', NotificacionSchema);