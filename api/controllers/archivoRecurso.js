'use strict'

//LIBRERIAS
var moment = require('moment');

//MODELOS
var ArchivoRecurso = require('../models/archivoRecurso');

/**
 * Función que le permite a un usuario subir archivos
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function guardarArchivoRecurso(req, res) {
//probando
    var params = req.body;
    var archivoRecurso = new ArchivoRecurso();
    seguidorRecurso.recurso = params.recurso;
    seguidorRecurso.fecha_creacion = moment().unix();
    seguidorRecurso.archivo = params.archivo;

    archivoRecurso.save((err, archivoRecursoStored) => {
        if (err)
            return res.status(500).send({ message: 'Error al guardar el seguimiento' });
        if (!archivoRecursoStored)
            return res.status(404).send({ message: 'El seguimiento no se ha guardado' });
        return res.status(200).send({ archivoRecurso: archivoRecursoStored });
    });
}

/**
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function uploadArchivo(req, res) {

    var recursoId = req.params.id;

    if (req.files) {

        var file_path = req.files.archivo.path;
        var files_split = file_path.split('\\');
        var file_name = files_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'zip' || file_ext == 'mp4') {
            RecursoEducativo.findOne({ 'usuario': req.usuario.sub, '_id': recursoId }).exec((err, recursoEducativo) => {
                if (recursoEducativo) {
                    //actualizar el documento del recurso
                    RecursoEducativo.findByIdAndUpdate(recursoId, { archivo: file_name }, { new: true }, (err, recursoUpdate) => {
                        if (err)
                            return res.status(500).send({ message: 'error en la peticion' });
                        if (!recursoUpdate)
                            return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                        return res.status(200).send({ recursoEducativo: recursoUpdate });
                    });
                } else {
                    return removeFilesOfUploads(res, file_path, 'No tie|nes permiso para actualizar este recurso');
                }
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    } else {
        return res.status(200).send({ message: 'No se han subido imagenes' });
    }
}
/**
 * Método para que el usuario con sesión iniciadad deje de seguir un recurso
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function eliminarArchivoRecurso(req, res) {

    var archivoRecursoId = req.params.id;

    ArchivoRecurso.findByIdAndRemove(archivoRecursoId, (err, archivoRemoved) => {
        if (err)
            return res.status(500).send({ message: 'Error al borrar la categoria' });
        if (!archivoRemoved)
            return res.status(404).send({ message: 'no se ha borrado la categoria' });
        return res.status(200).send({ message: 'se ha eliminado correctamente la categoria', archivoRemoved });
    });
}

/**
 * Función que permite obetner los archivos que hay en un recurso educativo
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getArchivosRecurso(req, res) {

    //var find = SeguidorRecurso.find({ usuario : usuarioId});

    //if(req.params.recurso){
    //find = SeguidorRecurso.find({ usuario : recursoId});
    //}

    var recursoId = req.params.recurso;
    var page = 1;
    var itemsPerPage = 10;

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    ArchivoRecurso.find({ recurso: recursoId }).populate({ path: 'recurso' }).paginate(page, itemsPerPage, (err, archivosRecurso, total) => {
        if (err)
            return res.status(500).send({ message: 'Error en el servidor :( ' });
        if (archivosRecurso == 0)
            return res.status(404).send({ message: 'El recurso no tiene archivos' });
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            archivosRecurso
        });
    });
}

/**
 * Función que petmite obtener el archivo del recurso
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend 
 */
function getArchivoRecurso(req, res) {

    var archivoRecursoId = req.params.id;

    ArchivoRecurso.findById(archivoRecursoId, (err, archivo) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        if (!archivo)
            return res.status(400).send({ message: 'El usuario no existe' });
        return res.status(200).send({
            archivo
        });
    });
}

module.exports = {
    guardarArchivoRecurso,
    eliminarArchivoRecurso,
    getArchivosRecurso,
    getArchivoRecurso
}
