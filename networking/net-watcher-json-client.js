'use strict';

const
  net = require('net'),
  client = net.connect({ port: 8000 });
  
client.on('data', function (data) {
  const message = JSON.parse(data);
  
  if (message.type === 'watching') {
    console.log('Now watching file: ' + message.file);
  } else if (message.type === 'changed') {
    let date = new Date(message.timestamp);
    console.log(message.file + " @ " + date);
  } else {
    throw Error('Unknown message type: ' + message.type);
  }
});
