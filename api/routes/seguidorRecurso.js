'use strict'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo seguidor
var ControladorSeguidorRecurso = require('../controllers/seguidorRecurso');

//usa el modelo autenticador
var md_auth = require('../middlewares/autenticador');

//El usuario logeado desea seguir un evento o ser parte de un grupo
api.post('/seguidor-recurso', md_auth.ensureAuth, ControladorSeguidorRecurso.guardarSeguidorRecurso);

//El usuario logeado desea dejar de seguir un evento o salir de un grupo
api.delete('/eliminar-seguidor-recurso/:id', md_auth.ensureAuth, ControladorSeguidorRecurso.eliminarSeguidorRecurso);

//El usuario logeado desea ver los eventos que sigue o grupos en los que es miembro
api.get('/recursos-seguidos/:id?/:tipo?/:page?', md_auth.ensureAuth, ControladorSeguidorRecurso.getRecursosSeguidos);

//El usuario desesa ver los eventos de otro usuarioque sigue o grupos en los que es miembro
api.get('/seguidores-recurso/:id?/:page?', md_auth.ensureAuth, ControladorSeguidorRecurso.getSeguidoresRecurso);

//El usuario acepta una invitación a un grupo o evento
api.put('/invitacion-evento/:invitacion', md_auth.ensureAuth, ControladorSeguidorRecurso.aceptarInvitacion);

module.exports = api;