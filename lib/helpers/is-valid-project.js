var grep = require('shelljs').grep;
var path = require('path');

var isValidPath = require('./is-valid-path');

module.exports = function(dir, supported) {
  var dependencyFile = null;
  var clgJson = path.resolve(dir, '.clg.json');
  var packageJson = path.resolve(dir, 'package.json');
  var gemfileLock = path.resolve(dir, 'Gemfile.lock');

  // make regex string of supported static site generators
  supported = supported.reduce(function(p, c) {
    return p + '|' + c;
  });

  if (isValidPath(clgJson)) {
    // don't check at all if the user has configured a .clg.json
    return true;
  } else if (isValidPath(packageJson)) {
    dependencyFile = packageJson;
  } else if (isValidPath(gemfileLock)) {
    dependencyFile = gemfileLock;
  } else {
    // projects must run either on node or ruby
    return false;
  }

  // check for occurences of supported projects in package.json/Gemfile.lock
  var match = grep(new RegExp(supported, 'ig'), dependencyFile).split('\n');

  // filter for empty strings to eliminate false positives
  return !!match.filter(function(str) { return !!str }).length;
};
