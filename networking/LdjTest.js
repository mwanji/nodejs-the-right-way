'use strict';

let callback;

const
  assert = require('assert'),
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

assert.equal(responses[0].key, 1);
assert.equal(responses[1].key, 2);

