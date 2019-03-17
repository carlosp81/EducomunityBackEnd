'use strict' 

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo categoria
var MensajeController = require('../controllers/mensaje');

//usa el modelo autenticador
var md_auth = require('../middlewares/autenticador');

api.get('/probando-mensaje', md_auth.ensureAuth, MensajeController.probando);

//Método que permite al usuario con sesión iniciada enviar mensajes a otros usuarios
api.post('/mensaje', md_auth.ensureAuth, MensajeController.guardarMensaje);

//El usuario con sesión iniciada puede ver todos los mensajes que otros usuarios le han enviado
api.get('/mis-mensajes-recibidos/:page?', md_auth.ensureAuth, MensajeController.getMensajesRecibidos);

//El usuario con sesión iniciada puede ver todos los mensajes enviados
api.get('/mis-mensajes-enviados/:page?', md_auth.ensureAuth, MensajeController.getMensajesEnviados);

//El usuario con sesión iniciada puede revizar sus comentarios no visto
api.get('/mensajes-no-leidos/:page?', md_auth.ensureAuth, MensajeController.getMensajesNoLeidos);

//El usuario con sesión iniciada cambia sus mensajes no vistos a vistos
api.put('/set-mensajes-vistos', md_auth.ensureAuth, MensajeController.setMensajesVistos);//visaje

module.exports = api;