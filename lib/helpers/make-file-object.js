var frontMatter = require('front-matter');
var cat = require('shelljs').cat;
var path = require('path');

module.exports = function(file, rootDir) {
  var contents = cat(file);
  var fm;

  // in some cases (hexo), the front matter doesn't have the leading `---`
  // but it is valid yaml and always starts with 'title'
  if (contents.slice(0, 5) === 'title') {
    contents = '---\n' + contents;
  }

  fm = frontMatter(contents);
  fm.fullPath = file;
  fm.path = file.replace(rootDir, '.');
  fm.fileName = fm.path.slice(fm.path.lastIndexOf(path.sep) + 1, fm.path.lastIndexOf('.'));

  return fm;
};
