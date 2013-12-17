'use strict';

const
  redis = require('redis'),
  db = redis.createClient(),
  rdfParser = require('./rdfParser.js'),
  query = JSON.parse(process.argv[2]);
  
const idToKeys = function (bookId) {
  return 'books:' + bookId;
};

const close = (function (countdown) {
  return function (fn) {
    return function () {
      try {
        fn.apply(null, arguments);
      } finally {
        countdown--;
        if (countdown === 0) {
          db.quit();
        }
      }
    }
  };
})(Object.keys(query).length);

if (query.id) {
  db.get('books:' + query.id, close(function (err, result) {
    console.log(result);
  }));
}

if (query.author) {
  db.smembers('books:lookup:author:' + query.author, close(function (err, bookIds) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log(bookIds);
    
    db.mget(bookIds.map(idToKeys), function (err, books) {
      if (err) {
        console.log(err);
        return;
      }
      
      books.forEach(function (book) {
        console.log(JSON.parse(book).title);
      });
    });
  }));
}

if (query.subject) {
  db.smembers('books:lookup:subject:' + query.subject, close(function (err, bookIds) {
    if (err) {
      console.log(err);
      return;
    }
    
    db.mget(bookIds.map(idToKeys), function (err, books) {
      if (err) {
        console.log(err);
        return;
      }
      
      books.forEach(function (book) {
        console.log(JSON.parse(book).title);
      });
    });
  }));
}

