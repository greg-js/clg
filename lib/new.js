var isValidProject = require('./helpers/is-valid-project');
var openFile = require('./helpers/open-file');
var editor = process.env.EDITOR;

var chalk = require('chalk');
var path = require('path');
var slugize = require('simple-slug');
var mkdir = require('shelljs').mkdir;
var ShellString = require('shelljs').ShellString;

module.exports = function(rootDir, newDirs, options) {
  var asset = options._[0];
  var matchedAsset = newDirs[asset];
  var title = options._[1];
  var isGUI = options.gui || !editor;
  var destination = null;
  var type = null;
  var fileDest = null;
  var metadata = null;
  var slug = null;
  var contentsToSave = '';

  if (matchedAsset) {
    // support simple string paths as well as more complex objects
    if (typeof matchedAsset === 'string') {
      destination = path.resolve(rootDir, matchedAsset);
      type = 'md';
    } else {
      destination = path.resolve(rootDir, matchedAsset.dir);
      type = matchedAsset.type || 'md';
    }

    // hexo doesn't have the leading yaml --- line
    contentsToSave = (isValidProject(rootDir, ['hexo'])) ? '' : '---\n';
    // title and date are always included
    contentsToSave += 'title: ' + title + '\n';
    contentsToSave += 'date: ' + (new Date()).toISOString() + '\n';

    // add the metadata as set in newDirs config
    // TODO: add support for adding tags and categories from the command line
    if (matchedAsset.metadata) {
      metadata = matchedAsset.metadata;
      for (var prop in metadata) {
        if (metadata.hasOwnProperty(prop)) {
          contentsToSave += prop + ': ' + metadata[prop] + '\n';
        }
      }
    }

    contentsToSave += '---\n\n';

    slug = slugize(title);

    // if needed, create an asset dir with the same name as the slug
    if (matchedAsset.assetDir) {
      mkdir(path.resolve(destination, slug));
    }

    // save the new file's contents
    fileDest = path.resolve(destination, slug + '.' + type);
    ShellString(contentsToSave).to(fileDest);

    // now open it
    openFile(fileDest, isGUI, editor);

  } else {
    console.log(chalk.cyan(asset) + ' asset folder not found');
    console.log('Did you configure the `newDirs` option in your project\'s `.clg.json`?\n');
    console.log('Check the README on GitHub for details: https://github.com/greg-js/clg');
  }
};
