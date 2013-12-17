'use strict';

const
  redis = require('redis'),
  //db = redis.createClient(),
  rdfParser = require('./rdfParser.js'),
  rdfFileId = process.argv[2];
  
rdfParser(rdfFileId, console.log);


