var slugize = require('./helpers/slugize');
var displayMenu = require('./helpers/display-menu');
var find = require('./find');

var chalk = require('chalk');
var inquirer = require('inquirer');
var path = require('path');
var mv = require('shelljs').mv;
var cat = require('shelljs').cat;
var ShellString = require('shelljs').ShellString;

module.exports = function(rootDir, config, options) {

  var files = find(rootDir, config, options);
  var newTitle = options.name;

  if (!newTitle) {
    console.log('You ' + chalk.red('must') + ' provide a new title to rename the file using the `--nn` option.');
    process.exit(1);
  }

  var newSlug = slugize(newTitle);

  function rename(filePath, fileTitle, slug, newTitle, newAsset, config, rootDir) {
    var choices = [
      'Rename title and path',
      'Rename title only',
      'Rename path only',
      'Cancel (don\'t rename anything)'
    ];
    var message = 'The current file path is ' + chalk.yellow(filePath) +
      '\nThe current title is ' + chalk.yellow(fileTitle) + '\n';
    var newPath, assetDir, newAssetDir;

    inquirer.prompt([{
      type: 'list',
      name: 'choice',
      message: message,
      choices: choices
    }]).then(function(result) {
      // 0 = title & path, 1 = title, 2 = path, 3 = cancel
      var selected = choices.indexOf(result.choice);
      var asset = null;

      if (newAsset) {
        try {
          asset = config.newDirs[newAsset];
        } catch(e) {
          console.log('The ' + chalk.gray(asset) + ' asset has not been configured. Check your ' + chalk.gray('.clg.json') + '. Exiting..');
          process.exit();
        }
        if (typeof asset !== 'string') {
          asset = asset.dir;
        }
        newPath = path.resolve(rootDir, asset, newSlug) + '.md';
      } else {
        newPath = path.resolve(filePath.slice(0, filePath.lastIndexOf(path.sep)), newSlug) + '.md';
      }

      // replace title
      if (selected < 2) {
        ShellString(cat(filePath).replace(/title\: .*/, 'title: ' + newTitle)).to(filePath);
        console.log('Title successfully changed to ' + chalk.yellow(newTitle));
      }
      // rename the path
      if (selected === 0 || selected === 2) {
        // mv filePath, rootDir/newFilename
        mv(filePath, newPath);
        console.log('File successfully renamed to ' + chalk.yellow(newPath));

        // check for asset dir and move if found
        assetDir = filePath.slice(0, filePath.lastIndexOf('.'));
        newAssetDir = newPath.slice(0, newPath.lastIndexOf('.'));
        try {
          mv(assetDir, newAssetDir);
          console.log('Asset directory renamed');
        } catch(e) {
          console.log('No asset directory found');
        }
      }
      if (selected === 3) {
        console.log('Exiting without making changes');
        process.exit();
      }
    }).catch(function(err) {
      console.error(err);
    });
  }

  // now process the results
  if (!files.length) {
    console.log('No files match your query');
    process.exit(1);
  } else if (files.length === 1) {
    rename(
      path.resolve(rootDir, files[0].path.slice(2)),
      files[0].attributes.title,
      files[0].fileName,
      newTitle,
      options.asset,
      config,
      rootDir
    );
  } else {
    displayMenu(files, 'Select a file to edit', rootDir, function(err, file) {
      if (err) { throw err; }
      rename(
        path.resolve(rootDir, file.path.slice(2)),
        file.attributes.title,
        file.fileName,
        newTitle,
        options.asset,
        config,
        rootDir
      );
    });
  }
};
