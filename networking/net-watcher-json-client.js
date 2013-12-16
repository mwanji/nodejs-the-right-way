'use strict';

const
  net = require('net'),
  client = require('./Ldj.js').connect(net.connect({ port: 8000 })),
  reader = require('./MessageReader.js').MessageReader();
  
reader.on('watching', function (file) {
  console.log('Now watching file: ' + file);
});

reader.on('changed', function (message) {
  let date = new Date(message.timestamp);
  console.log(message.file + " @ " + date);
});
  
client.on('message', function (message) {
  reader.readMessage(message);
});
