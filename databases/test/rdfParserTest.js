'use strict';

const
  assert = require('assert'),
  rdfParser = require('../rdfParser.js'),
  expectedRdf = require('./pg132.json');
  
rdfParser(132, function (book) {
  assert.deepEqual(book, expectedRdf, 'Books should match!');
});
