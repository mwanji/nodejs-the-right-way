'use strict';

let callback;

const
  Ldj = require('./Ldj.js'),
  stream = {
    on: function (type, fn) {
      callback = fn;
    }
  },
  client = Ldj.connect(stream),
  responses = [];

client.on('message', function (message) {
  responses.push(message);
});

callback('{"key":1}\n');
callback('{"key":2}\n');

if (responses[0].key !== 1 || responses[1].key !== 2) {
  console.error('FAILURE: \n' + responses[0] + '\n' + responses[1]);
}

