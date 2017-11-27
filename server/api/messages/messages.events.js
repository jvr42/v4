/**
 * Messages model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Messages = require('./messages.model');
var MessagesEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MessagesEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Messages.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MessagesEvents.emit(event + ':' + doc._id, doc);
    MessagesEvents.emit(event, doc);
  }
}

module.exports = MessagesEvents;
