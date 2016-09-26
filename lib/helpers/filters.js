// extension filter
exports.filterOnExtensions = function(itemPaths, extensions) {
  var extensionsRE = null;

  // in case there are no extensions or it is run with `-t *BLANK`
  // return everything (filter out dirs later)
  if (!extensions || extensions === true) {
    return itemPaths;
  } else if (typeof extensions === 'string') {
    extensions = extensions.split(',');
  }

  extensionsRE = new RegExp(extensions.map(function(extension) {
    // /\.TYPE$/i
    return '\\.' + extension + '$';
  }).reduce(function(p, c) {
    return p + '|' + c;
  }), 'i');

  return itemPaths.filter(function(item) {
    return extensionsRE.test(item);
  });
};

// instead of using the fs, just filter on /$sources/$dirs
exports.filterOnDirs = function(itemPaths, sources, dirs) {
  var sourcesString, dirsString, sourcesDirsRE;

  if (!(sources instanceof Array) || !(dirs instanceof Array)) {
    throw new Error('Must pass in arrays for sources and dirs');
  }

  // /\/(source1|source2)\/i
  sourcesString = (!sources.length) ? '' : '\/(' + sources.join('|') + ')\/';
  // /(dir1|dir2)\/i
  dirsString = (!dirs.length) ? '' : '(' + dirs.join('|') + ')\/';
  // /\/(source1|source2)\/(dir1|dir2)\/i
  sourcesDirsRE = new RegExp(sourcesString + dirsString, 'i');

  return itemPaths.filter(function(item) {
    return sourcesDirsRE.test(item);
  });
};

// search term filter -- only this one needs the item's metadata (for now)
exports.filterOnSearchTerms = function(itemObjects, terms, apropos) {
  var termsRE = null;

  if (!(terms instanceof Array)) {
    throw new Error('Must pass in an array of search terms');
  }

  termsRE = terms.map(function(term) {
    return new RegExp(term, 'i');
  });

  return itemObjects.filter(function(item) {
    return termsRE.every(function(termRE) {
      var fullBody = (item.frontmatter) ? item.body + item.frontmatter : item.body;

      if (apropos) {
        return termRE.test(fullBody);
      } else if (!item.attributes.title) {
        return termRE.test(item.fileName);
      } else {
        return termRE.test(item.attributes.title);
      }
    });
  });
};
