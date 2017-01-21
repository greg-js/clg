var path = require('path');
var find = require('shelljs').find;
var test = require('shelljs').test;

var isValidPath = require('./helpers/is-valid-path');
var makeFileObject = require('./helpers/make-file-object');

var filterOnExtensions = require('./helpers/filters').filterOnExtensions;
var filterOnDirs = require('./helpers/filters').filterOnDirs;
var filterOnSearchTerms= require('./helpers/filters').filterOnSearchTerms;
var filterOnCategory = require('./helpers/filters').filterOnCategory;
var filterOnTags = require('./helpers/filters').filterOnTags;

module.exports = function(rootDir, config, options) {
  var sources = (options.source) ? options.source.split(',') : config.sourceDirs;
  var dirs = (options.dir) ? options.dir.split(',') : [];

  var workingDirs = sources.map(function(dir) {
    return path.resolve(rootDir, dir);
  }).filter(isValidPath);

  if (!workingDirs.length) {
    console.error('Source dir(s) are invalid.');
    process.exit(1);
  }

  var searchTerms = options._;
  var extensions = options.extension || config.extensions;
  var searchCategory = options.category;
  var searchTags = options.tags;
  var filterProp = options.filter || config.filterProp;

  // get a list of all files in the working dirs, but eliminate directories
  // just in case for some reason the user searches with a blank `ext`
  var files = find(workingDirs).filter(function(item) {
    return test('-f', item);
  });

  // filter on extension (required)
  files = filterOnExtensions(files, extensions);

  // filter on dir (optional)
  files = (dirs.length) ? filterOnDirs(files, sources, dirs) : files;

  // make file object here since we might need it for a deep search
  files = files.map(function(file) {
    return makeFileObject(file, rootDir);
  });

  // filter on search terms and passed in filterProp (optional)
  files = (searchTerms.length) ? filterOnSearchTerms(files, searchTerms, options.apropos, filterProp) : files;

  // filter on category (optional)
  files = (searchCategory) ? filterOnCategory(files, searchCategory) : files;

  // filter on tag(s) (optional)
  files = (searchTags) ? filterOnTags(files, searchTags) : files;

  return files;
};
