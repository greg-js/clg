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
var doDelete = require('./lib/delete');

var defaults = {
  boolean: [
    'help',
    'version',
    'edit',
    'gui',
    'apropos',
    'new',
    'rename',
    'delete'
  ],
  alias: {
    h: 'help',
    v: 'version',
    e: 'edit',
    'ext': 'extension',
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
    'new-asset': 'asset',
    rm: 'delete',
    remove: 'delete',
    c: 'category',
    cat: 'category',
    t: 'tags',
    tag: 'tags'
  },
  default: {
    help: false,
    version: false,
    edit: false,
    new: false,
    gui: false,
    apropos: false,
    rename: false,
    delete: false,
    dir: null,
    extension: null,
    source: null,
    name: null,
    asset: null,
    tags: null,
    category: null
  }
};

var options = minimist(process.argv.slice(2), defaults);
var firstArg = (options._.length) ? options._[0] : null;

// allow cli options without leading dash and rebuild options
if (/^he?l?p?$/i.test(firstArg)) {
  options.help = true;
} else if (/^ve?r?s?i?o?n?$/i.test(firstArg)) {
  options.version = true;
} else if (/^ed?i?t?$/i.test(firstArg)) {
  options.edit = true;
} else if (/^ne?w?$/i.test(firstArg)) {
  options.new = true;
} else if (/^r$|^rename$/i.test(firstArg)) {
  options.rename = true;
} else if (/^delete$|^remove$|rm$/i.test(firstArg)) {
  options.delete = true;
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
} else if (options.delete) {
  doDelete(rootDir, config, options);
} else if (options.new) {
  doNew(rootDir, config.newDirs, options);
} else {
  console.error(chalk.red('Invalid syntax.', '\n'));
  doHelp();
}
