/*!
 * grunt-contrib-less
 * http://gruntjs.com/
 * Copyright (c) 2014 Tyler Kellen, contributors
 * Licensed under the MIT license.
 *
 * assemble-less
 * http://github.com/assemble/assemble-less
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');
var fs = require('fs');

var read = function(src) {
  return grunt.util.normalizelf(grunt.file.read(src));
};

exports.less = {
  variables: function(test) {
    test.expect(2);

    var actual   = read('test/actual/globalVars.css');
    var expected = read('test/expected/globalVars.css');
    test.equal(expected, actual, 'should prepend variables to less source files.');

    actual   = read('test/actual/modifyVars.css');
    expected = read('test/expected/modifyVars.css');
    test.equal(expected, actual, 'should append variables to less source files.');

    test.done();
  },
  compile: function(test) {
    test.expect(2);

    var actual   = read('test/actual/less.css');
    var expected = read('test/expected/less.css');
    test.equal(expected, actual, 'should compile less, with the ability to handle imported files from alternate include paths');

    actual   = read('test/actual/concat.css');
    expected = read('test/expected/concat.css');
    test.equal(expected, actual, 'should concat output when passed an array');

    test.done();
  },
  compress: function(test) {
    test.expect(1);

    var actual   = read('test/actual/compress.css');
    var expected = read('test/expected/compress.css');
    test.equal(expected, actual, 'should compress output when compress option is true');

    test.done();
  },
  templates: function(test) {
    test.expect(2);

    var actual   = read('test/actual/lodash/templates-lodash.css');
    var expected = read('test/expected/templates-lodash.css');
    test.equal(expected, actual, 'should replace lodash templates in code comments with variables from JSON or YAML.');

    actual   = read('test/actual/lodash/templates-palette.css');
    expected = read('test/expected/templates-palette.css');
    test.equal(expected, actual, 'should replace lodash templates in LESS code with variables from JSON or YAML.');

    test.done();
  },
  nopaths: function(test) {
    test.expect(1);

    var actual   = read('test/actual/nopaths.css');
    var expected = read('test/expected/nopaths.css');
    test.equal(expected, actual, 'should default paths to the dirname of the less file');

    test.done();
  },
  cleancss: function(test) {
    test.expect(2);

    var actual = read('test/actual/cleancss.css');
    var expected = read('test/expected/cleancss.css');
    test.equal(expected, actual, 'should cleancss output when cleancss option is true');

    actual = read('test/actual/cleancssReport.css');
    expected = read('test/expected/cleancssReport.css');
    test.equal(expected, actual, 'should cleancss output when cleancss option is true and concating is enable');

    test.done();
  },
  ieCompat: function(test) {
    test.expect(2);

    var actual = read('test/actual/ieCompatFalse.css');
    var expected = read('test/expected/ieCompatFalse.css');
    test.equal(expected, actual, 'should generate data-uris no matter the size when ieCompat option is true');

    actual   = read('test/actual/ieCompatTrue.css');
    expected = read('test/expected/ieCompatTrue.css');
    test.equal(expected, actual, 'should generate data-uris only when under the 32KB mark for Internet Explorer 8');

    test.done();
  },
   banner: function(test) {
     test.expect(1);

     var actual   = read('test/actual/banners/banner.css');
     var expected = read('test/expected/banners/banner.css');
     test.equal(expected, actual, 'should prepend custom banner');

     test.done();
   },
   strip_banner: function(test) {
     test.expect(3);

     var actual   = read('test/actual/strip_banners/banner.css');
     var expected = read('test/expected/strip_banners/banner.css');
     test.equal(expected, actual, 'should strip existing banners');

     actual   = read('test/actual/strip_banners/banner2.css');
     expected = read('test/expected/strip_banners/banner2.css');
     test.equal(expected, actual, 'should strip existing banners [2]');

     actual   = read('test/actual/strip_banners/banner3.css');
     expected = read('test/expected/strip_banners/banner3.css');
     test.equal(expected, actual, 'should strip existing banners [3]');

     test.done();
   },

  variablesAsLess: function(test) {
    test.expect(1);

    var actual = read('test/actual/variablesAsLess.css');
    var expected = read('test/expected/variablesAsLess.css');
    test.equal(expected, actual, 'should process css files imported less files');

    test.done();
  },
  sourceMap: function(test) {
    test.expect(1);

    var actual = read('test/actual/sourceMap.css');
    test.ok(actual.indexOf('/*# sourceMappingURL=') !== -1, 'compiled file should include a source map.');

    test.done();
  },
  sourceMapFilename: function(test) {
    test.expect(1);

    var sourceMap = grunt.file.readJSON('test/actual/sourceMapFilename.css.map');
    test.equal(sourceMap.sources[0], 'test/fixtures/style3.less', 'should generate a sourceMap with the less file reference.');

    test.done();
  },
  sourceMapURL: function(test) {
    test.expect(1);

    var actual = read('test/actual/sourceMapWithCustomURL.css');
    test.ok(actual.indexOf('/*# sourceMappingURL=custom/url/for/sourceMap.css.map') !== -1, 'compiled file should have a custom source map URL.');
    test.done();
  },
  sourceMapBasepath: function(test) {
    test.expect(1);

    var sourceMap = grunt.file.readJSON('test/actual/sourceMapBasepath.css.map');
    test.equal(sourceMap.sources[0], 'style3.less', 'should use the basepath for the less file references in the generated sourceMap.');

    test.done();
  },
  sourceMapRootpath: function(test) {
    test.expect(1);

    var sourceMap = grunt.file.readJSON('test/actual/sourceMapRootpath.css.map');
    test.equal(sourceMap.sources[0], 'http://example.org/test/fixtures/style3.less', 'should use the rootpath for the less file references in the generated sourceMap.');

    test.done();
  },
  // sourceMapLessInline: function(test) {
  //   test.expect(1);

  //   var expected = read('test/fixtures/style3.less');
  //   var sourceMap = grunt.file.readJSON('test/actual/sourceMapLessInline.css.map').sourcesContent[0];
  //   test.equal(grunt.util.normalizelf(sourceMap), grunt.util.normalizelf(expected), 'should put the less file into the generated sourceMap instead of referencing them.');

  //   test.done();
  // },
  customFunctions: function(test) {
    test.expect(1);

    var actual = read('test/actual/customFunctions.css');
    var expected = read('test/expected/customFunctions.css');
    test.equal(expected, actual, 'should execute custom functions');

    test.done();
  }
};