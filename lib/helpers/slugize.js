module.exports = function(str) {
  return str
    .replace(/\s/g, '-')
    .replace(/[()=:.,!#$@"'/\|?*+]/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
};
