'use strict'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo seguidor
var UsuarioController = require('../controllers/usuario');

//usa el modelo autenticador
var md_auth =require('../middlewares/autenticador');


var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/home', UsuarioController.home);
api.get('/pruebas', md_auth.ensureAuth, UsuarioController.pruebas);

//EL visitante desea crear su cuenta de perfil
api.post('/registrar', UsuarioController.guardarUsuario);

//El usuario se logea para ingresar al portal
api.post('/login', UsuarioController.loginUsuario);

//El usuario desea ver la información de un perfil de usuario 
api.get('/usuario/:id', md_auth.ensureAuth, UsuarioController.getUsuario);

//El administrador enlista todos los usuarios del portal
api.get('/usuarios/:page?', md_auth.ensureAuth, UsuarioController.getUsuarios);

//EL usuario desea editar su información personal
api.put('/actualizar-usuarios/:id', md_auth.ensureAuth, UsuarioController.updateUsuario );

//El usuario desea cambiar su foto de perfil
api.post('/actulizar-foto-usuario/:id', [md_auth.ensureAuth, md_upload], UsuarioController.uploadImagen);

//Visualiza la foto de usuario de algún usuario
api.get('/get-foto-usuario/:foto',  UsuarioController.getFotoFile);
//Eliminar usuario
api.delete('/eliminar-usuario/:id', md_auth.ensureAuth, UsuarioController.eliminarUsuario); 
//
api.get('/contador/:id?', md_auth.ensureAuth, UsuarioController.getContadores);

module.exports = api;