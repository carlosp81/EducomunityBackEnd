'use strict'

//MODELOS
var Seguidor = require('../models/seguidor');

/**
 * Función que permite seguir a un usuario io seguido
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function saveFollow(req, res){
    const params = req.body;
    const seguidor = new Seguidor();

    seguidor.usuario = req.usuario.sub; // Usuario logueado - con token
    seguidor.usuario_seguido = params.usuario_seguido; // Usuario visitante - sin token

    seguidor.save((err, followStored) => {

        if (err) return res.status(500).send({
           message: 'Error al guardar el seguimiento'
        });
        if (!followStored) return res.status(404).send({ message: 'El seguimiento no se ha guardado'});
        return res.status(200).send({seguidor:followStored});
    });
  
}
/**
 * Función que permite dejar de seguir a un usuario seguido
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function deleteFollow(req, res){
    var userId = req.usuario.sub;
    var followId = req.params.id;

    Seguidor.find({ 'usuario': userId , 'usuario_seguido': followId}).remove(err =>{
        if(err) return res.status(500).send({message: 'Error al dejar de seguir'});
        return res.status(200).send({message: 'El follow se ha eliminado'})

    });
}

/**
 * Función que permite obtener los usuarios seguidos 
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getUsuariosSeguidos(req,res){
    var userId = req.usuario.sub;

    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;
    
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }
    
    var itemsPerPage = 5;
    Seguidor.find({usuario:userId}).populate({ path:'seguidos usuario_seguido'}).paginate(page, itemsPerPage, (err, seguidos, total ) => {
        if(err) return res.status(500).send({message: 'Error en el servidor :( '});
        if(!seguidos) return res.status(404).send({ message: 'No estas siguiendo usuarios'});
       
        idDeUsuariosSeguidos(req.usuario.sub).then((value) => {
        return res.status(200).send({
            
            total: total,
            pages : Math.ceil(total/itemsPerPage),
            seguidos,
            seguidores: value.seguidores,
            usuarios_seguidos: value.seguidos,
            itemsPerPage: itemsPerPage,
            page:page
            
        });
    });
    });
}
/**
 * Función que permite obtener los usuarios que siguen a mi usuario
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getUsuariosSeguidores(req,res){
    
    var userId = req.usuario.sub;

    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;
    
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }
    
    var itemsPerPage = 5;

    Seguidor.find({usuario_seguido:userId}).populate({ path:'seguidores usuario'}).paginate(page, itemsPerPage, (err,seguidores, total ) => {
        if(err) return res.status(500).send({message: 'Error en el servidor :( '});
        if(!seguidores) return res.status(404).send({ message: 'No te sigue ningun usuario'});
        idDeUsuariosSeguidos(req.usuario.sub).then((value) => {
            return res.status(200).send({
                
                total: total,
                pages : Math.ceil(total/itemsPerPage),
                seguidos:value.seguidos,
                seguidores,
                usuarios_seguidos: value.seguidos,
                itemsPerPage,
                page:page  
            });
        });
    });
}
/**
 * Función que permite obtener los usuarios que sigue mi usuario
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getMisSeguidos(req,res){
    var userId = req.usuario.sub;

    var find= Seguidor.find({usuario: userId});
   
    if(req.params.usuario_seguido){
        
        find = Seguidor.find({usuario_seguido: userId});
    }

    find.populate('usuario usuario_seguido').exec((err, follows) => { 

        if(err) return res.status(500).send({message: 'error en el servidor'});

        if(!follows  ) return res.status(404).send({message: 'No sigues a ningun usuario'}); 
        return res.status(200).send({follows});

     });

}
/**
 * 
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
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
module.exports = {
    saveFollow,
    deleteFollow,
    getUsuariosSeguidos,
    getUsuariosSeguidores,
    getMisSeguidos
}