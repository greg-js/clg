// type filter
exports.filterOnType = function(itemPaths, types) {
  var typesRE = null;

  // in case there are no types or it is run with `-t *BLANK`
  // return everything (filter out dirs later)
  if (!types || types === true) {
    return itemPaths;
  } else if (typeof types === 'string') {
    types = types.split(',');
  }

  typesRE = new RegExp(types.map(function(type) {
    // /\.TYPE$/i
    return '\\.' + type + '$';
  }).reduce(function(p, c) {
    return p + '|' + c;
  }), 'i');

  return itemPaths.filter(function(item) {
    return typesRE.test(item);
  });
};

// instead of using the fs, just filter on /$source/$dir
exports.filterOnDir = function(itemPaths, sources, dir) {
  // /\/(source1|source2)\/i
  var sourcesString = '(' + sources.join('|') + ')';
  var dirRE = new RegExp('\/' + sourcesString + '\/' + dir + '\/', 'i');

  return itemPaths.filter(function(item) {
    return dirRE.test(item);
  });
};

// search term filter -- only this one needs the item's metadata (for now)
exports.filterOnSearchTerms = function(itemObjects, terms, apropos) {
  var termsRE = terms.map(function(term) {
    return new RegExp(term, 'i');
  });

  return itemObjects.filter(function(item) {
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

