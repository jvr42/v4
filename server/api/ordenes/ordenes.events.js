/**
 * Ordenes model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Ordenes = require('./ordenes.model');
var OrdenesEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OrdenesEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Ordenes.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    OrdenesEvents.emit(event + ':' + doc._id, doc);
    OrdenesEvents.emit(event, doc);
  }
}

module.exports = OrdenesEvents;
