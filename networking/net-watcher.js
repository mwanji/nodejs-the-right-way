'use strict';

const net = require('net'),
       fs = require('fs'),
       filename = process.argv[2];
       
if (!filename) {
  throw Error('No filename specified!');
}

const server = net.createServer(function (connection) {
  console.log('Subscriber connected');
  connection.write('Watching ' + filename + ' for changes...\n');
  
  const watcher = fs.watch(filename, function () {
    connection.write(filename + ' changed at ' + new Date().toString() + '\n');
  });
  
  connection.on('close', function () {
    console.log('Subscriber disconnected');
    watcher.close();
  });
});

server.listen(8000, function () {
  console.log('Listening on port 8000...');
});
