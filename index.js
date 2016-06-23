var minimist = require('minimist');
var chalk = require('chalk');

var rootDir = require('./lib/helpers/get-root')();
var config = require('./lib/helpers/load-config')(rootDir, require('./.clg.json'));
var isValidProject = require('./lib/helpers/is-valid-project')(rootDir, config.supported);

if (!isValidProject) {
  console.log('No static site generator detected in this project');
  process.exit(1);
}

var doEdit = require('./lib/edit');
var doHelp = require('./lib/help');
var doVersion = require('./lib/version');

var defaults = {
  boolean: [
    'help',
    'version',
    'edit',
    'gui'
  ],
  alias: {
    h: 'help',
    v: 'version',
    e: 'edit',
    t: 'type',
    g: 'gui',
    d: 'dir',
    directory: 'dir',
    s: 'source'
  },
  default: {
    help: false,
    version: false,
    edit: false,
    gui: false,
    dir: null,
    type: null,
    source: null
  }
};

var keywords = ['help', 'h', 'version', 'v', 'edit', 'e'];

var options = minimist(process.argv.slice(2), defaults);
var firstArg = (options._.length) ? options._[0] : null;

// allow cli options without leading dash and rebuild options
if (keywords.indexOf(firstArg) !== -1) {
  if (/^help$|^h$/.test(firstArg)) {
    options.help = options.h = true;
    options._ = options._.slice(1);
  } else if (/^version|^v$/.test(firstArg)) {
    options.version = options.v = true;
    options._ = options._.slice(1);
  } else if (/^edit$|^e$/.test(firstArg)) {
    options.edit = options.e = true;
    options._ = options._.slice(1);
  }
}

// process options and actually do stuff
if (options.help) {
  doHelp();
} else if (options.version) {
  doVersion();
} else if (options.edit) {
  doEdit(rootDir, config, options);
} else {
  console.error(chalk.red('Invalid syntax.', '\n'));
  doHelp();
}
