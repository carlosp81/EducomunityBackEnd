'use strict'

//MODELOS
var Notificacion = require('../models/notificacion');

/**
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 */
function guardarNotificacion(req, res) {

    var params = req.body;
    var notificacion = new Notificacion();

    if (params.usuario && params.descripcion && params.recurso) {

        notificacion.usuario = params.usuario;
        notificacion.recurso = params.recurso;
        notificacion.descripcion = params.descripcion;

        notificacion.save((err, notificaciones) => {
            if (err)
                return res.status(500).send({ message: 'Error al guardar la notificacion' });
            if (!notificaciones)
                return res.status(404).send({ message: 'la notificacion no ha sido guardada' });
            return res.status(200).send({
                notificacion: notificacionStored
            });
        });
    } else {
        return res.status(200).send({ message: "Debe haber un usuario y una descripcion de la notificacion" });
    }
}

/**
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getNotificacionesUsuario(req, res) {

    var page = 1;
    var itemsPerPage = 5;
    var usuarioId = req.usuario.sub;

    if (req.params.page) {
        page = req.params.page;
    }

    if (req.params.id) {
        usuarioId = req.params.id;
    }

    Notificacion.find({ usuario: usuarioId }).sort('-fecha_creacion').populate('usuario').paginate(page, itemsPerPage, (err, calificados, total) => {
        if (err)
            return res.status(500).send({ message: 'Error al devolver recursos calificados' });
        if (!calificados)
            return res.status(404).send({ message: 'No hay recursos calificados' });

        if (calificados == 0)
            return res.status(404).send({ message: 'El usuario no tiene recursos calificados' });

        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            calificados
        });
    });
}

module.exports = {
    guardarNotificacion,
    getNotificacionesUsuario
}