'use strict';

const
  messageReader = require('./MessageReader').MessageReader(),
  assert = require('assert');

let fileName, messageFile, messageTimestamp, expectedTimestamp;

messageReader.on('watching', function (file) {
  fileName = file;
});

messageReader.on('changed', function (message) {
  messageFile = message.file;
  messageTimestamp = message.timestamp;
});

messageReader.readMessage({
  type: 'watching',
  file: 'abc.txt'
});

assert.equal(fileName, 'abc.txt', 'Watching event handler not called!');

expectedTimestamp = new Date(2013, 11, 16, 11, 4, 0, 0).getTime();
messageReader.readMessage({
  type: 'changed',
  file: 'def.txt',
  timestamp: expectedTimestamp
});

assert.equal(messageFile, 'def.txt', 'Changed event handler not called!');
assert.equal(messageTimestamp, expectedTimestamp, 'Changed event handler not called!');

