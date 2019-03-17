'use strict'

//LIBRERIAS
var moment = require('moment');

//MODELOS
var Calificacion = require('../models/calificacion');

/**
 * Función de prueba que permite verificar si la ruta funciona correctamente
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend 
 */
function prueba(req, res) {

    res.status(200).send({ message: "Hola desde calificacion" });
}

/**
 * Función que permite guardar la calificacion hecha por el usuario en un recurso
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend 
 */
function guardarCalificacion(req, res) {

    var params = req.body;

    if (!params.recurso) return res.status(200).send({ message: 'Debes enviar un recurso' });

    var calificacion = new Calificacion();
    calificacion.usuario = req.usuario.sub;
    calificacion.recurso = params.recurso;
    calificacion.fecha_creacion = moment().unix();

    calificacion.save((err, calificacionStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar la calificacion' });
        if (!calificacionStored) return res.status(404).send({ message: 'La calificacion no se ha guardado' });
        return res.status(200).send({
            message: "Se ha guardado la calificación",
            calificacion: calificacionStored
        });
    });
}
/**
 * Función que permite eliminar la calificación
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend 
 */
function eliminarCalificacion(req, res) {

    /*var usuarioId = req.usuario.sub;
      var recursoId = req.params.recurso;

    Calificacion.find({ 'usuario': usuarioId , 'recurso': recursoId}).remove(err =>{
        if(err) return res.status(500).send({message: 'Error al quitar la calificacion'});
        return res.status(200).send({message: 'La calificación se ha eliminado'})

    });*/

    var calificacionId = req.params.id;

    Calificacion.findByIdAndRemove(calificacionId, (err, calificacionRemoved) => {
        if (err) return res.status(500).send({ message: 'Error al borrar la calificacion' });
        if (!calificacionRemoved) return res.status(404).send({ message: 'no se ha borrado la calificacion' });
        return res.status(200).send({
            message: 'se ha eliminado correctamente la calificacion',
            categoria: calificacionRemoved
        });
    }).populate('usuario');
}

/**
 * Función que permite a los usuarios obtener los recurso educativos que ha calificado
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend 
 */
function getRecursosCalificados(req, res) {

    var page = 1;
    var itemsPerPage = 5;
    var usuarioId = req.usuario.sub;

    if (req.params.page) {
        page = req.params.page;
    }
    if (req.params.id) {
        usuarioId = req.params.id;
    }
    Calificacion.find({ usuario: usuarioId }).sort('-fecha_creacion').paginate(page, itemsPerPage, (err, calificados, total) => {
        if (err) return res.status(500).send({ message: 'Error al devolver recursos calificados' });
        if (!calificados) return res.status(404).send({ message: 'No hay recursos calificados' });
        if (calificados == 0) return res.status(404).send({ message: 'El usuario no tiene recursos calificados' });
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            calificados
        });
    });
}

/**
 * Función que permite obtener los usuarios que han calificado un recurso
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend 
 */
function getCalificadoresRecursos(req, res) {

    var page = 1;
    var recursoId = req.params.id;

    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;
    if (!req.params.id) {
        return res.status(200).send({ message: 'No hay id de recurso' })
    }

    Calificacion.find({ recurso: recursoId }).sort('-fecha_creacion').populate('usuario').paginate(page, itemsPerPage, (err, calificadores, total) => {
        if (err) return res.status(500).send({ message: 'Error al devolver los calificadores de los recursos' });
        if (!calificadores) return res.status(404).send({ message: 'No hay calificadores' });
        if (calificadores == 0) return res.status(404).send({ message: 'El recurso no ha sido calificado' });
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            calificadores
        });
    });
}
module.exports = {
    guardarCalificacion,
    eliminarCalificacion,
    getRecursosCalificados,
    getCalificadoresRecursos,
    prueba
}
