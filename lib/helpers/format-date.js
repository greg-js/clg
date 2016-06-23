module.exports = function(ISOdate) {
  var date = new Date(ISOdate);
  var unpaddedMonth = date.getMonth() + 1;
  var month = (unpaddedMonth < 10) ? '0' + unpaddedMonth : unpaddedMonth;
  var unpaddedDay = date.getDate();
  var day = (unpaddedDay < 10) ? '0' + unpaddedDay : unpaddedDay;

  return date.getFullYear() + '-' + month + '-' + day;
};
