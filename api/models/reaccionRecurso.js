'use strict'

//LIBRERIAS
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReaccionRecursoSchema = Schema({
 
    usuario: { 
           type: Schema.ObjectId, 
           ref: 'Usuario'
    },

    reaccionPositiva: Boolean,

    recurso_padre: { 
        type: Schema.ObjectId, 
        ref: 'RecursoEducativo'
    }, // si es null es: Blog, Evento, grupo o publicacion del muro
    
    recurso: { 
        type: Schema.ObjectId, 
        ref: 'RecursoEducativo'
    },  // Recursos a los que ha reaccionado    
    
});

module.exports = mongoose.model('ReaccionRecurso', ReaccionRecursoSchema);