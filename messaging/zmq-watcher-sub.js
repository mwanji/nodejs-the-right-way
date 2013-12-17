'use strict';

const
  zmq = require('zmq'),
  subscriber = zmq.socket('sub');
  
subscriber.subscribe('');

subscriber.on('message', function (data) {
  const
    message = JSON.parse(data),
    date = new Date(message.timestamp);
    
  console.log(message.file + ' ' + message.type + ' @ ' + date);
});

subscriber.connect('tcp://localhost:5555');

