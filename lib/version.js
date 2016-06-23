var chalk = require('chalk');

module.exports = function() {
  console.log('clg v' + chalk.gray(require('../package.json').version));
};
