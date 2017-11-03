/**
 * Counter model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Counter = require('./counter.model');
var CounterEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CounterEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Counter.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CounterEvents.emit(event + ':' + doc._id, doc);
    CounterEvents.emit(event, doc);
  }
}

module.exports = CounterEvents;
