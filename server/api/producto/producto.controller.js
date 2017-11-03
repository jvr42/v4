/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/productos              ->  index
 * POST    /api/productos              ->  create
 * GET     /api/productos/:id          ->  show
 * PUT     /api/productos/:id          ->  update
 * DELETE  /api/productos/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Producto = require('./producto.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Productos
exports.index = function(req, res) {
  Producto.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Producto from the DB
exports.show = function(req, res) {
  Producto.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Producto in the DB
exports.create = function(req, res) {
  Producto.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Producto in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Producto.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Producto from the DB
exports.destroy = function(req, res) {
  Producto.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
