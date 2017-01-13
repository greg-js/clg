var path = require('path');
var find = require('./find');
var openFile = require('./helpers/open-file');
var displayMenu = require('./helpers/display-menu');

var editor = process.env.EDITOR;

module.exports = function(rootDir, config, options) {
  var isGUI = options.gui || !editor;
  var files = find(rootDir, config, options);

  // now process the results
  if (!files.length) {
    console.log('No files match your query');
    process.exit(1);
  } else if (files.length === 1) {
    // put absolute dir back together
    openFile(path.resolve(rootDir, files[0].path.slice(2)), isGUI, editor);
  } else {
    displayMenu(files, 'Select a file to edit', rootDir, config, function(err, file) {
      if (err) { throw err; }
      openFile(path.resolve(rootDir, file.path.slice(2)), isGUI, editor);
    });
  }
};
