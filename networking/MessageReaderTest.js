'use strict';

const messageReader = require('./MessageReader').MessageReader();

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

if (fileName !== 'abc.txt') {
  throw Error('Watching event handler not called!');
}

expectedTimestamp = new Date(2013, 11, 16, 11, 4, 0, 0).getTime();

messageReader.readMessage({
  type: 'changed',
  file: 'def.txt',
  timestamp: expectedTimestamp
});

if (messageFile !== 'def.txt' || messageTimestamp !== expectedTimestamp) {
  throw Error('Changed event handler not called!');
}

