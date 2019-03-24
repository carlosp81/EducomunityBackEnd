'use strict'

//LIBRERIAS
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComentarioRecursoSchema = Schema({
 
    comentario: String,
    fecha_creacion: String,
   	usuario: { type: Schema.ObjectId, ref: 'Usuario'},
    recurso: { type: Schema.ObjectId, ref: 'RecursoEducativo'},
    misReacciones: [], // Lista de Usuarios que reaccionaron al comentario
    totalReacciones: Number, // Total de Usuarios en misReacciones      
});

module.exports = mongoose.model('ComentariosRecurso', ComentarioRecursoSchema);

// Ejemplo de una lista de misReacciones
// misReacciones: [
//     {
//         reacciones: {
//             id_usuario: 67692839823jdkjsk829829389,
//             reaccionPositiva: false,
//         },
//     },    
    
//     {
        
//         reacciones: {
//                 id_usuario: 676928398hjahasjklew665129,
//                 reaccionPositiva: true,
//             },
//     }


// ]

