'use strict'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo seguidor
var ControladorArchivoRecurso = require('../controllers/seguidorRecurso');

//usa el modelo autenticador
var md_auth = require('../middlewares/autenticador');

//El usuario logeado desea subir un archivo a un recurso
api.post('/archivo-recurso', md_auth.ensureAuth, ControladorArchivoRecurso.guardarArchivoRecurso);

//El usuario logeado desea eliminar un archivo subido a un recurso
api.delete('/eliminar-archivo-recurso/:id', md_auth.ensureAuth, ControladorArchivoRecurso.eliminarArchivoRecurso);

//El usuario desea ver los achivos del recurso
api.get('/get-archivos-recurso/:recurso/:page?', md_auth.ensureAuth, ControladorArchivoRecurso.getArchivosRecurso)

//El usuario desea ver un archivo en espesífico
api.get('/get-archivo-recurso/:id', md_auth.ensureAuth, ControladorArchivoRecurso.getArchivoRecurso)

module.exports = api;