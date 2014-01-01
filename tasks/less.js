/*
 * NOTE that most of this code is from grunt-contrib-less. PLEASE USE
 * THAT PROJECT IF YOU REQUIRE SOMETHING STABLE AND RELIABLE. This
 * project is focused on testing experimental features, some of which
 * may be removed in the future.
 *
 *
 * grunt-contrib-less
 * http://gruntjs.com/
 * Copyright (c) 2014 Tyler Kellen, contributors
 * Licensed under the MIT license.
 *
 *
 * assemble-less
 * http://github.com/assemble/assemble-less
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT license.
 */


'use strict';

// Node.js
var path  = require('path');

// node_modules
var async = require('async');
var _     = require('lodash');


module.exports = function(grunt) {

  var contrib = require('grunt-lib-contrib').init(grunt);

  // Internal libs
  var utils   = require('./lib/utils');
  var comment = require('./lib/comment').init(grunt);

  var less = false;
  var lessOptions = {
    parse: [
      'dumpLineNumbers',
      'globalVars',
      'modifyVars',
      'banner',
      'filename',
      'optimization',
      'paths',
      'relativeUrls',
      'rootpath',
      'strictImports',
      'syncImport'
    ],
    render: [
      'cleancss',
      'compress',
      'ieCompat',
      'outputSourceFiles',
      'sourceMap',
      'sourceMapBasepath',
      'sourceMapFilename',
      'sourceMapRootpath',
      'sourceMapURL',
      'strictMath',
      'strictUnits'
    ]
  };

  grunt.registerMultiTask('less', 'Compile LESS files to CSS, with experimental features.', function() {
    var done = this.async();

    // Task options.
    var options = this.options({
      imports: {},
      mergeMetadata: true,
      metadata: [],
      process: true,
      stripBanners: false,
      version: 'less',

      // Less.js options
      banner: '',
      globalVars: {},
      modifyVars: {},
      processImports: true,
      strictMath: false,
      strictUnits: false
    });

    // By default, metadata at the task and target levels is merged.
    // Set `mergeMetadata` to false if you do not want metadata to be merged.
    if (options.mergeMetadata !== false) {
      options.metadata = mergeOptionsArrays(this.target, 'metadata');
    }

    // Process banner.
    options.banner = grunt.template.process(options.banner) || '';

    // Read Less.js options from a specified lessrc file.
    if (options.lessrc) {
      var fileType = options.lessrc.split('.').pop().toLowerCase();
      if (fileType === 'yaml' || fileType === 'yml') {
        // if .lessrc.yml is specified, then parse as YAML
        options = _.merge(options, grunt.file.readYAML(options.lessrc));
        grunt.verbose.writeln('options: ', options);
      } else if (fileType === 'lessrc') {
        // otherwise, parse as JSON
        options = _.merge(options, grunt.file.readJSON(options.lessrc));
        grunt.verbose.writeln('options: ', options);
      }
    }

    // Load less version specified in options, else load default
    grunt.verbose.writeln('Loading less from ' + options.version);
    try {
      less = require(options.version);
    } catch (err) {
      var lessPath = path.join(process.cwd(), options.version);
      grunt.verbose.writeln('lessPath: ', lessPath);
      less = require(lessPath);
      grunt.log.success('\nRunning Less.js v', less.version.join('.') + '\n');
    }

    grunt.verbose.writeln('Less loaded');

    if (this.files.length < 1) {
      grunt.verbose.warn('Destination not written because no source files were provided.');
    }

    async.forEachSeries(this.files, function(f, nextFileObj) {
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

      async.concatSeries(files, function(file, next) {
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
        }, function (sourceMapContent) {
          grunt.file.write(options.sourceMapFilename, sourceMapContent);
          grunt.log.writeln('File ' + options.sourceMapFilename.cyan + ' created.');
        });
      }, function() {
        if (compiledMin.length < 1) {
          grunt.log.warn('Destination not written because compiled files were empty.');
        } else {
          var min = compiledMin.join(options.cleancss ? '' : grunt.util.normalizelf(grunt.util.linefeed));
          grunt.file.write(destFile, min);
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

  var compileLess = function(srcFile, options, callback, sourceMapCallback) {
    options = _.extend({
      filename: srcFile,
      process: options.process
    }, options);
    options.paths = options.paths || [path.dirname(srcFile)];

    var importDirectives = [];

    // Prepare import directives to be prepended to source files
    function processDirective(list, directive) {
      _(options.paths).forEach(function(filepath) {
        _.each(list, function(item) {
          item = path.join(filepath, item);
          grunt.file.expand(grunt.template.process(item)).map(function(ea) {
            importDirectives.push('@import' + ' (' + directive + ') ' + '"' + ea + '";');
          });
        });
      });
    }

    _.forIn(options.imports, function(value, key) {
      value = Array.isArray(value) ? value : [value];
      processDirective(value, key);
    });

    importDirectives = importDirectives.join('\n');

    // Remove self-referencing directives before they are prepended.
    importDirectives = importDirectives.replace(new RegExp('@import.+("' + srcFile + '");'), '');

    var css;
    var srcCode = importDirectives + grunt.file.read(srcFile);

    // Read in metadata to pass to templates as context.
    var metadata = utils.readOptionsData(options.metadata, {namespace: true});

    metadata = _.merge(grunt.config.data, metadata, grunt.task.current.data.options);
    metadata = grunt.config.process(metadata);

    if (options.process === true) {options.process = {};}
    if (typeof options.process === 'function') {
      srcCode = options.process(srcCode, srcFile);
    } else if (options.process) {
      srcCode = grunt.template.process(srcCode, {data: metadata});
    }

    // Strip banners if requested.
    if (options.stripBanners) {
      srcCode = comment.stripBanner(srcCode, options.stripBanners);
    }

    var parser = new less.Parser(_.pick(options, lessOptions.parse));

    parser.parse(srcCode, function(parse_err, tree) {
      if (parse_err) {
        lessError(parse_err, srcFile);
        callback('', true);
      }

      // Load custom functions
      if (options.customFunctions) {
        Object.keys(options.customFunctions).forEach(function(name) {
          less.tree.functions[name.toLowerCase()] = function() {
            var args = [].slice.call(arguments);
            args.unshift(less);
            return new less.tree.Anonymous(options.customFunctions[name].apply(this, args));
          };
        });
      }

      var minifyOptions = _.pick(options, lessOptions.render);

      if (minifyOptions.sourceMapFilename) {
        minifyOptions.writeSourceMap = sourceMapCallback;
      }

      try {
        css = minify(tree, minifyOptions);
        callback(css, null);
      } catch (e) {
        lessError(e, srcFile);
        callback(css, true);
      }
    }, options);
  };

  /**
   * Function from assemble
   * https://github.com/assemble/assemble
   */
  var mergeOptionsArrays = function(target, name) {
    var taskArray = grunt.config([grunt.task.current.name, 'options', name]) || [];
    var targetArray = grunt.config([grunt.task.current.name, target, 'options', name]) || [];
    return _.union(taskArray, targetArray);
  };

  var formatLessError = function(e) {
    var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
    return e.filename + ': ' + pos + ' ' + e.message;
  };

  var lessError = function(e, file) {
    var message = less.formatError ? less.formatError(e) : formatLessError(e);

    grunt.log.error(message);
    grunt.fail.warn('Error compiling ' + file);
  };

  var minify = function(tree, options) {
    var result = {
      min: tree.toCSS(options)
    };
    if (!_.isEmpty(options)) {
      result.max = tree.toCSS();
    }
    return result;
  };
};