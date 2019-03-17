'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'quis' ;

exports.createToken = function(usuario){

    var payload = {
          sub: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          fecha_creacion: usuario.fecha_creacion,
          email: usuario.email,
          ciudad: usuario.ciudad,
          telefono: usuario.telefono,
          facebook: usuario.facebook,
          linkedin: usuario.linkedin,
          rol: usuario.rol,
          estado: usuario.estado,
          foto: usuario.foto,
          iat: moment().unix(), //fecha de creacion del token
          exp: moment().add(30,'days').unix //fecha de expiracion del token
    };
    return jwt.encode( payload, secret);
//dentro del token se encriptan los datos del usuario
};