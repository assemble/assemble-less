const path = require('path');
const file = require('fs-utils');

// If `debug` is defined, output data files for inspection
exports.debug = function(options) {
  options = options || {};
  var code = options.code;
  var src = options.src;
  var dest = options.dest || 'tmp/debug';

  if (options.debug) {
    var name = path.basename(src, path.extname(src));

    // Write the file.
    if (options.type && options.type === 'json') {
      dest = path.join(dest, name + '.json');
      file.writeJSONSync(dest, code);
    } else {
      dest = path.join(dest, name + '.less');
      file.writeFileSync(dest, code);
    }
  }
  return;
};