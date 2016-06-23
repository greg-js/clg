var frontMatter = require('front-matter');
var cat = require('shelljs').cat;

module.exports = function(file) {
  var fm = frontMatter(cat(file));
  fm.path = file;

  console.log(fm);
  return fm;
};
