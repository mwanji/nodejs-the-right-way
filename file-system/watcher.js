const fs = require('fs'),
      filename = process.argv[2];

if (filename === undefined) {
  throw Error('filename is required!');
}

// fs#watch is only called once because of editor. Cf. https://github.com/joyent/node/issues/3640#issuecomment-6806347
fs.watchFile(filename, function () {
  console.log(filename + ' just changed!');
});

console.log('Watching ' + filename + ' for changes...');
