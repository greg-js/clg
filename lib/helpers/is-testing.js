// just a utility function to detect whether mocha is running tests or not
// need this to prevent process.exit during testing
module.exports = function() {
  var args = (process.argv.length > 2) ? process.argv.slice(0, process.argv.length - 1) : process.argv;

  return args.some(function(arg) {
    return /mocha/.test(arg);
  });
};
