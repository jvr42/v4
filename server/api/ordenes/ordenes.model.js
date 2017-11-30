'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var Producto = new Schema({
  _id: Number,  
  name: String,
  precio: Number,
  cantidad:  {
    type: Number,
    default: 1
  },
  tipo: String,
  servido:  {
    type: Boolean,
    default: false
  },
  pagado :{
  	type: Boolean,
  	default: false
  },
  pagados : {
    type: Number,
    default: 0
  },
  observacion: String 
});

var OrdenesSchema = new Schema({
	tipo: String,
	total: Number,
	servida: Boolean,
	productos: [Producto],
	mesa: String,
	fecha_alt: String,
	fecha: Number,
	orden_id: Number,
	status: String,
	usuario: {},
  ultimoEditor: {},
	propina: Boolean,
	numeroBoleta: Number,
	fechaCierre: Number,
	descuento: {
    type:[],
    default: []
  },
  tipoPago: String,
  fechaEditado: Number,
  observacion_pedido: String,
  observacion_descuento: {
    type:[],
    default: []
  },
  observacion: String,
  propinaPagada: Number,
  observaciones: {
    type:[],
    default: []
  }
});

module.exports = mongoose.model('Ordenes', OrdenesSchema);