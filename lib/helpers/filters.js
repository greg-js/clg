// type filter
exports.filterOnType = function(items, types) {
  if (typeof types === 'string') {
    types = [types];
  }

  var typesRE = new RegExp(types.map(function(type) {
    return '\.' + type + '$';
  }).reduce(function(p, c) {
    return p + '|' + c;
  }), 'i');

  return items.filter(function(item) {
    return typesRE.test(item);
  });
};

// search term filter
exports.filterOnSearchTerms = function(items, terms, apropos) {
  var termsRE = terms.map(function(term) {
    return new RegExp(term, 'i');
  });

  return items.filter(function(item) {
    return termsRE.every(function(termRE) {
      if (apropos) {
        return termRE.test(item.body + item.frontmatter);
      }
      try {
        if (!item.attributes.title) throw 'no title';
        return termRE.test(item.attributes.title);
      } catch (e) {
        return termRE.test(item.fileName);
      }
    });
  });
};

// instead of using the fs, just filter on /$source/$dir
exports.filterOnDir = function(items, sources, dir) {
  var sourcesString = '(' + sources.join('|') + ')';
  var dirRE = new RegExp('\/' + sourcesString + '\/' + dir + '\/', 'i');

  return items.filter(function(item) {
    return dirRE.test(item);
  });
};
