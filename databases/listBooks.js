const
  file = require('file'),
  async = require('async'),
  redis = require('redis'),
  db = redis.createClient(),
  rdfParser = require('./rdfParser');
  
const queue = async.queue(function (rdfFileId, callback) {
  rdfParser(rdfFileId, function (err, rdf) {
    console.log('Save Book ID=' + rdf._id);
    db.set('books:' + rdf._id, JSON.stringify(rdf));
    
    rdf.authors.forEach(function (author) {
      db.sadd('books:lookup:author:' + author, rdf._id);
    });
    
    rdf.subjects.forEach(function (subject) {
      db.sadd('books:lookup:subject:' + subject, rdf._id, function (err, reply) {
        console.log(err, reply);
      });
      subject.split(/\s+--\s+/).forEach(function (part) {
        db.sadd('books:lookup:subject:' + part, rdf._id);
      });
    });
    
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

