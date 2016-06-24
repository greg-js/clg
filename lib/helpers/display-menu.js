var inquirer = require('inquirer');
var chalk = require('chalk');

var formatDate = require('./format-date');

module.exports = function(items, message, rootDir, cb) {
  var ln = items.length;

  var entries = items.sort(function(a, b) {
    return new Date(b.attributes.date) - new Date(a.attributes.date);
  }).map(function(item, index) {
    var title = item.attributes.title || item.attributes.name;
    var date = formatDate(item.attributes.date);

    var counter = [ chalk.yellow('['), chalk.cyan(index + 1), '/', chalk.cyan(ln), chalk.yellow(']'), ' ' ].join('');

    return title ? counter + title + ' (' + chalk.gray(date) + ')' : counter + item.path;
  });

  inquirer.prompt([{
    type: 'list',
    name: 'file',
    message: message,
    choices: entries
  }]).then(function(answer) {
    var pos = entries.indexOf(answer.file);
    var selected = entries[pos];

    if (selected) {
      cb(null, items[pos]);
    } else {
      cb('invalid choice', null);
    }
  }).catch(function(err) {
    console.error(err);
  });
};
