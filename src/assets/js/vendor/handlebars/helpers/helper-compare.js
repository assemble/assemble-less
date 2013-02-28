/**
 * Compare
 * Comparison block helper
 * It takes 2 parameters, but you can also pass an
 * optional operator hashed argument.
 * If you omit the operator argument it defaults to ==.
 *
 * Usage:
 *
 *     {{#compare Database.Tables.Count ">" 5}}
 *       There are more than 5 tables
 *     {{/compare}}
 *
 *     {{#compare "Test" "Test"}}
 *       Default comparison of "==="
 *     {{/compare}}
 */
Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

  var operators, result;

  if (arguments.length < 3) {
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  }

  if(options === undefined) {
    options  = rvalue;
    rvalue   = operator;
    operator = "===";
  }

  operators = {
    '=='    : function (l, r) { return l == r; },
    '==='   : function (l, r) { return l === r; },
    '!='    : function (l, r) { return l != r; },
    '!=='   : function (l, r) { return l !== r; },
    '<'     : function (l, r) { return l < r; },
    '>'     : function (l, r) { return l > r; },
    '<='    : function (l, r) { return l <= r; },
    '>='    : function (l, r) { return l >= r; },
    'typeof': function (l, r) { return typeof l == r; }
  };

  if (!operators[operator]) {
    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
  }

  result = operators[operator](lvalue, rvalue);

  if(result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }

});