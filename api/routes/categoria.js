'use strict'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo categoria
var ControladorCategoria = require('../controllers/categoria');

//Usa el modelo autenticador 
var md_auth = require('../middlewares/autenticador');

//Crea una nueva categoría 
api.post('/categoria', md_auth.ensureAuth, ControladorCategoria.guardarCategoria);

//Elimina la categoría seleccionada
api.delete('/eliminar-categoria/:id', md_auth.ensureAuth, ControladorCategoria.eliminarCategoria); 

//Listado de las categorías paginadas
api.get('/get-categorias/:page?', md_auth.ensureAuth, ControladorCategoria.getCategorias); 

//Edita una categoría
api.put('/actualizar-categoria/:id', md_auth.ensureAuth, ControladorCategoria.updateCategoria);

//Lista de categorías sin paginar
api.get('/get-categorias-sin-paginar', md_auth.ensureAuth, ControladorCategoria.getCategoriasSinPaginar); 

module.exports = api;