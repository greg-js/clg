var path = require('path');

module.exports = function(rootDir, fallback) {
  var config = null;
  var setting = null;

  try {
    config = require(path.resolve(rootDir, '.clg.json'));

    for (setting in fallback) {
      if (fallback.hasOwnProperty(setting)) {
        if (config.hasOwnProperty(setting)) {
          if (typeof config[setting] === 'string') {
            // overwrite with new array if string
            config[setting] = config[setting].split(/[ ,]+/);
          } else if (config[setting] instanceof Array){
            // concatenate with fallback options and uniq if array
            config[setting] = uniq(config[setting].concat(fallback[setting]));
          }
        } else {
          config[setting] = fallback[setting];
        }
      }
    }
  } catch (e) {
    config = fallback;
  }

  return config;
};

function uniq(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var i = 0;
  var j = 0;

  for (i = 0; i < len; i++) {
    var item = a[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}
