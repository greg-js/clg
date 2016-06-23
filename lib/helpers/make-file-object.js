var frontMatter = require('front-matter');
var cat = require('shelljs').cat;

module.exports = function(file) {
  var contents = cat(file);
  var fm;

  // in some cases (hexo), the front matter doesn't have the leading `---`
  // but it is valid yaml and always starts with 'title'
  if (contents.slice(0, 5) === 'title') {
    contents = '---\n' + contents;
  }

  fm = frontMatter(contents);
  fm.path = file;

  return fm;
};
