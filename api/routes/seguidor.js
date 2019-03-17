'use strict'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo seguidor
var FollowController = require('../controllers/seguidor');

//usa el modelo autenticador
var md_auth = require('../middlewares/autenticador');

//El usuario logeado desea estar en seguimiento de otro usuario
api.post('/seguidor', md_auth.ensureAuth, FollowController.saveFollow);

//El usuario logeado desea dejar de seguir a otro usuario
api.delete('/eliminar-seguimiento/:id', md_auth.ensureAuth, FollowController.deleteFollow);

//El usuario desesa ver los usuarios que sigue o los que otro usuario sigue
api.get('/usuarios-que-sigo/:id?/:page?', md_auth.ensureAuth, FollowController.getUsuariosSeguidos);

//El usuario desea ver los usuarios que lo siguen o los que siguen a otro usuario
api.get('/usuarios-que-me-siguen/:id?/:page?', md_auth.ensureAuth, FollowController.getUsuariosSeguidores);

////para mirar quienes sigo y me sigen (sin paginar), o a otro usuario
api.get('/get-mis-seguidos/:usuario_seguido?', md_auth.ensureAuth, FollowController.getMisSeguidos);

module.exports = api;