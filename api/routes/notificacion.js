'use strict'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo notificación
var NotificacionController = require('../controllers/notificacion');

//usa el modelo autenticador 
var md_auth = require('../middlewares/autenticador');

api.post('/guardar-notificacion', NotificacionController.guardarNotificacion);//visaje
api.get('/get-notificaciones-usuario/:id', md_auth.ensureAuth, NotificacionController.getNotificacionesUsuario);
module.exports = api;