/**
 * Caja model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Caja = require('./caja.model');
var CajaEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CajaEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Caja.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CajaEvents.emit(event + ':' + doc._id, doc);
    CajaEvents.emit(event, doc);
  }
}

module.exports = CajaEvents;
