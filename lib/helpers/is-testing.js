// just a utility function to detect whether mocha is running tests or not
// need this to prevent process.exit during testing
module.exports = function() {
  console.log(process.argv);
  return process.argv.some(function(arg) {
    return /mocha/.test(arg);
  });
};
