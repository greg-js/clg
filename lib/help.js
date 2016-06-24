var table = require('text-table');

module.exports = function() {
  console.log('Usage: clg [command]\n\nCommands:')
  console.log(table([
    ['edit', 'Edit a markdown file, using regex and other filters (alias: e)'],
    ['  options', '  [search terms] [-t --type type] [-g --gui] [-d --dir]]'],
    ['  ', '  [-s --source] [-k --apropos]'],
    ['help', 'Prints this help message (alias: h)'],
    ['version', 'Prints the current version (alias: v)']
  ]));
  console.log('\nFor more information about the command-line and configuration options, read the full readme on GitHub:\nhttps://github.com/greg-js/clg');
};
