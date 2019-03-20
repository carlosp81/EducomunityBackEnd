'use strict'
//LIBRERIAS
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//cargar rutas
var usuario_routes = require('./routes/usuario');
var seguidor_routes = require('./routes/seguidor');
var recurso_educativo_routes= require('./routes/recursoEducativo');
var mensaje_routes = require('./routes/mensaje');
var calificacion_routes = require('./routes/calificacion');
var comentarioRecurso_routes = require('./routes/comentarioRecurso');
var notificacion_routes = require('./routes/notificacion');
var seguidorRecurso_routes = require('./routes/seguidorRecurso');
var categoria_routes = require('./routes/categoria');

//cargar middlewares-metodo que se ejecuta antes de que llegue a un controlador
//lo que me recibo del navegador
app.use(bodyParser.urlencoded({extended:false}));//
app.use(bodyParser.json());//archivos json
//cors

//configuracion para que no haya problema al comunicar el front con el back
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//rutas
app.use('/api', usuario_routes);
app.use('/api', seguidor_routes);
app.use('/api', recurso_educativo_routes);
app.use('/api', mensaje_routes);
app.use('/api', calificacion_routes);
app.use('/api', comentarioRecurso_routes);
app.use('/api', notificacion_routes);
app.use('/api', seguidorRecurso_routes);
app.use('/api', categoria_routes);

module.exports = app;
