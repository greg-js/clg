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

// search term filter, takes both searchterms and filterProp
exports.filterOnSearchTerms = function(itemObjects, terms, apropos, filterProp) {
  var termsRE = null;

  if (!(terms instanceof Array)) {
    throw new Error('Must pass in an array of search terms');
  }

  termsRE = terms.map(function(term) {
    return new RegExp(term, 'i');
  });

  return itemObjects.filter(function(itemObject) {
    return termsRE.every(function(termRE) {
      var fullBody = (itemObject.frontmatter) ? itemObject.body + itemObject.frontmatter : itemObject.body;

      if (apropos) {
        return termRE.test(fullBody);
      } else if (!itemObject.attributes.title) {
        return (filterProp) ? termRE.test(itemObject.fileName + itemObject.attributes[filterProp]) : termRE.test(itemObject.fileName);
      } else {
        return (filterProp) ? termRE.test(itemObject.attributes.title + itemObject.attributes[filterProp]) : termRE.test(itemObject.attributes.title);
      }
    });
  });
};

// category filter
exports.filterOnCategory = function(itemObjects, category) {
  var categoryRE = new RegExp(category, 'i');

  return itemObjects.filter(function(itemObject) {
    var categoryProp = (itemObject.attributes.category) ? itemObject.attributes.category : itemObject.attributes.categories;
    var categoryString = (categoryProp && typeof categoryProp === 'string') ? categoryProp : categoryProp.join(' ');

    return categoryRE.test(categoryString);
  });
};

// tag(s) filter
exports.filterOnTags = function(itemObjects, tags) {
  var tagsRE = (tags.indexOf(',') !== -1) ? tags.split(',').map(function(tag) { return new RegExp(tag, 'i'); }) : [new RegExp(tags, 'i')];

  return itemObjects.filter(function(itemObject) {
    var itemTags = itemObject.attributes.tags;
    var tagString = (itemTags && itemTags.length > 0) ? itemTags.join(' ') : '';

    return tagsRE.every(function(tagRE) {
      return tagRE.test(tagString);
    });
  });
}
