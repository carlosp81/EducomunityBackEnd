'use strict'

//MODELOS
var Usuario = require('../models/usuario');
var Seguidor = require('../models/seguidor');
var RecursosEducativos = require('../models/recursoEducativo');

//LIBRERIAS
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

//SERVICIOS
var jwt = require('../services/jwt');

/**
 * Función de prueba
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function home(req, res){

    res.status(200).send({
        message : 'Hola mundo'
    });

}

/**
 * Función de prueba
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function pruebas(req,res) {
res.status(200).send({
    message : 'Accion de pruebas en el servidor nodejs'
});

}

/**
 * Función que permite eliminar un usuario
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function eliminarUsuario(req, res){

    var usuarioId = req.params.id;
    Usuario.findByIdAndRemove(usuarioId, (err, usuarioRemoved) => {

        if(err) return res.status(500).send({message: 'Error al borrar el usuario'});
        if(!usuarioRemoved) return res.status(404).send({message: 'no se ha borrado el usuario'});

        return res.status(200).send({
            message : 'se ha eliminado correctamente el usuario',
            usuarioRemoved});
    });
}

/**
 * Función que permite guardar un usuario
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function guardarUsuario(req, res){
       var params = req.body;//recoge los parametros de las peticiones-todos los campos que lleguen por post se guardan en esta variable

       var usuario = new Usuario();

       if(params.nombre && params.apellido && params.email && params.password){

        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;
        usuario.email = params.email;
        usuario.fecha_creacion = moment().unix();
        usuario.ciudad = params.ciudad;
        usuario.telefono = params.telefono;
        usuario.ocupacion = params.ocupacion;
        usuario.universidad = params.universidad;
        usuario.rol = params.rol;
        usuario.estado = 'Activo';
        usuario.foto = params.foto;

        //controlar usuarios duplicados
        Usuario.find({
             email: usuario.email.toLowerCase()
        }).exec((err, usuarios) => {
            if(err) return res.status(500).send({ message: 'Error en la peticion'});

            if(usuarios && usuarios.length >= 1){
                return res.status(200).send({message:'El usuario que intenta registrar ya existe'});
            }else{
                 //cifrar password y guardar datos
        bcrypt.hash(params.password, null, null, (err,hash) => {
            usuario.password = hash;

            usuario.save((err, userStored) => {
               if(err) return res.status(500).send({message:'Error al guardar el usuario'});

               if(userStored){
                   res.status(200).send({usuario: userStored});
               }else{
                   res.status(404).send({message: 'No se ha registrado el usuario'});
                    }
                });
                });
                }
                                });
           }else{
           res.status(200).send({
               message : 'Envia todos los datos necesarios'
           });
       }
}

/**
 * Función que permite a un usuario hacer el login
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function loginUsuario(req, res){
     var params = req.body;

     var email = params.email;
     var password = params.password;

     Usuario.findOne( { email:email} , (err, usuario) =>{
        if(err) return res.status(500).send({message: 'Error en la petición'});
        if(usuario){
            bcrypt.compare(password, usuario.password, (err, check) =>{
                if(check){

                    if(params.gettoken){
                     //devuelve un token
                     //generar el token
                     return res.status(200).send({
                         token: jwt.createToken(usuario)
                     });
                    }else{
                    //devolver datos del usuario
                    return res.status(200).send({usuario});
                    }

                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido logear'});
                }
            });

        }else{
            return res.status(404).send({message: 'El usuario no se ha podido logear'});
        }
     });

}

/**
 * Función que permite obtener un usuario
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getUsuario(req, res){

    var userId = req.params.id;
    Usuario.findById(userId, (err, usuario) => {
             if(err) return res.status(500).send({message: 'Error en la petición'});
             if(!usuario) return res.status(400).send({message: 'El usuario no existe'});
        followThisUser(req.usuario.sub, userId).then((value) => {
            return res.status(200).send({
                usuario,
                seguidor: value.siguiendo,
                seguido : value.seguido
            });
        });
    });
}

/**
 * Función que permite saber si un usuario sigue a otro usuario
 *
 * @param {*} identity_user_id id del usuario logeado
 * @param {*} user_id id del usuario seguido
 */
async function followThisUser(identity_user_id, user_id){
    try {
        var siguiendo = await Seguidor.findOne({ usuario: identity_user_id, usuario_seguido: user_id}).exec()
            .then((siguiendo) => {

                return siguiendo;
            })
            .catch((err)=>{
                return handleerror(err);
            });
        var seguido = await Seguidor.findOne({ usuario: user_id, usuario_seguido: identity_user_id}).exec()
            .then((seguido) => {

                return seguido;
            })
            .catch((err)=>{
                return handleerror(err);
            });
        return {
            siguiendo: siguiendo,
            seguido: seguido
        }
    } catch(e){
        console.log(e);
    }
}

