'use strict'

//LIBRERIAS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecursoEducativoSchema = Schema({
  
    usuario: { type: Schema.ObjectId, ref: 'Usuario'},
    nombre: String,
    descripcion:String, 
    cantidadComentarios:Number,
    fecha_creacion: String,
    tipo_recurso: String,
    categoria: String,
    archivo: String,
    fuente: String,//Representa la fuente de donde se sacó una noticia
 	recurso_padre: { type: Schema.ObjectId, ref: 'RecursoEducativo'} // si es null es: Blog, Evento, grupo o publicacion del muro
});

module.exports = mongoose.model('RecursosEducativo', RecursoEducativoSchema);