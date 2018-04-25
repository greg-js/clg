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
  var cliMetadata = (options.metadata) ? options.metadata.split(',').map(function(e) {
    return e.split(':');
  }) : null;

  // get metadata passed in through command line
  if (options.metadata) {
    var split = options.metadata.split(',').map(function(e) {
      return e.split(':');
    });
    var obj = {};

    split.forEach(function(e) {
      obj[e[0]] = e[1];
    });

    cliMetadata = obj;
  }

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

  // add leading dashes
  contentsToSave += matchedAsset.noLeadingDashes ? '' : '---\n';

  // title and date are always included
  contentsToSave += 'title: "' + title + '"\n';
  contentsToSave += 'date: ' + (new Date()).toISOString() + '\n';

  // add the metadata as set in newDirs config
  if (matchedAsset.metadata) {
    metadata = matchedAsset.metadata;
    for (var mProp in metadata) {
      if (metadata.hasOwnProperty(mProp)) {
        contentsToSave += mProp + ': ' + metadata[mProp] + '\n';
      }
    }
  }

  // now add the metadata as set in CLI, potentially overwriting config metadata
  if (cliMetadata) {
    for (var cProp in cliMetadata) {
      if (cliMetadata.hasOwnProperty(cProp)) {
        // merge cli props into config props for later use
        matchedAsset.metadata[cProp] = cliMetadata[cProp];
        contentsToSave += cProp + ': ' + cliMetadata[cProp] + '\n';
      }
    }
  }

  contentsToSave += '---\n\n';

  // save the file as whatever the `saveAs` property is set to, or as title
  slug = matchedAsset.metadata && matchedAsset.metadata[matchedAsset.saveAs] ? slugize(matchedAsset.metadata[matchedAsset.saveAs]) : slugize(title);

  // if needed, create an asset dir with the same name as the slug
  if (matchedAsset.assetDir) {
    mkdir(path.resolve(destination, slug));
  }

  // save the new file's contents
  fileDest = path.resolve(destination, slug + '.' + extension);
  if (matchedAsset.assetDir && matchedAsset.postInAssetDir) {
    // Save file as slug/index.md i.e. index.md in assetDirectory
    fileDest = path.resolve(destination, slug, 'index.' + extension);
  }
  ShellString(contentsToSave).to(fileDest);

  // now open it
  if (!isTesting()) {
    openFile(fileDest, isGUI, editor);
  } else {
    return fileDest;
  }
};
