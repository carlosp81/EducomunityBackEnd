'use stric'

var express = require('express');
var api = express.Router();

//Métodos de los controladores del modelo recurso educativo
var RecursoEducativoController = require('../controllers/recursoEducativo');

//usa el modelo autenticador
var md_auth = require('../middlewares/autenticador');
var multipart = require('connect-multiparty');

//paquete que permite subir archivos a la carpeta específicada
var md_upload = multipart({ uploadDir: './uploads/recursoseducativos'});

api.get('/probando-recurso', md_auth.ensureAuth, RecursoEducativoController.probando);

//El usuario con sesión iniciada desea crear un blog, post, evento, grupo o publicación
api.post('/recurso-educativo', md_auth.ensureAuth, RecursoEducativoController.guardarRecursos);

//El usuario con sesión iniciado desea ver los recursos educativos de cualquier usuario
api.get('/recursos-educativos-usuario/:usuario?/:page?', md_auth.ensureAuth, RecursoEducativoController.getRecursosUsuario);//arreglar lo del usuario// ta bien

//El usuario logeado desea ver todos sus recursos creados
api.get('/recursos-educativos/:page?', md_auth.ensureAuth, RecursoEducativoController.getRecursos);

//El usuario desea ver los recursos educativos organizados por tipo	o categoria
//api.get('/get-recursos-educativos-por-tipo/:tipo?/:categoria?/:page?', md_auth.ensureAuth, RecursoEducativoController.getRecursosEducativosPorTipo);
api.get('/get-recursos-educativos-por-tipo-categoria/:tipo?/:categoria?/:page?', md_auth.ensureAuth, RecursoEducativoController.getRecursosEducativosPorTipoCategoria);

api.get('/get-recursos-educativos-por-tipo/:tipo/:page?', RecursoEducativoController.getRecursosEducativosPorTipo);
//El usuario puede buscar recursos educativos de un usuario en especifico y su tipo
api.get('/get-recursos-educativos-por-usuario-tipo/:usuario/:tipo/:page?', md_auth.ensureAuth, RecursoEducativoController.getRecursosEducativosPorTipoUsuario);

//El usuario desea ver las publicaciones en un grupo o los post de un blog
api.get('/get-recursos-educativos-hijos/:recurso_padre/:page?', md_auth.ensureAuth, RecursoEducativoController.getRecursosEducativosHijos);

//El usuario desea ver el contenido de un recurso educativo en específico
api.get('/recurso-educativo/:id', md_auth.ensureAuth, RecursoEducativoController.getRecursoEducativo);

//EL administrador desea eliminar un recurso educativo
api.delete('/eliminar-recurso-educativo/:id', md_auth.ensureAuth, RecursoEducativoController.eliminarRecurso);

//El usuario logeado desea un recurso educativo que ha creado
api.delete('/eliminar-mis-recursos-educativos/:id', md_auth.ensureAuth, RecursoEducativoController.eliminarMiRecurso);

//El usuario desea subir un archivo a un recurso educativo que ha creado
api.post('/subir-archivo-recurso-educativo/:id', [md_auth.ensureAuth, md_upload], RecursoEducativoController.uploadArchivo);

//El usuario desea descargar un archivo subido a algún recurso educativo
api.get('/get-archivo-recurso-educativo/:archivo', RecursoEducativoController.getArchivoFile);

//EL usuario guarda una publicación en su muro
api.post('/publicaciones', md_auth.ensureAuth, RecursoEducativoController.guardarPublicaciones);

//EL usuario desea editar la información de un recurso educativo
api.put('/actualizar-recurso-educativo/:id', md_auth.ensureAuth, RecursoEducativoController.updateRecurso);

//El usuario desea contar los seguidores del recurso
api.get('/get-contadores/:id', md_auth.ensureAuth, RecursoEducativoController.getContadores);

module.exports = api;
