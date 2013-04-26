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
 * assemble-less
 * http://assemble.github.com/assemble-less
 * Copyright (c) 2013 Brian Woodward, contributors
 * Licensed under the MIT license.
 *
 */

module.exports = function(grunt) {

'use strict';

  var path    = require('path');
  var fs      = require('fs');
  var util    = require('util');
  var less    = false;
  var comment = require('./lib/comment').init(grunt);
  // var bootstrap = false;

  var lessOptions = {
    parse: [
      'paths',
      'filename',
      'optimization',
      'processImports',
      'dumpLineNumbers',
      'strictImports'
    ],
    render: [
      'silent',
      'verbose',
      'compress',
      'yuicompress',
      'strictMaths',  // enforce maths within parenthesis
      'strictUnits',  // enforce correct units
      'ieCompat'      // enforce IE compatibility (IE8 data-uri)
    ]
  };

  grunt.config.set('bootstrap.base', '<%= less.options.libs %>');

  grunt.registerMultiTask('less', 'Compile LESS to CSS using underscore and JSON.', function() {
    var done = this.async();
    grunt.verbose.writeln(util.inspect(this.files, 10, null));

    var options = this.options({
      banner: '',
      libs: './src/bootstrap',
      version: './test/versions/1.3.3', // 'less-ref-test'
      globals: [],
      concat: true,
      process: false,
      compress: false,
      processImports: true,
      stripComments: false,
      strictMaths: false,
      strictUnits: false
    });


    // Normalize boolean options that accept options objects.
    if (options.stripComments === true) { options.stripComments = {}; }
    if (options.process === true) { options.process = {}; }

    // Process banner
    var banner = grunt.template.process(options.banner);

    // TODO: Extend default options with options from specified lessrc file
    // if (options.lessrc) {
    //   options = grunt.util._.extend(options, grunt.file.readJSON(options.lessrc));
    // }

    grunt.verbose.writeln('loading less from ' + options.version);
    try {
      less = require(options.version);
    } catch (err) {
      var lessPath = path.join(process.cwd(), options.version);
      grunt.verbose.writeln('lessPath: ', lessPath);
      less = require(lessPath);
      grunt.log.success('\nRunning Less.js v', path.basename(options.version) + '\n');
    }
    grunt.verbose.writeln('less loaded');

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
        // Process files as templates if requested.
        if (options.process) {
          src = grunt.template.process(src, options.process);
        }
      });

      // No src files, goto next target. Warn would have been issued above.
      if (files.length === 0) {
        nextFileObj();
      }

      var compiled = [];
      var dependencies = [];
      var srcCode = [];

      // Compile multiple concatenated LESS files.
      var concatCompile = function(file, next) {
        grunt.log.writeln('calling concatCompile: ' + file.magenta);
        grunt.util.async.concatSeries(options.globals, function(file, next) {
          if(grunt.util._.contains(dependencies, file) === false) {
            srcCode.push(grunt.file.read(file));
            dependencies.push(file);
          }
          next(null);
        }, function() {});
        srcCode.push(grunt.file.read(file));
        next(null);

      };

      // Render multiple concatenated LESS files.
      var concatRender = function() {

        var lessCode = banner + srcCode.join(grunt.util.normalizelf(grunt.util.linefeed));
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

      // Compile individual LESS files.
      var singleCompile = function(file, next) {

        if(fs.existsSync(destFile)) {
          var dirStats = fs.statSync(destFile);
          if(dirStats.isDirectory() === false) {
            grunt.log.warn('Destination must be a directory when compiling to single css files.');
            nextFileObj(false);
          }
        }

        var singleSrcCode = [];
        grunt.util.async.concatSeries(options.globals, function(file, next) {
          singleSrcCode.push(grunt.file.read(file));
          next(null);
        }, function() {});

        singleSrcCode.push(grunt.file.read(file));

        singleSrcCode = banner + singleSrcCode.join(grunt.util.normalizelf(grunt.util.linefeed));

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

      // Render individual LESS files.
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

    // LESS Parser (parseCopyProperties)
    var parser = new less.Parser(grunt.util._.pick(options, lessOptions.parse));

    grunt.verbose.writeln('before parse');
    parser.parse(srcCode, function(parse_err, tree) {
      if (parse_err) {
        lessError(parse_err);
        callback('',true);
      }

      try {
        grunt.verbose.writeln('parsed...');
        // LESS (evalCopyProperties)
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