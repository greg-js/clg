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
var doNew = require('./lib/new');
var doRename = require('./lib/rename');
var doHelp = require('./lib/help');
var doVersion = require('./lib/version');

var defaults = {
  boolean: [
    'help',
    'version',
    'edit',
    'gui',
    'apropos',
    'new',
    'rename'
  ],
  alias: {
    h: 'help',
    v: 'version',
    e: 'edit',
    t: 'type',
    g: 'gui',
    d: 'dir',
    directory: 'dir',
    s: 'source',
    k: 'apropos',
    n: 'new',
    r: 'rename',
    nn: 'name',
    nm: 'name',
    'new-name': 'name',
    na: 'asset',
    'new-asset': 'asset'
  },
  default: {
    help: false,
    version: false,
    edit: false,
    new: false,
    gui: false,
    apropos: false,
    rename: false,
    dir: null,
    type: null,
    source: null,
    name: null,
    asset: null
  }
};

var options = minimist(process.argv.slice(2), defaults);
var firstArg = (options._.length) ? options._[0] : null;

// allow cli options without leading dash and rebuild options
if (/^he?l?p?$/i.test(firstArg)) {
  options.help = options.h = true;
} else if (/^ve?r?s?i?o?n?$/i.test(firstArg)) {
  options.version = options.v = true;
} else if (/^ed?i?t?$/i.test(firstArg)) {
  options.edit = options.e = true;
} else if (/^ne?w?$/i.test(firstArg)) {
  options.new = options.n = true;
} else if (/^r$|^rename$/i.test(firstArg)) {
  options.rename = options.r = true;
}
options._ = options._.slice(1);

// process options and actually do stuff
if (options.help) {
  doHelp();
} else if (options.version) {
  doVersion();
} else if (options.edit) {
  doEdit(rootDir, config, options);
} else if (options.rename) {
  doRename(rootDir, config, options);
} else if (options.new) {
  doNew(rootDir, config.newDirs, options);
} else {
  console.error(chalk.red('Invalid syntax.', '\n'));
  doHelp();
}
