'use strict'

//LIBRERIAS
const moment = require('moment');

//MODELOS
const ComentarioRecurso = require('../models/comentarioRecurso');
const reaccionRecurso = require('../models/reaccionRecurso')


/**
 * Función que permite guardar un comentario
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function guardarComentarioRecurso(req, res) {

    let params = req.body;// parámetros
    let comentarioRecurso = new ComentarioRecurso();
    console.log(req)
    if (params.comentario && params.recurso) {

        comentarioRecurso.fecha_creacion = moment().unix();
        comentarioRecurso.usuario = req.usuario.sub;
        comentarioRecurso.recurso = params.recurso;
        comentarioRecurso.comentario = params.comentario;
        comentarioRecurso.recurso.cantidadComentarios ++;
        console.log(comentarioRecurso.recurso)
        comentarioRecurso.save((err, comentarioRecursoStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar el comentario' });
            if (!comentarioRecursoStored) return res.status(404).send({ message: 'El comentario no se ha guardado' });
            return res.status(200).send({
                comentarioRecurso: comentarioRecursoStored
            });
        });
    } else {
        return res.status(200).send({ message: 'Debes enviar un comentario a un recurso' });
    }  
}

/**
 * Función que permite eliminar un comentario
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function eliminarComentarioRecurso(req, res) {

    var comentarioRecursoId = req.params.id;

    ComentarioRecurso.find({ 'usuario': req.usuario.sub, '_id': comentarioRecursoId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error al borrar el comentario' });
        return res.status(200).send({ ComentarioRecurso: 'el comentario se ha eliminado correctamente' });
    });
}

/**
 * Función que permite editar un comentario
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function updateComentarioRecurso(req, res) {

    let comentarioRecursoId = req.params.id;
    let update = req.body;

    if (!update.comentario) { return res.status(200).send({ message: 'Debe ingresar la edición del comentario' }); }
    ComentarioRecurso.findByIdAndUpdate(comentarioRecursoId, update, { new: true }, (err, comentarioUpdate) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!comentarioUpdate) return res.status(404).send({ message: 'No se ha podido actualizar el comentario' });
        return res.status(200).send({ comentarioRecurso: comentarioUpdate });
    });
}

/**
 * Función que permite obtener los comentarios de un recurso
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getComentariosRecurso(req, res) {
    let page = 1;
    let itemsPerPage = 5;
    let recursoId = req.params.id;

    if (req.params.page) {
        page = req.params.page;
    }
    
    ComentarioRecurso.find({ recurso: recursoId })
        .sort('-fecha_creacion')
        .populate('usuario')
        .paginate(page, itemsPerPage, (err, comentarios, total) => {
            if (err) 
                return 
                res.status(500)
                   .send({ message: 'Error al devolver los comentarios del recurso' });
            if (!comentarios) 
                return 
                res.status(404).send({ message: 'no hay comentarios en el recurso' });
                return res.status(200).send({

                    total_items: total,
                    pages: Math.ceil(total / itemsPerPage),
                    page: page,
                    itemsPerPage: itemsPerPage,
                    comentarios
                });
            });   
}

/* function guardarReaccionComentario(req, res) {
    
     const params = req.body; // parámetros
     const reaccionRecurso = new ReaccionRecurso();
    
     console.log(req)
    
     if (params.comentario && params.recurso) {

         // comentarioRecurso.misReacciones = [];
         reaccionRecurso.usuario = req.usuario.id;
         reaccionRecurso.reaccionPositiva = req.reaccionPositiva.id;


         // comentarioRecurso.misReacciones.push({
         //     id_usuario: reaccionRecurso.usuario,
         //     reaccionPositiva: reaccionRecurso.reaccionPositiva
         // })

         reaccionRecurso.save((err, reaccionRecurso) => {
              if (err) return res.status(500).send({ message: 'Error al dar Me gusta' });
              if (!reaccionRecurso) return res.status(404).send({ message: 'Tu reaccion no se ha guardado correctamente' });
              return res.status(200).send({
                     reaccionPositiva: reaccionRecurso
              });
          });
      } else {
          return res.status(200).send({ message: 'Debes enviar un comentario a un recurso' });
     }
} */

module.exports = {
    guardarComentarioRecurso,
    eliminarComentarioRecurso,
    updateComentarioRecurso,
    getComentariosRecurso,
    // reaccionComentario
}