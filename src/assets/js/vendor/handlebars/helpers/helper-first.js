/*
 * First
 *
 * return the first item of a list only
 * usage:
 *
 *     {{#first items}}{{name}}{{/first}}
 *
 */

Handlebars.registerHelper('first', function(context, block) {
  return block(context[0]);
});