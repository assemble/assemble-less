/*
 * NOTICE: Most of this code is from grunt-contrib-less
 * but it has been modified to concat the LESS
 * files first, then compile them into a CSS
 * file. This allows for "requiring" LESS files
 * and also for building out individual component
 * CSS files instead of building one big CSS file.
 *
 * grunt-contrib-less
 * http://gruntjs.com/
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 *
 * assemble-styles
 * http://assemble.github.com/assemble-styles
 * Copyright (c) 2013 Brian Woodward, contributors
 * Licensed under the MIT license.
 *
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path');
  var less = require('less');
  var fs   = require('fs');

  var lessOptions = {
    parse: [
      'paths',
      'optimization',
      'filename',
      'strictImports',
      'dumpLineNumbers'
    ],
    render: [
      'compress',
      'yuicompress'
    ]
  };

  grunt.registerMultiTask('styles', 'Compile your LESS stylesheets using underscore and JSON.', function() {
    var done = this.async();

    var options = this.options({
      require: [],
      concat: true
    });

    grunt.verbose.writeflags(options, 'Options');

    grunt.util.async.forEachSeries(this.files, function(f, nextFileObj) {
      var destFile = f.dest;

      var files = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      if (files.length === 0) {
        // No src files, goto next target. Warn would have been issued above.
        nextFileObj();
      }

      var compiled = [];
      var dependencies = [];
      var srcCode = [];

      var concatCompile = function(file, next) {
        grunt.log.writeln('calling concatCompile: ' + file.magenta);
        grunt.util.async.concatSeries(options.requires, function(file, next) {
          if(grunt.util._.contains(dependencies, file) === false) {
            srcCode.push(grunt.file.read(file));
            dependencies.push(file);
          }
          next(null);
        }, function() {});
        srcCode.push(grunt.file.read(file));
        next(null);

      };

      var concatRender = function() {

        var lessCode = srcCode.join(grunt.util.normalizelf(grunt.util.linefeed));
        grunt.log.writeln('compiling less...');
        compileLess(destFile, lessCode, options, function(css, err) {
          if(!err) {
            grunt.file.write(destFile, css);
            grunt.log.writeln('File ' + destFile.cyan + ' created.');
            nextFileObj();
          } else {
            nextFileObj(false);
          }
        });
      };

      var singleCompile = function(file, next) {

        if(fs.existsSync(destFile)) {
          var dirStats = fs.statSync(destFile);
          if(dirStats.isDirectory() === false) {
            grunt.log.warn('Destination must be a directory when compiling to single css files.');
            nextFileObj(false);
          }
        }

        var singleSrcCode = [];
        grunt.util.async.concatSeries(options.requires, function(file, next) {
          singleSrcCode.push(grunt.file.read(file));
          next(null);
        }, function() {});

        singleSrcCode.push(grunt.file.read(file));

        singleSrcCode = singleSrcCode.join(grunt.util.normalizelf(grunt.util.linefeed));

        compileLess(file, singleSrcCode, options, function(css, err) {
          if(!err) {
            // write the file out directly
            var singleDestFile = path.join(destFile, path.basename(file, path.extname(file))) + '.css';
            grunt.file.write(singleDestFile, css);
            grunt.log.ok('File ' + singleDestFile.cyan + ' created.' + ' ok '.green);
            next(null);
          } else {
            nextFileObj(false);
          }
        });

      };

      var singleRender = function() {
        nextFileObj();
      };

      if(options.concat) {
        grunt.util.async.concatSeries(files, concatCompile, concatRender);
      } else {
        grunt.util.async.concatSeries(files, singleCompile, singleRender);
      }

    }, done);
  });

  var compileLess = function(filename, srcCode, options, callback) {
    options = grunt.util._.extend({filename: filename}, options);
    options.paths = options.paths || [path.dirname(filename)];

    var css;
    var parser = new less.Parser(grunt.util._.pick(options, lessOptions.parse));

    grunt.verbose.writeln('before parse');
    parser.parse(srcCode, function(parse_err, tree) {
      if (parse_err) {
        lessError(parse_err);
        callback('',true);
      }

      try {
        grunt.verbose.writeln('parsed...');
        css = tree.toCSS(grunt.util._.pick(options, lessOptions.render));
        grunt.verbose.writeln('rendered...');
        callback(css, null);
      } catch (e) {
        lessError(e);
        callback(css, true);
      }
    });
  };

  var formatLessError = function(e) {
    var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
    return e.filename + ': ' + pos + ' ' + e.message;
  };

  var lessError = function(e) {
    var message = less.formatError ? less.formatError(e) : formatLessError(e);

    grunt.log.error(message);
    grunt.fail.warn('Error compiling LESS.');
  };
};
