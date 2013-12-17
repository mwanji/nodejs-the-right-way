const
  file = require('file'),
  async = require('async'),
  db = require('redis').createClient(),
  rdfParser = require('./rdfParser');
  
const queue = async.queue(function (rdfFileId, callback) {
  rdfParser(rdfFileId, function (err, rdf) {
    console.log('Save Book ID=' + rdf._id);
    db.set('books:' + rdf._id, JSON.stringify(rdf));
    callback();
  });
}, 10);

queue.drain = function () {
  db.quit();
};

console.log('Begin walking through book RDF files');

file.walk(__dirname + '/cache', function (err, dir, dirPath, paths) {
  paths.forEach(function (path) {
    const rdfFileId = dir.substring(dir.indexOf('/epub/') + 6);
    queue.push(rdfFileId, function (err) {});
  });
});

