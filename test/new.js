/* eslint-env mocha */
var expect = require('chai').expect;
var path = require('path');
var rm = require('shelljs').rm;

var isValidPath = require('../lib/helpers/is-valid-path');
var makeFileObject = require('../lib/helpers/make-file-object');
var doNew = require('../lib/new');

// function(rootDir, newDirs, options)
describe('new', function() {
  describe('without clg.json', function() {
    var rootDir = path.resolve(require('./fixtures/fixtures').rootDir.without);
    var newDirs = require('../lib/helpers/load-config')(rootDir, require('../.clg.json')).newDirs;

    // the asset is the first argument in `options._`, which is the second argument
    // when called on the command-line (after `new`)
    it('should log a message and return false when called without an asset', function() {
      expect(doNew(rootDir, newDirs, { _: [] })).to.be.false;
    });

    it('should log a message and return false when called with a non-configured asset', function() {
      expect(doNew(rootDir, newDirs, { _: ['foo'] })).to.be.false;
    });

  });

  describe('with clg.json', function() {
    var rootDir = path.resolve(require('./fixtures/fixtures').rootDir.with);
    var newDirs = require('../lib/helpers/load-config')(rootDir, require('../.clg.json')).newDirs;

    it('should log a message and return false when called without a title', function() {
      expect(doNew(rootDir, newDirs, { _: ['foo'] })).to.be.false;
    });

    var file1 = doNew(rootDir, newDirs, { _: ['foo', 'Some Title'] });
    var contents1 = makeFileObject(file1);

    it('should drop a new slugized markdown file into the right folder', function() {
      expect(file1).to.equal(path.resolve(rootDir, 'foo', 'bar', 'some-title.md'));
    });

    it('should save the title and date', function() {
      expect(contents1.attributes.title).to.equal('Some Title');
      expect(contents1.attributes.date).to.be.a('date');
    });

    var file2 = doNew(rootDir, newDirs, { _: ['bar', 'A Test'] });

    it('should support complex configs', function() {
      expect(file2).to.equal(path.resolve(rootDir, 'bar', 'baz', 'a-test.md'));
    });

    var file3 = doNew(rootDir, newDirs, { _: ['javascript', 'The Good Parts'] });
    var contents3 = makeFileObject(file3);

    it('should support custom types', function() {
      expect(file3).to.equal(path.resolve(rootDir, 'baz', 'the-good-parts.js'));
    });

    it('should save custom metadata (also empty metadata)', function() {
      expect(contents3.attributes.title).to.equal('The Good Parts');
      expect(contents3.attributes.category).to.equal('javascript');
      expect(contents3.attributes.hasOwnProperty('tags')).to.be.true;
    });

    doNew(rootDir, newDirs, { _: ['bam', 'Cool test'] });

    it('should create an asset directory if configured to do so', function() {
      expect(isValidPath(path.resolve(rootDir, 'bam', 'foo', 'cool-test'))).to.be.true;
    });
  });
});

after(function() {
  var rootDir = path.resolve(require('./fixtures/fixtures').rootDir.with);
  rm('-rf',
     path.resolve(rootDir, 'foo'),
     path.resolve(rootDir, 'bar'),
     path.resolve(rootDir, 'baz'),
     path.resolve(rootDir, 'bam')
  );
});
