var path = require('path');
var find = require('shelljs').find;
var test = require('shelljs').test;

var displayMenu = require('./helpers/display-menu');
var openFile = require('./helpers/open-file');
var isValidPath = require('./helpers/is-valid-path');
var makeFileObject = require('./helpers/make-file-object');
var editor = process.env.EDITOR;

var filterOnTypes = require('./helpers/filters').filterOnTypes;
var filterOnDirs = require('./helpers/filters').filterOnDirs;
var filterOnSearchTerms= require('./helpers/filters').filterOnSearchTerms;

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
  var types = options.type || config.types;
  var isGUI = options.gui || !editor;

  // get a list of all files in the working dirs, but eliminate directories
  // just in case for some reason the user searches with a blank `type`
  var files = find(workingDirs).filter(function(item) {
    return test('-f', item);
  });

  // filter on type (required)
  files = filterOnTypes(files, types);

  // filter on dir (optional)
  files = (dirs.length) ? filterOnDirs(files, sources, dirs) : files;

  // make file object here since we might need it for a deep search
  files = files.map(function(file) {
    return makeFileObject(file, rootDir);
  });

  // filter on search terms (optional)
  files = (searchTerms.length) ? filterOnSearchTerms(files, searchTerms, options.apropos) : files;

  // now process the results
  if (!files.length) {
    console.log('No files match your query');
    process.exit(1);
  } else if (files.length === 1) {
    openFile(files[0].path, isGUI, editor);
  } else {
    displayMenu(files, 'Select a file to edit', rootDir, function(err, file) {
      if (err) { throw err; }
      openFile(file.path, isGUI, editor);
    });
  }
};
