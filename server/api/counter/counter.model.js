'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var CounterSchema = new Schema({
  orden_id: Number
});

module.exports = mongoose.model('Counter', CounterSchema);
