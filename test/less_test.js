/*!
 * assemble-less
 * http://github.com/assemble/assemble-less
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var fs = require('fs');

exports.less = {
  compile: function(test) {
    'use strict';

    test.expect(2);

    var actual   = grunt.file.read('test/actual/less.css');
    var expected = grunt.file.read('test/expected/less.css');
    test.equal(expected, actual, 'should compile less, with the ability to handle imported files from alternate include paths');

    actual   = grunt.file.read('test/actual/concat.css');
    expected = grunt.file.read('test/expected/concat.css');
    test.equal(expected, actual, 'should concat output when passed an array');

    test.done();
  },
  compress: function(test) {
    'use strict';

    test.expect(1);

    var actual   = grunt.file.read('test/actual/compress.css');
    var expected = grunt.file.read('test/expected/compress.css');
    test.equal(expected, actual, 'should compress output when compress option is true');

    test.done();
  },
  templates: function(test) {
    'use strict';

    test.expect(2);

    var actual   = grunt.file.read('test/actual/templates-lodash.css');
    var expected = grunt.file.read('test/expected/templates-lodash.css');
    test.equal(expected, actual, 'should replace lodash templates in code comments with variables from JSON or YAML.');

    actual   = grunt.file.read('test/actual/templates-palette.css');
    expected = grunt.file.read('test/expected/templates-palette.css');
    test.equal(expected, actual, 'should replace lodash templates in LESS code with variables from JSON or YAML.');

    test.done();
  },
  nopaths: function(test) {
    'use strict';

    test.expect(1);

    var actual   = grunt.file.read('test/actual/nopaths.css');
    var expected = grunt.file.read('test/expected/nopaths.css');
    test.equal(expected, actual, 'should default paths to the dirname of the less file');

    test.done();
  },
  ieCompat: function(test) {
    'use strict';

    var actual, expected;

    test.expect(2);

    actual   = grunt.file.read('test/actual/ieCompatFalse.css');
    expected = grunt.file.read('test/expected/ieCompatFalse.css');
    test.equal(expected, actual, 'should generate data-uris no matter the size when ieCompat option is true');

    actual   = grunt.file.read('test/actual/ieCompatTrue.css');
    expected = grunt.file.read('test/expected/ieCompatTrue.css');
    test.equal(expected, actual, 'should generate data-uris only when under the 32KB mark for Internet Explorer 8');

    test.done();
  },
   banner: function(test) {
     'use strict';

     test.expect(1);

     var actual   = grunt.file.read('test/actual/banners/banner.css');
     var expected = grunt.file.read('test/expected/banners/banner.css');
     test.equal(expected, actual, 'should prepend custom banner');

     test.done();
   },
   strip_banner: function(test) {
     'use strict';

     test.expect(3);

     var actual   = grunt.file.read('test/actual/strip_banners/banner.css');
     var expected = grunt.file.read('test/expected/strip_banners/banner.css');
     test.equal(expected, actual, 'should strip existing banners');

     actual   = grunt.file.read('test/actual/strip_banners/banner2.css');
     expected = grunt.file.read('test/expected/strip_banners/banner2.css');
     test.equal(expected, actual, 'should strip existing banners [2]');

     actual   = grunt.file.read('test/actual/strip_banners/banner3.css');
     expected = grunt.file.read('test/expected/strip_banners/banner3.css');
     test.equal(expected, actual, 'should strip existing banners [3]');

     test.done();
   }
};
