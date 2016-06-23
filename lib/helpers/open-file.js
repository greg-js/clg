var exec = require('child_process').execSync;
var open = require('open');

module.exports = function(file, isGUI, editor) {
  var execString = '';

  if (isGUI) {
    open(file);
  } else {
    execString = [editor, ' "', file.trim(), '"'].join('');
    exec(execString, {
      stdio: 'inherit'
    });
  }
};
