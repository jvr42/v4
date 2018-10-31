/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/cajas', require('./api/caja'));
  app.use('/api/categories', require('./api/categories'));
  app.use('/api/messages', require('./api/messages'));
  app.use('/api/counter', require('./api/counter'));
  app.use('/api/ordenes', require('./api/ordenes'));
  app.use('/api/productos', require('./api/producto'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
