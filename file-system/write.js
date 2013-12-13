"use strict";

const fs = require('fs');

fs.writeFile('target.txt', 'my message', function (err) {
  if (err) {
    throw err;
  }
  
  console.log('File saved!');
});
