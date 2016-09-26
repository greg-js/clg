var isValidProject = require('./helpers/is-valid-project');
var isValidPath = require('./helpers/is-valid-path');
var openFile = require('./helpers/open-file');
var isTesting = require('./helpers/is-testing');
var slugize = require('./helpers/slugize');
var editor = process.env.EDITOR;

var chalk = require('chalk');
var path = require('path');
var mkdir = require('shelljs').mkdir;
var ShellString = require('shelljs').ShellString;

module.exports = function(rootDir, newDirs, options) {
  var asset = options._[0];
  if (!asset) {
    console.error('You must call `new` with an asset (commonly something like `post` or `draft`)');
    return false;
  }

  var matchedAsset = newDirs[asset];
  if (!matchedAsset) {
    console.log(chalk.cyan(asset) + ' asset folder not found');
    console.log('Did you configure the `newDirs` option in your project\'s `.clg.json`?\n');
    console.log('Check the README on GitHub for details: https://github.com/greg-js/clg');
    return false;

  }

  var title = options._[1];
  if (!title) {
    console.error('You must supply a title for your new ' + asset);
    return false;
  }

  var isGUI = options.gui || !editor;
  var destination = null;
  var extension = null;
  var fileDest = null;
  var metadata = null;
  var slug = null;
  var contentsToSave = '';

  // support simple string paths as well as more complex objects
  if (typeof matchedAsset === 'string') {
    destination = path.resolve(rootDir, matchedAsset);
    extension = 'md';
  } else {
    destination = path.resolve(rootDir, matchedAsset.dir);
    extension = matchedAsset.extension || 'md';
  }

  // make the dir if for some reason it's not there yet
  if (!isValidPath(destination)) {
    mkdir('-p', destination);
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
  fileDest = path.resolve(destination, slug + '.' + extension);
  ShellString(contentsToSave).to(fileDest);

  // now open it
  if (!isTesting()) {
    openFile(fileDest, isGUI, editor);
  } else {
    return fileDest;
  }
};
