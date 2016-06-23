var cd = require('shelljs').cd;
var exec = require('shelljs').exec;
var path = require('path');

module.exports = function() {
  cd(process.cwd());

  return path.resolve(exec('git rev-parse --show-toplevel', { silent: true }).toString().replace(/\n/, ''));
};
