'use strict';

const
  fs = require('fs'),
  cheerio = require('cheerio');

module.exports = function (rdfFile, callback) {
  fs.readFile('cache/epub/' + rdfFile + '/pg' + rdfFile + '.rdf', function (err, content) {
    const
      $ = cheerio.load(content.toString()),
      collect = function (index, elem) {
        return $(elem).text();
      };
      
    const book = {
      _id: $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
      title: $('dcterms\\:title').text(),
      authors: $('pgterms\\:agent pgterms\\:name').map(collect),
      subjects: $('[rdf\\:resource$="/LCSH"] ~ rdf\\:value').map(collect)
    }

    callback(book);
  });
};
  
