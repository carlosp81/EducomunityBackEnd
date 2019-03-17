'use strict'

//LIBRERIAS
var moment = require('moment');

//MODELOS
var SeguidorRecurso = require('../models/seguidorRecurso');


/**
 * Función que permite guardar un usuario que sigue un recurso a un usuario io seguido
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function guardarSeguidorRecurso(req, res){
    var params = req.body;

    if(params.recurso){
        var seguidorRecurso = new SeguidorRecurso();
        seguidorRecurso.usuario = req.usuario.sub;
        seguidorRecurso.recurso = params.recurso;
        seguidorRecurso.fecha_creacion = moment().unix();
        seguidorRecurso.tipo = params.tipo;
        seguidorRecurso.invitacion = params.invitacion;

        seguidorRecurso.save((err, seguidorRecursoStored) => {

            if(err) return res.status(500).send({
               message: 'Error al guardar el seguimiento'
            });
            if(!seguidorRecursoStored) return res.status(404).send({ message: 'El seguimiento no se ha guardado'});
            return res.status(200).send({seguidorRecurso:seguidorRecursoStored});
        });
    }else{return res.status(200).send({message:"Debes enviar los campos necesarios"})}
}

/**
 * Función que permite eliminar un usuario que sigue un recurso educativo
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function eliminarSeguidorRecurso(req, res){

    var recursoId = req.params.id;
    var userId = req.usuario.sub;
    SeguidorRecurso.find({ 'recurso': recursoId, 'usuario': userId  }).remove(err =>{
        if(err) return res.status(500).send({message: 'Error al dejar de seguir'});
        return res.status(200).send({message: 'El follow se ha eliminado'})

    });
}

/**
 * Función que permite obtener los recursos seguidos por un usuario
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getRecursosSeguidos(req,res){
    var usuarioId;
    if(req.params.id == "yo"){
        usuarioId = req.params.sub;
    }else{
        usuarioId = req.params.id;
    }
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 7;

    if(req.params.tipo){
            var tipoRecurso = req.params.tipo;
            SeguidorRecurso.find({usuario : usuarioId, tipo : tipoRecurso}).populate({ path:'recurso'}).paginate(page, itemsPerPage, (err, recursosSeguidos, total ) => {
            if(err) return res.status(500).send({message: 'Error en el servidor :( '});
            if(recursosSeguidos == 0) return res.status(404).send({ message: 'El usuario no sigue ningún recurso de ese tipo'});
            return res.status(200).send({
                total: total,
                pages : Math.ceil(total/itemsPerPage),
                recursosSeguidos
            });
        });
    }else{
            SeguidorRecurso.find({usuario : userId}).populate({ path:'recurso'}).paginate(page, itemsPerPage, (err, recursosSeguidos, total ) => {
            if(err) return res.status(500).send({message: 'Error en el servidor :( '});
            if(recursosSeguidos == 0) return res.status(404).send({ message: 'El usuario no sigue ningún recurso'});
            return res.status(200).send({
                total: total,
                pages : Math.ceil(total/itemsPerPage),
                recursosSeguidos
            });
        });
    }


}

/**
 * Función que permite obtener los seguidores de un recurso
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getSeguidoresRecurso(req,res){

    var recursoId = req.params.recurso;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    var itemsPerPage = 10;

    SeguidorRecurso.find({recurso : recursoId}).populate({ path:'usuario'}).paginate(page, itemsPerPage, (err, seguidoresRecurso, total ) => {
        if(err) return res.status(500).send({message: 'Error en el servidor :( '});
        if(seguidoresRecurso == 0) return res.status(404).send({ message: 'El recurso no tiene seguidores'});
        return res.status(200).send({
            total: total,
            pages : Math.ceil(total/itemsPerPage),
            seguidoresRecurso
        });
    });
}

/**
 *
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function aceptarInvitacion(req, res){
    var invitacionId = req.params.invitacion;
    var update = req.body;
    update.invitacion = false;
    SeguidorRecurso.findByIdAndUpdate(invitacionId, update,{new:true}, (err, seguidorRecursoUpdate) => {

        if(err) return res.status(500).send({ message: 'error en la peticion' });
        if(!seguidorRecursoUpdate) return res.status(404).send({ message:'No se ha podido actualizar el seguimiento del recurso'});

        return res.status(200).send({seguidorRecurso: seguidorRecursoUpdate});
    });

}
module.exports = {
    guardarSeguidorRecurso,
    eliminarSeguidorRecurso,
    getRecursosSeguidos,
    getSeguidoresRecurso,
    aceptarInvitacion
}
