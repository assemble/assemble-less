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

var path = require('path');
var file = require('fs-utils');
var async = require('async');
var maxmin = require('maxmin');
var less = require('less');
var log = require('verbalize');
var _ = require('lodash');
var utils  = require('./lib/utils');


module.exports = function(grunt) {
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
      'strictUnits',
      'urlArgs'
    ]
  };

  grunt.registerMultiTask('less', 'Compile LESS files to CSS, with experimental features.', function() {
    var done = this.async();

    // Task options.
    var options = this.options({
      imports: {},
      metadata: [],
      process: true,
      stripBanners: false,
      version: 'less',

      // Less.js options
      banner: '',
      syncImport: '',
      globalVars: {},
      modifyVars: {},
      report: 'min'
    });

    // By default, metadata at the task and target levels is merged.
    // Set `mergeMetadata` to false if you do not want metadata to be merged.
    if (options.mergeMetadata !== false) {
      options.metadata = mergeOptionsArrays(this.target, 'metadata');
    }

    // Process banner.
    options.banner = grunt.template.process(options.banner) || '';

    // extend options with options from a config file.
    if (options.lessrc) {
      try {
        options = _.merge(options, file.readDataSync(options.lessrc));
        log.verbose.writeln('options: ', options);
      } catch(e) {
        log.error(e);
      }
    }

    // Load less version specified in options, else load default
    log.verbose.writeln('Loading less from ' + options.version);
    try {
      less = require(options.version);
    } catch (err) {
      var lessPath = path.join(process.cwd(), options.version);
      log.verbose.writeln('lessPath: ', lessPath);
      less = require(lessPath);
      log.success('\nRunning Less.js v', less.version.join('.') + '\n');
    }

    log.verbose.writeln('Less loaded');

    if (this.files.length < 1) {
      log.verbose.warn('Destination not written because no source files were provided.');
    }

    async.eachSeries(this.files, function(f, nextFileObj) {
      var destFile = f.dest;

      var files = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!file.exists(filepath)) {
          log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      if (files.length === 0) {
        if (f.src.length < 1) {
          log.warn('Destination not written because no source files were found.');
        }

        // No src files, goto next target. Warn would have been issued above.
        return nextFileObj();
      }

      var compiledMax = [],
        compiledMin = [];

      async.concatSeries(files, function(filepath, next) {
        compileLess(filepath, options, function(css, err) {
          if (!err) {
            if (css.max) {
              compiledMax.push(css.max);
            }
            compiledMin.push(css.min);
            process.nextTick(next);
          } else {
            nextFileObj(err);
          }
        }, function (sourceMapContent) {
          file.writeFileSync(options.sourceMapFilename, sourceMapContent);
          log.writeln('File ' + log.cyan(options.sourceMapFilename) + ' created.');
        });
      }, function() {
        if (compiledMin.length < 1) {
          log.warn('Destination not written because compiled files were empty.');
        } else {
          var max = compiledMax.join(grunt.util.normalizelf(grunt.util.linefeed));
          var min = compiledMin.join(options.cleancss ? '' : grunt.util.normalizelf(grunt.util.linefeed));
          file.writeFileSync(destFile, min);
          log.writeln('File ' + log.cyan(destFile) + ' created: ' + maxmin(max, min, options.report === 'gzip'));
        }
        nextFileObj();
      });

    }, done);
  });

  var compileLess = function(srcFile, options, callback, sourceMapCallback) {
    options = _.extend({filename: srcFile, process: options.process}, options);
    options.paths = options.paths || [path.dirname(srcFile)];
    options.imports = options.imports || {};

    if (typeof options.paths === 'function') {
      try {
        options.paths = options.paths(srcFile);
      } catch (e) {
        grunt.fail.warn(wrapError(e, 'Generating @import paths failed.'));
      }
    }

    if (typeof options.sourceMapBasepath === 'function') {
      try {
        options.sourceMapBasepath = options.sourceMapBasepath(srcFile);
      } catch (e) {
        grunt.fail.warn(wrapError(e, 'Generating sourceMapBasepath failed.'));
      }
    }

    var css,
      directives = [],
      srcCode = '';


    // Probably the biggest hit on build execution time.
    var parseImports = function(options) {
      var directives = _.pairs(options.imports);
      var statement = '';

      directives.forEach(function(pair) {
        pair[1].map(function(filepath) {

          // Don't add a circular reference.
          if (!!~srcFile.search(filepath)) {
            return;
          }
          statement += '@import (' + pair[0] + ') "' + filepath + '";\n';
        });
      });
      return statement;
    };

    srcCode += parseImports(options);
    srcCode += file.readFileSync(srcFile);

    var arrayify = function(data) {
      return !Array.isArray(data) ? [data] : data;
    };

    var expandData = function (data, options) {
      var opts = _.extend({namespace: false}, options || {});

      opts.data = {};
      if (_.isString(data) || _.isArray(data)) {
        arrayify(data).map(function (meta) {
          if (_.isString(meta)) {
            _.extend(opts.data, file.expandDataFiles(meta, opts));
          } else if (_.isObject(meta)) {
            _.extend(opts.data, meta);
          }
        });
      } else {
        _.extend(opts.data, data);
      }
      return opts.data;
    };

    // Read in metadata to pass to templates as context.
    var data = {};
    if (options.metadata) {
      options.metadata = file.expandData(options.metadata, {namespace: true});

      // Read in metadata to pass to templates as context.
      _.merge(options.metadata, options);
      _.merge(options.metadata, grunt.config.process(options.metadata));

      // if (data.metadata) {
      //   file.expand(data.metadata).map(function(filepath) {
      //     _.extend(data, {metadata: file.readDataSync(filepath)});
      //   });
      // }
      // _.extend(metadata, _.cloneDeep(grunt.config.data));
      // _.extend(metadata, _.cloneDeep(grunt.task.current.data.options));

    }
      console.log(options.metadata);

    file.writeJSONSync('metadata-nonamespace.json', options.metadata);


    if (options.process === true) {options.process = {};}
    if (typeof options.process === 'function') {
      srcCode = options.process(srcCode, srcFile);
    } else if (options.process) {
      srcCode = grunt.template.process(srcCode, {data: data});
    }

    // Strip banners if requested.
    if (options.stripBanners) {
      srcCode = comment.stripBanner(srcCode, options.stripBanners);
    }

    var parser = new less.Parser(_.pick(options, lessOptions.parse));

    // Equivalent to --modify-vars option.
    // Properties under options.modifyVars are appended as less variables
    // to override global variables.
    var modifyVarsOutput = parseVariableOptions(options['modifyVars']);
    srcCode += modifyVarsOutput;

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
            var res = options.customFunctions[name].apply(this, args);
            return typeof res === "object" ? res : new less.tree.Anonymous(res);
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

  var parseVariableOptions = function(options) {
    var pairs = _.pairs(options);
    var output = '';
    pairs.forEach(function(pair) {
      output += '@' + pair[0] + ':' + pair[1] + ';';
    });
    return output;
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

    log.error(message);
    grunt.fail.warn('Error compiling ' + file);
  };

  var wrapError = function (e, message) {
    var err = new Error(message);
    err.origError = e;
    return err;
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