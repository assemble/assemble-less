/*
 * To Sentence
 * Return a comma-serperated list from an iterable object
 *
 *    usage:
 *
 *    {{#toSentence tags}} {{name}} {{/toSentence}}
 *
 */

Handlebars.registerHelper('toSentence', function(context, block) {
  var ret = "";
  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + block(context[i]);
    if (i<j-1) {
      ret = ret + ", ";
    };
  }
  return ret;
});