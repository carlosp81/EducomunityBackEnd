'use strict'

//LIBRERIAS
var moment = require('moment');

//MODELOS
var Mensaje = require('../models/mensaje');

/**
 * Función de prueba
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function probando(req, res) {
    return res.status(200).send({ message: 'Hola desde mensaje' });
}

/**
 * Función que permite guardar un mensaje
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function guardarMensaje(req, res) {
    var params = req.body;

    if (!params.texto && !params.receptor) {
        return res.status(200).send({ message: 'Envia los datos necesarios' });
    }

    var mensaje = new Mensaje();
    mensaje.emisor = req.usuario.sub;
    mensaje.receptor = params.receptor;
    mensaje.texto = params.texto;
    mensaje.fecha_creacion = moment().unix();
    mensaje.visto = 'false';

    mensaje.save((err, mensajeStored) => {
        if (err)
            return res.status(500).send({ message: 'Error en la peticion' });
        if (!mensajeStored)
            return res.status(500).send({ message: 'Error al enviar el mensaje' });

        return res.status(200).send({
            mensaje: mensajeStored
        });
    });
}

/**
 * Función que permite obtener los mensajes recibidos por un usuario
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getMensajesRecibidos(req, res) {

    var userId = req.usuario.sub; // id usuario logeado
    var page = 1;
    var itemsPerPage = 4;

    if (req.params.page) {
        page = req.params.page;
    }

    Mensaje.find({ receptor: userId }).populate('emisor').sort('-fecha_creacion').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err)
            return res.status(500).send({ message: 'Error en la peticion' });
        if (!messages)
            return res.status(404).send({ message: 'No hay mensajes' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        });
    });
}

/**
 * Función que permite obtener los mensajes enviados
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getMensajesEnviados(req, res) {

    var userId = req.usuario.sub; // id usuario logeado
    var page = 1;
    var itemsPerPage = 4;

    if (req.params.page) {
        page = req.params.page;
    }

    Mensaje.find({ emisor: userId }).populate('receptor').sort('-fecha_creacion').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err)
            return res.status(500).send({ message: 'Error en la peticion' });
        if (!messages)
            return res.status(404).send({ message: 'No hay mensajes' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        });
    });

}

/**
 * Función que permite obtener los mensajes  no leidos por el usuario
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getMensajesNoLeidos(req, res) {

    var userId = req.usuario.sub;

    Mensaje.count({ receptor: userId, visto: 'false' }).exec((err, count) => {
        if (err)
            return res.status(500).send({ message: 'Error en la peticion' });

        return res.status(200).send({
            'No leidos': count
        });
    });

}

/**
 * Función que permite poner un mensaje en estado "visto"
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function setMensajesVistos(req, res) {
    var userId = req.usuario.sub;

    Mensaje.update({ receptor: userId, visto: 'false' }, { visto: 'true' }, { "multi": true }, (err, messagesUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        return res.status(200).send({
            mensajes: messagesUpdated
        });
    });
}

module.exports = {
    probando,
    guardarMensaje,
    getMensajesRecibidos,
    getMensajesEnviados,
    getMensajesNoLeidos,
    setMensajesVistos
};