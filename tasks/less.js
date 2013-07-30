/*
 * NOTICE: Most of this code is from grunt-contrib-less
 * Please use that project if you require something
 * stable and reliable. This project is focused on
 * testing experimental features, some of which might
 * be submitted as pull requests with grunt-contrib-less.
 *
 * grunt-contrib-less
 * http://gruntjs.com/
 * Copyright (c) 2013 Tyler Kellen, contributors
 * Licensed under the MIT license.
 *
 * assemble-less
 * http://github.com/assemble/assemble-less
 * Copyright (c) 2013 Jon Schlinkert, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Internal lib.
  var contrib = require('grunt-lib-contrib').init(grunt);
  var comment = require('./lib/comment').init(grunt);

  var path = require('path');
  var less = false;
  var _ = grunt.util._;

  var lessOptions = {
    parse: [
      'paths',
      'optimization',
      'filename',
      'relativeUrls',
      'strictImports',
      'dumpLineNumbers',
      'processImports',
      'syncImport',
    ],
    render: [
      'silent',
      'verbose',
      'compress',
      'yuicompress',
      'ieCompat',
      'strictMath',
      'strictUnits'
    ]
  };

  grunt.registerMultiTask('less', 'Compile LESS files to CSS', function() {
    var done = this.async();

    // Task options.
    var options = this.options({
      version: 'less',
      imports: '',
      process: false,
      banner: '',
      stripBanners: false
    });

    // Less.js defaults.
    var defaults = {
      verbose: true,
      processImports: true,
      strictMath: false,
      strictUnits: false
    };

    // Process banner.
    var banner = grunt.template.process(options.banner);

    // Normalize boolean options that accept options objects.
    if (options.stripBanners === true) { options.stripBanners = {}; }

    // Default options per target
    options = grunt.util._.defaults(options || {}, defaults);

    grunt.verbose.writeflags(options, 'Options');

    // Load less version specified in options, else load default
    grunt.verbose.writeln('Loading less from ' + options.version);
    try {
      less = require(options.version);
    } catch (err) {
      var lessPath = path.join(process.cwd(), options.version);
      grunt.verbose.writeln('lessPath: ', lessPath);
      less = require(lessPath);
      grunt.log.success('\nRunning Less.js v', path.basename(options.version) + '\n');
    }

    // Read Less.js options from a specified lessrc file.
    if (options.lessrc) {
      var fileType = options.lessrc.split('.').pop();
      if (fileType === 'yaml' || fileType === 'yml') {
        options = grunt.file.readYAML(options.lessrc);
      } else {
        options = grunt.file.readJSON(options.lessrc);
      }
      delete options.lessrc;
    }

    grunt.verbose.writeln('Less loaded');

    if (this.files.length < 1) {
      grunt.log.warn('Destination not written because no source files were provided.');
    }

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
        if (f.src.length < 1) {
          grunt.log.warn('Destination not written because no source files were found.');
        }

        // No src files, goto next target. Warn would have been issued above.
        return nextFileObj();
      }

      var compiledMax = [];
      var compiledMin = [];

      grunt.util.async.concatSeries(files, function(file, next) {
        compileLess(file, options, function(css, err) {
          if (!err) {
            if (css.max) {
              compiledMax.push(css.max);
          }
            compiledMin.push(css.min);
            next();
          } else {
            nextFileObj(err);
          }
        });
      }, function() {
        if (compiledMin.length < 1) {
          grunt.log.warn('Destination not written because compiled files were empty.');
        } else {
          var min = compiledMin.join(options.yuicompress ? '' : grunt.util.normalizelf(grunt.util.linefeed));
          grunt.file.write(destFile, banner + min);
          grunt.log.writeln('File ' + destFile.cyan + ' created.');

          // ...and report some size information.
          if (options.report) {
            contrib.minMaxInfo(min, compiledMax.join(grunt.util.normalizelf(grunt.util.linefeed)), options.report);
          }
        }
        nextFileObj();
        });

    }, done);
  });

  var compileLess = function(srcFile, options, callback) {
    options = grunt.util._.extend({
      filename: srcFile,
      process: false
    }, options);
    options.paths = options.paths || [path.dirname(srcFile)];

    // Process imports and any templates.
    var imports = [];
    function processDirective(directive) {
      var directiveString = ' (' + directive + ') ';
      _.each(list, function(item) {
        imports.push('@import' + directiveString + '"' + grunt.template.process(item) + '";');
      });
    }
    for (var directive in options.imports) {
      if (options.imports.hasOwnProperty(directive)) {
        var list = options.imports[directive];
        if (!Array.isArray(list)) {
          list = [list];
        }
        processDirective(directive);
      }
    }
    imports = imports.join('\n');

    var css;
    var srcCode = imports + grunt.file.read(srcFile);

    var parser = new less.Parser(grunt.util._.pick(options, lessOptions.parse));

    // Process files as templates if requested.
    if (options.process === true) {options.process = {};}
    if (typeof options.process === 'function') {
      srcCode = options.process(srcCode, srcFile);
    } else if (options.process) {
      srcCode = grunt.template.process(srcCode, options.process);
    }

    // Strip banners if requested.
    if (options.stripBanners) {
      srcCode = comment.stripBanner(srcCode, options.stripBanners);
    }

    parser.parse(srcCode, function(parse_err, tree) {
      if (parse_err) {
        lessError(parse_err);
        callback('', true);
      }

      try {
        css = minify(tree, grunt.util._.pick(options, lessOptions.render));
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

  var minify = function(tree, options) {
    var result = {
      min: tree.toCSS(options)
    };
    if (!grunt.util._.isEmpty(options)) {
      result.max = tree.toCSS();
    }
    return result;
  };
};