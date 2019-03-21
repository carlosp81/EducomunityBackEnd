'use stric'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo recurso educativo
var FechaController = require('../controllers/fecha');

//usa el modelo autenticador
var md_auth = require('../middlewares/autenticador');
var multipart = require('connect-multiparty');

//El usuario con sesión iniciada desea crear una fecha en el recursos
api.post('/guardar-fecha', md_auth.ensureAuth, FechaController.guardarFecha);

//El usuario con sesión iniciado desea ver las fechas en el recurso
api.get('/fechas-recurso/:recurso/:page?', md_auth.ensureAuth, FechaController.getFechaRecurso);

//EL usuario desea eliminar una fecha
api.delete('/eliminar-fecha/:id', md_auth.ensureAuth, FechaController.eliminarFecha);

//EL usuario desea editar la información de una fecha
api.put('/actualizar-fecha/:id', md_auth.ensureAuth, FechaController.updateFecha);

//El usuario desea contar las fechas del recurso
api.get('/get-contadores-fecha/:id', md_auth.ensureAuth, FechaController.getContadores);

module.exports = api;
