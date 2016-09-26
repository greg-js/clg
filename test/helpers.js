/* eslint-env mocha */
var expect = require('chai').expect;
var path = require('path');

describe('helper functions >', function() {
  describe('get-root >', function() {

    var getRoot = require('../lib/helpers/get-root');
    var realRoot = path.resolve(process.cwd());

    it('should find the root of this repo', function() {
      var rootDir = getRoot();
      expect(rootDir).to.be.a('string');
      expect(rootDir).to.equal(realRoot);
    });
  });

  describe('format-date >', function() {

    var formatDate = require('../lib/helpers/format-date');
    var christmas = new Date('2016-12-25 00:00:00');
    var mlkDay = new Date('2016-01-18 12:00:00');
    var birthday = new Date('2016-12-04 16:38:28');

    it('should format dates correctly', function() {
      expect(formatDate(christmas)).to.equal('2016-12-25');
      expect(formatDate(mlkDay)).to.equal('2016-01-18');
      expect(formatDate(birthday)).to.equal('2016-12-04');
    });
  });

  describe('is-valid-path >', function() {

    var isValidPath = require('../lib/helpers/is-valid-path');

    it('should detect valid paths', function() {
      expect(isValidPath(process.cwd())).to.be.true;
      expect(isValidPath(path.resolve(process.cwd(), '..'))).to.be.true;
    });

    it('should detect invalid paths', function() {
      expect(isValidPath('/this/cant/possibly/be/valid')).to.be.false;
      expect(isValidPath('neither/can/this')).to.be.false;
    });
  });

  describe('filters >', function() {

    var fixtures = require('./fixtures/fixtures').filters;
    var itemPaths = fixtures.itemPaths;
    var itemObjects = fixtures.itemObjects;

    describe('filter-on-extensions >', function() {

      var filterOnExtensions = require('../lib/helpers/filters').filterOnExtensions;

      it('should filter with both string, comma-separated string and array filters', function() {
        expect(filterOnExtensions(itemPaths, 'md')).to.be.an('array');
        expect(filterOnExtensions(itemPaths, 'html')).to.be.an('array');
        expect(filterOnExtensions(itemPaths, 'md').length).to.equal(2);
        expect(filterOnExtensions(itemPaths, ['md', 'markdown']).length).to.equal(3);
        expect(filterOnExtensions(itemPaths, 'md,markdown').length).to.equal(3);
        expect(filterOnExtensions(itemPaths, ['md', 'markdown'])[0]).to.equal('/this/is/a/path/one.md');
      });

      it('should accept any kind of filter', function() {
        expect(filterOnExtensions(itemPaths, 'js').length).to.equal(2);
        expect(filterOnExtensions(itemPaths, ['js'])[0]).to.equal('/this/is/a/path/five.js');
        expect(filterOnExtensions(itemPaths, ['js', 'ejs', 'jsx']).length).to.equal(4);
      });

      it('should return all files when not given a filter at all', function() {
        expect(filterOnExtensions(itemPaths).length).to.equal(8);
      });
    });

    describe('filter-on-dirs >', function() {

      var filterOnDirs = require('../lib/helpers/filters').filterOnDirs;

      it('should throw an error when passed in a non-array for source or dir', function() {
        expect(filterOnDirs.bind(null, itemPaths, 'source', 'dir')).to.throw(/pass in arrays/);
        expect(filterOnDirs.bind(null, itemPaths, 'source', ['dir'])).to.throw(/pass in arrays/);
        expect(filterOnDirs.bind(null, itemPaths, ['source'], 'dir')).to.throw(/pass in arrays/);
        expect(filterOnDirs.bind(null, itemPaths, '', '')).to.throw(/pass in arrays/);
        expect(filterOnDirs.bind(null, itemPaths)).to.throw(/pass in arrays/);
      });

      it('should filter on single & multiple sources, dirs and combinations', function() {
        expect(filterOnDirs(itemPaths, ['some'], [])).to.be.an('array');
        expect(filterOnDirs(itemPaths, ['some'], []).length).to.equal(4);
        expect(filterOnDirs(itemPaths, ['some'], ['dir']).length).to.equal(2);
        expect(filterOnDirs(itemPaths, ['a', 'some'], []).length).to.equal(8);
        expect(filterOnDirs(itemPaths, ['some'], ['dir', 'path']).length).to.equal(4);
        expect(filterOnDirs(itemPaths, ['not'], ['dir', 'path']).length).to.equal(0);
        expect(filterOnDirs(itemPaths, ['a', 'some'], ['not']).length).to.equal(0);
        expect(filterOnDirs(itemPaths, ['is/a'], ['path']).length).to.equal(2);
      });
    });

    describe('filter-on-search-terms >', function() {

      var filterOnSearchTerms = require('../lib/helpers/filters').filterOnSearchTerms;

      it('should throw an error when passed in a non-array for search terms', function() {
        expect(filterOnSearchTerms.bind(null, itemObjects, 'test', false)).to.throw(/pass in an array/);
        expect(filterOnSearchTerms.bind(null, itemObjects, undefined, false)).to.throw(/pass in an array/);
      });

      it('should filter on title if there is a title', function() {
        expect(filterOnSearchTerms(itemObjects, ['title'])).to.be.an('array');
        expect(filterOnSearchTerms(itemObjects, ['second']).length).to.equal(1);
        expect(filterOnSearchTerms(itemObjects, ['this']).length).to.equal(2);
      });

      it('should use the fileName property if there is no title', function() {
        expect(filterOnSearchTerms(itemObjects, ['frontmatter']).length).to.equal(1);
        expect(filterOnSearchTerms(itemObjects, ['post']).length).to.equal(3);
      });

      it('should support multiple search terms and regexes containing spaces', function() {
        expect(filterOnSearchTerms(itemObjects, ['this is']).length).to.equal(1);
        expect(filterOnSearchTerms(itemObjects, ['this', 'is']).length).to.equal(2);
        expect(filterOnSearchTerms(itemObjects, ['this', 'post']).length).to.equal(2);
      });

      it('should search in the body as well if passed the apropos options', function() {
        expect(filterOnSearchTerms(itemObjects, ['content'], true).length).to.equal(2);
        expect(filterOnSearchTerms(itemObjects, ['this'], true).length).to.equal(3);
      });
    });
  });

  describe('load-config >', function() {

    var loadConfig = require('../lib/helpers/load-config');
    var customRootDir = './test/fixtures';
    var defaultCase = loadConfig('./', require('../.clg.json'));
    var customCase = loadConfig(customRootDir, require('../.clg.json'));

    it('should load the default config if no custom one is found in the rootDir', function() {
      expect(defaultCase).to.be.an('object');
      expect(defaultCase.sourceDirs).to.be.an('array');
      expect(defaultCase.supported).to.be.an('array');
      expect(defaultCase.extensions).to.be.an('array');
      expect(defaultCase.extensions[0]).to.equal('md');
    });

    it('should concatenate custom arrayed options with the defaults', function() {
      expect(customCase).to.be.an('object');
      expect(customCase.extensions).to.be.an('array');
      expect(customCase.extensions.length).to.equal(4);
    });

    it('should replace the defaults with custom comma-separated string options', function() {
      expect(customCase).to.be.an('object');
      expect(customCase.sourceDirs).to.be.an('array');
      expect(customCase.sourceDirs.length).to.equal(2);
    });
  });
});
