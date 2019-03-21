'use strict'

//LIBRERIAS
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

//MODELOS
var RecursoEducativo = require('../models/recursoEducativo');
var Fecha = require('../models/fecha')


//SERVICIOS
var jwt = require('../services/jwt');


/**
 * EL usuario con sesión crea unanueva fecha en el recursoEducativo
 *
 * @param {*} req
 * @param {*} res
 */
function guardarFecha(req, res) {

    var params = req.body;
    var fecha = new Fecha();
    if (params.descripcion && params.fecha) {

        fecha.fecha = params.fecha;
        fecha.descripcion = params.descripcion;
        fecha.recurso = params.recurso;

        fecha.save((err, fechaStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar la fecha' });
            if (!fechaStored) return res.status(404).send({ message: 'la fecha no ha sido guardada' });

            return res.status(200).send({ fecha: fechaStored });
        });
    } else {

        return res.status(200).send({
            message: 'Debes enviar todos los datos necesarios'
        });
    }
}
/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function getFechaRecurso(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;
    var recurso;
    if (req.params.recurso) {
        recurso = req.params.recurso;
        console.log(recurso)
    }

    Fecha.find({ recurso: recurso }).sort('fecha').paginate(page, itemsPerPage, (err, fechas, total) => {
        if (err) return res.status(500).send({ message: 'Error al devolver las fechas' });
        if (!fechas) return res.status(404).send({ message: 'EL usuario no ha creado fechas en el recurso educativo' });
        return res.status(200).send({

            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            fechas
        });
    });
}

/**
 * Método para que el administrado pueda eliminar un recurso específico
 *
 * @param {*} req
 * @param {*} res
 */
function eliminarFecha(req, res) {

    var fechaId = req.params.id;
    Fecha.findByIdAndRemove(fechaId, (err, fechaRemoved) => {

        if (err) return res.status(500).send({ message: 'Error al borrar la fecha' });
        if (!fechaRemoved) return res.status(404).send({ message: 'no se ha borrado la fecha' });

        return res.status(200).send({ fecha: fechaRemoved });
    });
}

/**
 * Método que permite editar los datos de una recurso educativo
 *
 * @param {*} req
 * @param {*} res
 */
function updateFecha(req, res) {

    var fechaId = req.params.id;
    var update = req.body;
    Fecha.findByIdAndUpdate(fechaId, update, { new: true }, (err, fechaUpdate) => {

        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!fechaUpdate) return res.status(404).send({ message: 'No se ha podido actualizar el recurso' });

        return res.status(200).send({ fecha: fechaUpdate });
    });
}

function getContadores(req, res){
    var recursoId = req.params.id;

    getContadorFechas(recursoId).then((value) => {
        return res.status(200).send(value);
    });
}

async function getContadorFechas(recurso_id){
    try{
        var fechasRecurso = await Fecha.count({"recurso":recurso_id}).exec().then(count=>{
        return count;
        })
        .catch((err)=>{
        return handleError(err);

        });

        return {
        fechasRecurso:fechasRecurso
        }

        }catch(e){
        console.log(e);
        }
}


module.exports = {

    guardarFecha,
    getFechaRecurso,
    eliminarFecha,
    updateFecha,
    getContadores
}
