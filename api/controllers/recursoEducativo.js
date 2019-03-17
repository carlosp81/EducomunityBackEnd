'use strict'

//LIBRERIAS
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

//MODELOS
var RecursoEducativo = require('../models/recursoEducativo');
var Seguidor = require('../models/seguidor');
var SeguidorRecurso = require('../models/seguidorRecurso')
var Usuario = require('../models/usuario');


//SERVICIOS
var jwt = require('../services/jwt');

/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function probando(req, res) {
    res.status(200).send({
        message: "Hola desde el recurso educativo mi pex"
    });
}

/**
 * EL usuario con sesión crea un nuevo recurso educativo
 *
 * @param {*} req
 * @param {*} res
 */
function guardarRecursos(req, res) {

    var params = req.body;
    var recursoEducativo = new RecursoEducativo();
    console.log(params)
    if (params.descripcion) {

        recursoEducativo.nombre = params.nombre;
        recursoEducativo.descripcion = params.descripcion;
        recursoEducativo.fecha_creacion = moment().unix();
        recursoEducativo.tipo_recurso = params.tipo_recurso;
        recursoEducativo.archivo = params.archivo;
        recursoEducativo.categoria = params.categoria;
        recursoEducativo.usuario = req.usuario.sub;
        recursoEducativo.fuente = req.fuente;
        recursoEducativo.fecha_inicio = req.fecha_inicio;
        recursoEducativo.fecha_finalizacion = req.fecha_finalizacion;
        recursoEducativo.recurso_padre = params.recurso_padre; // si no es null es porque es un post o una publi en grupo
        recursoEducativo.cantidadComentarios = params.cantidadComentarios ;

        recursoEducativo.save((err, recursoStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar el recurso' });
            if (!recursoStored) return res.status(404).send({ message: 'la publicacion no ha sido guardada' });

            return res.status(200).send({ recursoEducativo: recursoStored });
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
function guardarPublicaciones(req, res) {

    var params = req.body;
    var recursoEducativo = new RecursoEducativo();

    if (!params.descripcion) {
        if (!params.archivo) {
            return res.status(200).send({ message: 'Debes enviar una descripcion o un archivo!!' });
        }
    }

    recursoEducativo.descripcion = params.descripcion;
    recursoEducativo.fecha_creacion = moment().unix();
    recursoEducativo.tipo_recurso = 'Publicacion';
    recursoEducativo.archivo = null;
    recursoEducativo.usuario = req.usuario.sub;

    recursoEducativo.save((err, recursoStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar el recurso' });
        if (!recursoStored) return res.status(404).send({ message: 'la publicacion no ha sido guardada' });

        return res.status(200).send({ recursoEducativo: recursoStored });
    });
}

/**
 * El usuario obtiene sus recursos educativos
 *
 * @param {*} req
 * @param {*} res
 */
function getRecursos(req, res) {

    var page = 1;
    if (req.params.page) {
        page = req.params.page;

    }
    var itemsPerPage = 5;
    Seguidor.find({ usuario: req.usuario.sub }).populate('usuario_seguido').exec((err, follows) => {

        if (err) return res.status(500).send({ message: 'Error devolver seguimiento' });
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.usuario_seguido);
        });

        follows_clean.push(req.usuario.sub);//esta linea hace que se muestren mis publicaciones
        RecursoEducativo.find({ usuario: { "$in": follows_clean } }).sort('-fecha_creacion').populate('usuario').paginate(page, itemsPerPage, (err, recursoEducativo, total) => {
            if (err) return res.status(500).send({ message: 'Error al devolver recurso' });
            if (!recursoEducativo) return res.status(404).send({ message: 'no hay publicaciones' });
            return res.status(200).send({

                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                itemsPerPage: itemsPerPage,
                recursoEducativo
            });
        });

    });

}
/**
 * Metodo para conseguir un recurso a partir de su id
 *
 * @param {*} req
 * @param {*} res
 */
function getRecursoEducativo(req, res) {

  var recursoId = req.params.id;
  var usuarioId = req.usuario.sub;
  RecursoEducativo.findById(recursoId, (err, recursoEducativo) => {
           if(err) return res.status(500).send({message: 'Error en la petición'});
           if(!recursoEducativo) return res.status(400).send({message: 'El recurso no existe'});
      followThisRecursoEducativo(usuarioId, recursoId).then((value) => {
          return res.status(200).send({
              recursoEducativo,
              seguidor: value.siguiendo
          });
      });
  });
}

/**
 * Función que permite saber si un usuario sigue a otro usuario
 *
 * @param {*} identity_user_id id del usuario logeado
 * @param {*} recursoEducativo_id id del usuario seguido
 */
async function followThisRecursoEducativo(identity_user_id, recursoEducativo_id){
    try {
        var siguiendo = await SeguidorRecurso.findOne({ usuario: identity_user_id, recurso: recursoEducativo_id}).exec()
            .then((siguiendo) => {

                return siguiendo;
            })
            .catch((err)=>{
                return handleerror(err);
            });
        return {
            siguiendo: siguiendo
        }
    } catch(e){
        console.log(e);
    }
}
/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function getRecursosUsuario(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;

    }
    var itemsPerPage = 5;
    var user = req.usuario.sub;
    if (req.params.usuario) {
        user = req.params.usuario;
    }

    RecursoEducativo.find({ usuario: user }).sort('-fecha_creacion').populate('usuario').paginate(page, itemsPerPage, (err, recursoEducativo, total) => {
        if (err) return res.status(500).send({ message: 'Error al devolver recurso' });
        if (!recursoEducativo) return res.status(404).send({ message: 'EL usuario no ha creado recursos educativos' });
        return res.status(200).send({

            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            recursoEducativo
        });
    });
}

