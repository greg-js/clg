/* eslint-env mocha */
var expect = require('chai').expect;
var path = require('path');

describe('helper functions', function() {
  describe('get-root', function() {

    var getRoot = require('../lib/helpers/get-root');
    var realRoot = path.resolve(process.cwd());

    it('should find the root of this repo', function() {
      var rootDir = getRoot();
      expect(rootDir).to.be.a('string');
      expect(rootDir).to.equal(realRoot);
    });
  });

  describe('format-date', function() {

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

  describe('is-valid-path', function() {

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
});
