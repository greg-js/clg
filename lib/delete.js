var displayMenu = require('./helpers/display-menu');
var find = require('./find');

var chalk = require('chalk');
var inquirer = require('inquirer');
var rm = require('shelljs').rm;

module.exports = function(rootDir, config, options) {
  var files = find(rootDir, config, options);

  if (!files.length) {
    console.log('No files match your query');
    process.exit(1);
  } else if (files.length === 1) {
    askDelete(files[0]);
  } else {
    displayMenu(files, 'Which asset do you want to delete?', rootDir, function(err, file) {
      if (err) { throw err; }
      askDelete(file);
    });
  }
}

function askDelete(file) {
  var message = 'Are you sure you want to delete ' + chalk.yellow(file.attributes.title) + ' and (if applicable) its associated asset directory?\nThis action is ' + chalk.red('irreversible') + '! (y/N)';

  inquirer.prompt([{
    type: 'confirm',
    name: 'choice',
    message: message,
    default: false
  }]).then(function(result) {
    var resultString = chalk.yellow(file.attributes.title);
    if (result.choice) {
      // delete the file
      try {
        rm('-rf', file.fullPath);
      } catch(e) {
        console.log(file.fullPath + ' not found');
        process.exit();
      }
      // delete the asset dir if it exists
      try {
        rm('-rf', file.fullPath.slice(0, file.fullPath.lastIndexOf('.')));
        resultString += ' and associated asset dir ' + chalk.red('deleted');
      } catch(e) {
        resultString += chalk.red(' deleted');
      }
      console.log(resultString);
    } else {
      console.log('Delete command aborted.');
      process.exit(0);
    }
  }).catch(function(err) {
    console.error(err);
  });
}
