'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var CategoriesSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Categories', CategoriesSchema);
