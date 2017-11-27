'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;


var MessagesSchema = new Schema({
  usuario: {
    name: String,
    rut: String,
    role: {
      type: String,
      default: 'administrador'
    },
    password: String,
    provider: String,
    salt: String
  },
  producto: {
    name: String,
    precio: Number,
    cantidad: {
      type: Number,
      default: 1
    },
    tipo: String,
    servido: {
      type: Boolean,
      default: false
    },
    pagado: {
      type: Boolean,
      default: false
    },
    pagados: {
      type: Number,
      default: 0
    }
  },
  createdOn: Date,
  read: Boolean
});

module.exports = mongoose.model('Messages', MessagesSchema);
