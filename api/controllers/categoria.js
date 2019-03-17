'use strict'

//LIBRERIAS
var moment = require('moment');

//MODELOS
var Categoria = require('../models/categoria');


/**
 * Función que permite guardar una categoría
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function guardarCategoria(req, res) {
    var params = req.body;
    var categoria = new Categoria();

    if (!params.nombre) return res.status(200).send({ message: 'Debes enviar un nombre' });


    categoria.nombre = params.nombre;
    categoria.fecha_creacion = moment().unix();

    categoria.save((err, categoriaStored) => {
        if (err) return res.status(500).send({
            message: 'Error al guardar la categoria'
        });
        if (!categoriaStored) return res.status(404).send({ message: 'La categoria no se ha guardado' });
        return res.status(200).send({ categoria: categoriaStored });
    });
}

/**
 * Función que permite eliminar una categoría
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function eliminarCategoria(req, res) {

    var categoriaId = req.params.id;
    Categoria.findByIdAndRemove(categoriaId, (err, categoriaRemoved) => {

        if (err) return res.status(500).send({ message: 'Error al borrar la categoria' });
        if (!categoriaRemoved) return res.status(404).send({ message: 'no se ha borrado la categoria' });

        return res.status(200).send({
            message: 'se ha eliminado correctamente la categoria',
            categoriaRemoved
        });
    });
}

/**
 * Función que permite obtener las categorías pagínadas
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getCategorias(req, res) {

    var page = 1;
    if (req.params.page) {

        page = req.params.page;
    }
    var itemsPerPage = 5;

    Categoria.find().sort('_id').paginate(page, itemsPerPage, (err, categorias, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!categorias) return res.status(404).send({ message: 'No hay categorias disponibles' });

        return res.status(200).send({
            total,
            pages: Math.ceil(total / itemsPerPage),

            itemsPerPage,
            categorias
        });
    });
}

/**
 * Función que permite obtener las categorías sin paginar
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function getCategoriasSinPaginar(req, res) {

    Categoria.find({}, (err, categorias, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!categorias) return res.status(404).send({ message: 'No hay categorias disponibles' });

        return res.status(200).send({
            total,
            categorias

        });
    });
}

/**
 * Función que permite editar una categoría
 * 
 * @param {*} req  atributos que recibe del frontend
 * @param {*} res  respuesta que da al frontend
 */
function updateCategoria(req, res) {
    var categoriaId = req.params.id;
    var update = req.body;
    if (!update.nombre) { return res.status(200).send({ message: 'Debe ingresar la edición del nombre de la categoria' }); }
    Categoria.findByIdAndUpdate(categoriaId, update, { new: true }, (err, categoriaUpdate) => {

        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!categoriaUpdate) return res.status(404).send({ message: 'No se ha podido actualizar la categoria' });

        return res.status(200).send({
            message: 'Se ha actualizado la información',
            categoria: categoriaUpdate
        });
    });
}

module.exports = {
    guardarCategoria,
    eliminarCategoria,
    getCategorias,
    updateCategoria,
    getCategoriasSinPaginar
}
