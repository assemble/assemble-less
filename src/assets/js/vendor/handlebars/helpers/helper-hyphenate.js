/*
 * Hyphenate
 * usage:
 * from:
 */

Handlebars.registerHelper('hyphenate', function(tag) {
  return tag.split(' ').join('-');
});