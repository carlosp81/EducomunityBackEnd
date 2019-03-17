'use strict'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo categoria
var ControladorComentarioRecurso = require('../controllers/comentarioRecurso');

//usa el modelo autenticador 
var md_auth = require('../middlewares/autenticador');
var multipart = require('connect-multiparty');



//El usuario con sesión iniciada crea una nuevo blog, post, publicación, grupo o evento
api.post('/comentario-recurso', md_auth.ensureAuth, ControladorComentarioRecurso.guardarComentarioRecurso);

//El usuario con sesión iniciada elimina un comentario realizado en un recurso educativo
api.delete('/eliminar-comentario-recurso/:id', md_auth.ensureAuth, ControladorComentarioRecurso.eliminarComentarioRecurso);

//El usuario con sesión iniciada edita un comentario realizado en un recurso educativo
api.put('/actualizar-comentario-recurso/:id', md_auth.ensureAuth, ControladorComentarioRecurso.updateComentarioRecurso);

//El usuario desea obtener todos los comentario de realizados en un recurso educativo
api.get('/get-comentarios-recurso/:id/:page?', md_auth.ensureAuth, ControladorComentarioRecurso.getComentariosRecurso);

 module.exports = api;