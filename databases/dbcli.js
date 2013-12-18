'use strict';

const
  redis = require('redis'),
  async = require('async'),
  db = redis.createClient(),
  rdfParser = require('./rdfParser.js'),
  query = JSON.parse(process.argv[2]);
  
const idToKey = function (bookId) {
  return 'books:' + bookId;
};

const schema = {
  book: function (id) {
    return 'books:' + id;
  },
  lookup: function (id) {
    return this.book('lookup:' + id);
  }
}

const getById = function (id) {
  return function (callback) {
    db.get(schema.book(id), function (err, result) {
      callback(null, {
        key: schema.book(id),
        result: result
      });
    });
  };
};

const getByAuthor = function (author) {
  return function (callback) {
    db.smembers(schema.lookup('author:' + author), function (err, bookIds) {
      if (err) {
        callback(err, null);
        return;
      }
      
      db.mget(bookIds.map(idToKey), function (err, books) {
        if (err) {
          callback(err, null);
          return;
        }
        
        const titles = books.map(function (book) {
          return JSON.parse(book).title;
        }).reduce(function (reduced, title) {
          return reduced + title + '\n';
        }, '');
        
        callback(err, {
          key: schema.lookup('author:' + author),
          result: titles
        });
      });
    });
  }
};

const getBySubject = function (subject) {
  return function (callback) {
    db.smembers(schema.lookup('subject:' + subject), function (err, bookIds) {
      if (err) {
        callback(err);
        return;
      }
      
      db.mget(bookIds.map(idToKey), function (err, books) {
        if (err) {
          console.log(err);
          return;
        }
        
        const titles = books.map(function (book) {
          const json = JSON.parse(book);
          return json.title + ' by ' + json.authors;
        }).reduce(function (reduced, title) {
          return reduced + title + '\n';
        }, '');
        
        callback(err, {
          key: schema.lookup('subject:' + subject),
          result: titles
        });
      });
    });
  };
};

const parallelTasks = [];
if (query.id) {
  parallelTasks.push(getById(query.id));
};
if (query.author) {
  parallelTasks.push(getByAuthor(query.author));
}
if (query.subject) {
  parallelTasks.push(getBySubject(query.subject));
}

async.parallel(parallelTasks,
  function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    
    results.forEach(function (result) {
      console.log(result.key);
      console.log(result.result);
    });
    
    db.quit();
  }
);

