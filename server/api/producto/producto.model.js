'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ProductoSchema = new Schema({
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
  pagado:{
    type:Boolean,
    default: false
  },
  pagados : {
    type: Number,
    default: 0
  } 
});

module.exports = mongoose.model('Producto', ProductoSchema);