/**
 * Método para que el administrado pueda eliminar un recurso específico
 *
 * @param {*} req
 * @param {*} res
 */
function eliminarRecurso(req, res) {

    var recursoId = req.params.id;
    RecursoEducativo.findByIdAndRemove(recursoId, (err, recursoRemoved) => {

        if (err) return res.status(500).send({ message: 'Error al borrar el recurso' });
        if (!recursoRemoved) return res.status(404).send({ message: 'no se ha borrado la publicacion' });

        return res.status(200).send({ recurso: recursoRemoved });
    });
}

/**
 * Método para que un usuario logeado pueda eliminar algún recurso que haya creado
 *
 * @param {*} req
 * @param {*} res
 */
function eliminarMiRecurso(req, res) {

    var recursoId = req.params.id;
    RecursoEducativo.find({ 'usuario': req.usuario.sub, '_id': recursoId }).remove(err => {

        if (err) return res.status(500).send({ message: 'Error al borrar el recurso' });
        return res.status(200).send({ recurso: 'el recurso se ha eliminado correctamente' });
    });
}

/**
 * Método para que el usuario logeado pueda subir un archivo al recurso
 *
 * @param {*} req
 * @param {*} res
 */
function uploadArchivo(req, res) {

    var recursoId = req.params.id;
    if (req.files) {
        var file_path = req.files.archivo.path;
        var files_split = file_path.split('\/');
        var file_name = files_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];


        if (file_ext == 'png' ||  file_ext == 'mp4' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            RecursoEducativo.findOne({ 'usuario': req.usuario.sub, '_id': recursoId }).exec((err, recursoEducativo) => {
                if (recursoEducativo) {
                    //actualizar el documento del recurso
                    RecursoEducativo.findByIdAndUpdate(recursoId, { archivo: file_name }, { new: true }, (err, recursoUpdate) => {

                        if (err) return res.status(500).send({ message: 'error en la peticion' });
                        if (!recursoUpdate) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

                        return res.status(200).send({ recursoEducativo: recursoUpdate });
                    });

                } else {
                    return removeFilesOfUploads(res, file_path, 'No teines permiso para actualizar este recurso');
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
 * Método para que el usuario pueda eliminar un archivo subido a un recurso educativo
 *
 * @param {*} res
 * @param {*} file_path
 * @param {*} message
 */
function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

/**
 * Método para que el usuario pueda obtener los archivos subidos al recurso educativo
 *
 * @param {*} req
 * @param {*} res
 */
function getArchivoFile(req, res) {
    var archivo_File = req.params.archivo;
    var path_file = './uploads/recursoseducativos/' + archivo_File;
    fs.exists(path_file, (exists) => {

        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}

/**
 * Método que permite editar los datos de una recurso educativo
 *
 * @param {*} req
 * @param {*} res
 */
function updateRecurso(req, res) {

    var recursoId = req.params.id;
    var update = req.body;
    RecursoEducativo.findByIdAndUpdate(recursoId, update, { new: true }, (err, recursoUpdate) => {

        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!recursoUpdate) return res.status(404).send({ message: 'No se ha podido actualizar el recurso' });

        return res.status(200).send({ recurso: recursoUpdate });
    });
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function getRecursosEducativosPorTipoCategoria(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    if (!req.params.tipo && !req.params.categoria) {
        return res.status(200).send({ message: 'Debes enviar un tipo o una categoria de busqueda' });
    }

    var categoriaRecurso = req.params.categoria;
    var tipoRecurso = req.params.tipo;

    if (req.params.tipo && !req.params.categoria) {
        RecursoEducativo.find({ tipo_recurso: tipoRecurso }).sort('-fecha_creacion').populate('recursoEducativo').paginate(page, itemsPerPage, (err, recursoEducativo, total) => {
            if (err) return res.status(500).send({ message: 'Error al devolver recurso' });
            if (recursoEducativo == 0) return res.status(404).send({ message: 'No existen recursos educativos de este tipo' });
            return res.status(200).send({

                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                itemsPerPage: itemsPerPage,
                recursoEducativo
            });
        });
    }
    if (req.params.tipo == "todos" && req.params.categoria) {
        RecursoEducativo.find({ categoria: categoriaRecurso }).sort('-fecha_creacion').populate('recursoEducativo').paginate(page, itemsPerPage, (err, recursoEducativo, total) => {
            if (err) return res.status(500).send({ message: 'Error al devolver recurso' });
            if (categoriaRecurso == 0) return res.status(404).send({ message: 'No existen recursos educativos de esta categoria' });
            return res.status(200).send({

                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                itemsPerPage: itemsPerPage,
                recursoEducativo
            });
        });
    }
    if (req.params.tipo && req.params.categoria) {
        RecursoEducativo.find({ categoria: categoriaRecurso, tipo_recurso: tipoRecurso }).sort('-fecha_creacion').populate('recursoEducativo').paginate(page, itemsPerPage, (err, recursoEducativo, total) => {
            if (err) return res.status(500).send({ message: 'Error al devolver recurso' });
            if (categoriaRecurso == 0) return res.status(404).send({ message: 'No existen recursos educativos de esta categoria o tipo' });
            return res.status(200).send({

                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                itemsPerPage: itemsPerPage,
                recursoEducativo
            });
        });
    }
}
/**
 *
 * @param {*} req
 * @param {*} res
 */
function getRecursosEducativosPorTipo(req, res) {

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    if (!req.params.tipo) {
        return res.status(200).send({ message: 'Debes enviar un tipo de busqueda' });
    } else {
        var tipoRecurso = req.params.tipo;
        RecursoEducativo.find({ tipo_recurso: tipoRecurso }).sort('-fecha_creacion').populate({ path: 'recursoEducativo usuario' }).paginate(page, itemsPerPage, (err, recursoEducativo, total) => {
            if (err) return res.status(500).send({ message: 'Error al devolver recurso' });
            if (recursoEducativo == 0) return res.status(404).send({ message: 'No existen recursos educativos de este tipo' });
            return res.status(200).send({

                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                itemsPerPage: itemsPerPage,
                recursoEducativo
            });
        });
    }

}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function getRecursosEducativosHijos(req, res) {

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;
    var recursoPadre = req.params.recurso_padre;

    RecursoEducativo.find({ recurso_padre: recursoPadre }).sort('-fecha_creacion').populate({ path: 'recursoEducativo usuario' }).paginate(page, itemsPerPage, (err, recursoEducativo, total) => {
        if (err) return res.status(500).send({ message: 'Error al devolver recurso' });
        if (recursoEducativo == 0) return res.status(404).send({ message: 'No existen recursos educativos hijos' });
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            recursoEducativo
        });
    });
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function getRecursosEducativosPorTipoUsuario(req, res) {

    var page = 1;
    if (req.params.page) {
        page = req.params.page;

    }
    var itemsPerPage = 5;
    var user = req.usuario.sub;
    if (req.params.usuario) {
        user = req.params.usuario;
    }
    var tipoRecurso = req.params.tipo;
    RecursoEducativo.find({ usuario: user, tipo_recurso: tipoRecurso }).sort('-fecha_creacion').populate('usuario').paginate(page, itemsPerPage, (err, recursoEducativo, total) => {
        if (err) return res.status(500).send({ message: 'Error al devolver recurso' });
        if (!recursoEducativo) return res.status(404).send({ message: 'EL usuario no ha creado recursos educativos' });
        return res.status(200).send({

            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            recursoEducativo
        });
    });
}
/**
 * Contadores
 *
 * @param {*} req
 * @param {*} res
 */
function getContadores(req, res){
    var recursoId = req.params.id;

    getContadorSeguidores(recursoId).then((value) => {
        return res.status(200).send(value);
    });
}

async function getContadorSeguidores(recurso_id){
    try{
        var seguidores = await SeguidorRecurso.count({"recurso":recurso_id}).exec().then(count=>{
        return count;
        })
        .catch((err)=>{
        return handleError(err);

        });

        return {
        seguidores:seguidores
        }

        }catch(e){
        console.log(e);
        }
}


module.exports = {
    probando,
    guardarRecursos,
    getRecursos,
    getRecursoEducativo,
    eliminarRecurso,
    eliminarMiRecurso,
    uploadArchivo,
    getArchivoFile,
    guardarPublicaciones,
    getRecursosUsuario,
    updateRecurso,
    getRecursosEducativosPorTipoCategoria,
    getRecursosEducativosPorTipo,
    getRecursosEducativosPorTipoUsuario,
    getRecursosEducativosHijos,
    getContadores
}
