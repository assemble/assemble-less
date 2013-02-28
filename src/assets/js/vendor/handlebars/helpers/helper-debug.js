
/*
 * Debug
 * usage: {{debug}} or {{debug someValue}}
 * from: @commondream (http://thinkvitamin.com/code/handlebars-js-part-3-tips-and-tricks/)
 */

Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("\nCurrent Context");
  console.log("====================");
  console.log(this);

  if (arguments.length > 1) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});