"use strict"

const fs = require('fs'),
       spawn = require('child_process').spawn,
       filename = process.argv[2];
       
if (!filename) {
  throw Error('No file given!');
}

// fs#watch only works once when the file is edited in a text editor. Cf. https://github.com/joyent/node/issues/3640#issuecomment-6806347
fs.watchFile(filename, function () {
  let ls = spawn('ls', ['-lh', filename]);
  let output = '';
  ls.stdout.on('data', function (chunk) {
    output += chunk.toString();
  });
  ls.stdout.on('close', function () {
    let parts = output.split(/\s+/);
    console.dir([parts[0], parts[4], parts[8]]);
  });
});

console.log("Now watching " + filename + " for changes...");

