'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var CajaSchema = new Schema({
  fecha: {
  	type: Date,
  	default: Date.now
  },
  nombre: String,
  cajero_asignado: Object,
  meseros_asignados: Array
});

module.exports = mongoose.model('Caja', CajaSchema);
