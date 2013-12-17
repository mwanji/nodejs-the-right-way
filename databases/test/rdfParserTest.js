'use strict';

const
  assert = require('assert'),
  rdfParser = require('../rdfParser.js'),
  expectedRdf = require('./pg132.json');
  
rdfParser(132, function (err, book) {
  assert.deepEqual(book, expectedRdf, 'Books should match!');
});

rdfParser(' ', function (err, book) {
  assert(err, 'Error should be returned to callback!');
});
