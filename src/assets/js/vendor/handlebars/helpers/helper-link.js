/*
 * Link
 *
 * Usage:
 *
 *     {{{link "See more..." href=story.url class="story"}}}
 *
 */

Handlebars.registerHelper('link', function(text, options) {
  var attrs = [];

  for(var prop in options.hash) {
    attrs.push(prop + '="' + options.hash[prop] + '"');
  }

  return new Handlebars.SafeString(
    "<a " + attrs.join(" ") + ">" + text + "</a>"
  );
});