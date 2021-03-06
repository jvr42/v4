/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/messages              ->  index
 * POST    /api/messages              ->  create
 * GET     /api/messages/:id          ->  show
 * PUT     /api/messages/:id          ->  update
 * DELETE  /api/messages/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Messages = require('./messages.model');

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

// Gets a list of Messagess
exports.index = function(req, res) {
  Messages.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a list of Messagess from a single user
exports.user = function(req, res) {
  Messages.findAsync({"usuario.name" : req.params.user})
      .then(handleEntityNotFound(res))
      .then(responseWithResult(res))
      .catch(handleError(res));
};

// Gets a single Messages from the DB
exports.show = function(req, res) {
  Messages.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Messages in the DB
exports.create = function(req, res) {
  Messages.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Messages in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Messages.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Messages from the DB
exports.destroy = function(req, res) {
  Messages.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
