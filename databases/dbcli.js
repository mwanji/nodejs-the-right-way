'use strict';

const
  redis = require('redis'),
  db = redis.createClient(),
  rdfParser = require('./rdfParser.js'),
  query = JSON.parse(process.argv[2]);
  
const idsToKeys = function (bookId) {
  return 'books:' + bookId;
};

if (query.id) {
  db.get('books:' + query.id, function (err, result) {
    console.log(result);
    db.quit();
  });
}

if (query.author) {
  db.smembers('books:lookup:author:' + query.author, function (err, bookIds) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log(bookIds);
    
    db.mget(bookIds.map(idsToKeys), function (err, books) {
      if (err) {
        console.log(err);
        return;
      }
      
      books.forEach(function (book) {
        console.log(JSON.parse(book).title);
      });
    });
    db.quit();
  });
}

if (query.subject) {
  db.smembers('books:lookup:subject:' + query.subject, function (err, bookIds) {
    if (err) {
      console.log(err);
      return;
    }
    
    db.mget(bookIds.map(idsToKeys), function (err, books) {
      if (err) {
        console.log(err);
        return;
      }
      
      books.forEach(function (book) {
        console.log(JSON.parse(book).title);
      });
    });
    
    db.quit();
  });
}