/**
 * Función que permite obtener un listado de usuarios paginados
 *
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getUsuarios(req, res){
    var identity_user_id = req.usuario.sub;
    var page = 1;
    if(req.params.page){

        page = req.params.page;
    }
    var itemsPerPage = 5 ;

    Usuario.find().sort('_id').paginate(page, itemsPerPage, (err, usuarios, total) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarios) return res.status(404).send({ message: 'No hay usuarios disponibles'});

        idDeUsuariosSeguidos(identity_user_id).then((value) => {
            return res.status(200).send({
                usuarios,
                seguidores: value.seguidores,
                usuarios_seguidos: value.seguidos,
                total,
                pages: Math.ceil(total/itemsPerPage)
             });
        });

    });
}

/**
 *
 * @param {*} identity_user_id
 * @param {*} user_id
 */
async function idDeUsuariosSeguidos(user_id){
    try{
    var seguidores = await Seguidor.find({"usuario": user_id}).select({'_id':0, '__v':0, 'usuario':0}).exec()
    .then((follows) => {
        return follows;
    })
    .catch((err)=>{
    return handleError(err)
    });

      var seguidos = await Seguidor.find({"usuario_seguido": user_id}).select({'_id':0, '__v':0, 'usuario_seguido':0}).exec()
      .then((follows)=>{
      return follows;
      })
      .catch((err)=>{
      return handleError(err)
      });

            //Procesar following Ids
                var seguidores_clean = [];

                seguidos.forEach((follow) => {
                    seguidores_clean.push(follow.usuario);
                });

                //Procesar followed Ids
                var seguidos_clean = [];

                seguidores.forEach((follow) => {
                    seguidos_clean.push(follow.usuario_seguido);
                });


            return {
                     seguidores: seguidores_clean,
                     seguidos: seguidos_clean
                   }

          } catch(e){
          console.log(e);
          }
    }

/**
 * Función que permite editar un usuario
 *
 * @param {*} req
 * @param {*} res
 */
function updateUsuario(req, res){
    var userId = req.params.id;
    var update = req.body;
    //borrar la propiedad password
    delete update.password;
    if(userId != req.usuario.sub){
        return res.status(500).send({
            message: ' No tienes permiso para actualizar los datos del usuario identificado'
        });
    }
    Usuario.findByIdAndUpdate(userId, update,{new:true}, (err, userUpdate) => {

        if(err) return res.status(500).send({ message: 'error en la peticion' });
        if(!userUpdate) return res.status(404).send({ message:'No se ha podido actualizar el usuario'});

        return res.status(200).send({usuario: userUpdate});
    });
}
/**
 * Función que permite cargar una imagen al usuario
 *
 * @param {*} req
 * @param {*} res
 */
function uploadImagen(req, res){
    var userId = req.params.id;


    if(req.files){
        var file_path = req.files.foto.path;
        var files_split = file_path.split('\/');
        var file_name = files_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(userId != req.usuario.sub){
           return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos de usuario' );
        }

        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //actualizar el documento de usuario logueado

            Usuario.findByIdAndUpdate(userId, {foto: file_name}, {new:true}, (err, userUpdate) =>{

                if(err) return res.status(500).send({ message: 'error en la peticion' });
                if(!userUpdate) return res.status(404).send({ message:'No se ha podido actualizar el usuario'});

                return res.status(200).send({usuario: userUpdate});
            });

        }else{

          return  removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    }else{
        return res.status(200).send({message: 'No se han subido imagenes'});
    }
}
function removeFilesOfUploads(res, file_path , message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message});
    });
}

/**
 * Función que permite obtener la imagen de un usuario
 *
 * @param {*} req
 * @param {*} res
 */
function getFotoFile(req, res){
    var foto_File = req.params.foto;
    var path_file = './uploads/users/'+foto_File;
    fs.exists(path_file, (exists) => {

        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({ message: 'No existe la imagen'});
        }
    });
}
/**
 * Contadores
 *
 * @param {*} req
 * @param {*} res
 */
function getContadores(req, res){
    let userId = req.usuario.sub;    

    if(req.params.id){
      userId = req.params.id;
    }
    getContadorSeguidores(userId).then((value) => {
        return res.status(200).send(value);
    });
}

async function getContadorSeguidores(user_id){
    try{
        var seguidos = await Seguidor.count({"usuario":user_id}).exec().then(count=>{
        return count;
        })
        .catch((err)=>{
        return handleError(err);

        });

        var seguidores = await Seguidor.count({"usuario_seguido":user_id}).exec().then(count=>{
        return count;
        })
        .catch((err)=>{
        return handleError(err);
        });

        var recursos = await RecursosEducativos.count({'usuario': user_id}).exec().then(count =>{
            return count
        })
        .catch((err) => {
            return handleError(err);
        });
        return {
        seguidos:seguidos,
        seguidores:seguidores,
        recursos_educativos: recursos
        }

        }catch(e){
        console.log(e);
        }
}

module.exports = {

    home,
    pruebas,
    guardarUsuario,
    loginUsuario,
    getUsuario,
    getUsuarios,
    updateUsuario,
    uploadImagen,
    getFotoFile,
    getContadores,
    eliminarUsuario
}
