'use strict';

const
  events = require('events'),
  util = require('util'),
  Ldj = function (stream) {
    events.EventEmitter.call(this);
    let self = this;
    let buffer = '';
    
    stream.on('data', function (data) {
      buffer += data;
      let boundary = buffer.indexOf('\n');
      if (boundary !== -1) {
        self.emit('message', JSON.parse(buffer));
        buffer = '';
      }
    });
  };

util.inherits(Ldj, events.EventEmitter);

exports.connect = function (stream) {
  return new Ldj(stream);
};

