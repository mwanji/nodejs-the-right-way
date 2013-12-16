'use strict';

const net = require('net'),
       fs = require('fs'),
       filename = process.argv[2],
       connections = [];
       
if (!filename) {
  throw Error('No filename specified!');
}

const watcher = fs.watch(filename, function () {
  for (let i = 0; i < connections.length; i++) {
    connections[i].write(JSON.stringify({
      type: 'changed',
      file: filename,
      timestamp: Date.now()
    }) + '\n');
  }
});

const server = net.createServer(function (connection) {
  console.log('Subscriber connected');
  connections.push(connection);
  console.log('Connections=' + connections);
  
  connection.on('close', function () {
    console.log('Subscriber disconnected');
    connections.splice(connections.indexOf(connection), 1);
    console.log('Connections=' + connections);
  });
});

server.on('close', function () {
  watcher.close();
  console.log('close event handler called');
});

server.listen(8000, function () {
  console.log('Listening on port 8000...');
});
