const fs = require('fs');
fs.watch('target.txt', function (eventType) {
  if (eventType === 'change') {
    console.log('target.txt just changed!');
  }
});
console.log('Watching target.txt for changes...');
