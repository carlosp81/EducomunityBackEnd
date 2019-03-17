'use strict'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo calificación
var ControladorCalificacion = require('../controllers/calificacion');

//usa el modelo autenticador 
var md_auth = require('../middlewares/autenticador');

// Marcar la calificación-aprovación de un recurso educativo (like)
api.post('/calificacion', md_auth.ensureAuth, ControladorCalificacion.guardarCalificacion);

// Desmarcar la calificación-aprovación de un recurso educativo (dislike)
api.delete('/eliminar-calificacion/:id', md_auth.ensureAuth, ControladorCalificacion.eliminarCalificacion); 

//Enlistar los recursos calificados por usuario
api.get('/get-recursos-calificados/:id?', md_auth.ensureAuth, ControladorCalificacion.getRecursosCalificados);

//Enlistar los calificadores de los recursos
api.get('/get-calificadores-recurso/:id', md_auth.ensureAuth, ControladorCalificacion.getCalificadoresRecursos);

module.exports = api;