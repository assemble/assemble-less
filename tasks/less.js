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
  // var comment = require('./lib/comment').init(grunt);

  var path = require('path');
  var less = false;
  var _ = grunt.util._;
  var minimatch = require('minimatch');

  var pkg;
  if(grunt.file.exists('package.json')) {
    pkg = require(path.resolve(process.cwd(), 'package.json'));
  } else {
    pkg = path.join.bind(null, __dirname, '../package.json');
  }

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
      require: '',
      version: 'less',
      modules: [],
      imports: {
        reference: [],
        less: [],
        css: [],
        inline: []
      },
      process: true,
      merge: true,
      metadata: [],
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

    // Glob patterns for LESS modules to search for.
    var patterns;
    if (options.require) {
      patterns = options.require;
    } else if (patterns === undefined) {
      patterns = 'upstage-*';
    }

    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    // Bower packages
    var bowerdir;
    if (grunt.file.exists('.bowerrc')) {
      bowerdir = grunt.file.readJSON(path.resolve(process.cwd(), '.bowerrc')).directory;
    } else {
      bowerdir = 'bower_components';
    }
    // Read in all bower.json files, keep the depth to 1 level since bower deps
    // are flattened in the root components directory.
    var bowerFiles = grunt.file.expand(bowerdir + '/{,*}/bower.json').map(grunt.file.readJSON);

    // Get the paths to any '.less' files in the 'main' property of each file
    var bowerDeps = _.compact(_.unique(_.flatten(bowerFiles)).map(function (obj) {
      if (_.contains(obj.main, '.less')) {
        return path.join(bowerdir + path.sep + obj.name + path.sep + obj.main).replace(/\\/g, '/');
      }
    }));

    // Load NPM modules
    var modules = Object.keys(pkg.dependencies);
    var deps = patterns.map(function (pattern) {
      return minimatch.match(modules, pattern, {});
    });

    var upstage = _.unique(_.flatten(deps)).map(function (pattern) {
      return path.relative(process.cwd(), require.resolve(pattern)).replace(/\\/g, '/');
    });

    // TODO: test to make sure this won't break if bower.json and
    // package.json are missing.
    //
    // Extend "reference" option with paths to LESS files from
    // node_modules or from bower components.
    options.imports.reference = _.union(options.imports.reference, bowerDeps, upstage);

    grunt.verbose.writeln('Modules: ' + modules);
    grunt.verbose.writeln('dependencies: ' + deps);
    grunt.verbose.writeln('Upstage: ' + upstage);

    // Merge metadata at the task and target levels. Disable if you
    // do not want metadata to be merged
    if (options.merge === true) {
      options.metadata = mergeOptionsArrays(this.target, 'metadata');
    }

    // Process banner.
    var banner = grunt.template.process(options.banner);

    // Normalize boolean options that accept options objects.
    if (options.stripBanners === true) {options.stripBanners = {};}

    // Default options per target
    options = _.defaults(options || {}, defaults);

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
        options = _.merge(options || {}, grunt.file.readYAML(options.lessrc));
      } else {
        options = _.merge(options || {}, grunt.file.readJSON(options.lessrc));
      }
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
    options = _.extend({
      filename: srcFile,
      process: options.process
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

    // Build the array of @required files
    var match = srcCode.match(/@require\s*"([\w\.-]+).(?:less|css)\s*";/g);
    if(match){
      var modMatches = match.map(function(module) {
        return module.replace('@require "', '').replace('.less";', '');
      }).map(function (file) {
        // In @require statements, use the name of the module, not the main file of the module.
        // Let npm do the hard work of figuring out which file to actually use.
        return path.relative(process.cwd(), require.resolve(file)).replace(/\\/g, '/');
      });

      // Merge the array of required files into the less import options.
      options.imports.reference = _.unique(_.union(options.imports.reference, modMatches));
      grunt.verbose.writeln(JSON.stringify(options.imports.reference, null, 2));
    }

    // Pass JSON and/or YAML data into embedded templates.
    var metadata = {};
    var metadataFiles = grunt.file.expand(options.metadata);
    metadataFiles.forEach(function(metadataFile) {
      var filename = path.basename(metadataFile, path.extname(metadataFile));
      var fileExt = metadataFile.split('.').pop();
      if (fileExt === 'yml' || fileExt === 'yaml') {
        metadata[filename] = grunt.file.readYAML(metadataFile);
      } else {
        metadata[filename] = grunt.file.readJSON(metadataFile);
      }
    });

    // Process files as templates if specified
    if (options.process === true) {options.process = {};}
    if (typeof options.process === 'function') {
      srcCode = options.process(srcCode, srcFile);
    } else if (options.process) {
      srcCode = grunt.template.process(srcCode, {data: metadata});
    }

    function stripBanner(src) {
      if (src instanceof Buffer) {
        src = src.toString("utf-8");
      }
      return src.replace(/^\s*\/\*[\s\S]*?\*\/\s*/g, "");
    }

    // Strip banners if requested.
    if (options.stripBanners) {
      srcCode = stripBanner(srcCode, options.stripBanners);
    }

    var parser = new less.Parser(_.pick(options, lessOptions.parse));

    parser.parse(srcCode, function(parse_err, tree) {
      if (parse_err) {
        lessError(parse_err);
        callback('', true);
      }

      try {
        css = minify(tree, _.pick(options, lessOptions.render));
        callback(css, null);
      } catch (e) {
        lessError(e);
        callback(css, true);
      }
    });
  };

  /**
   * Credit: @doowb, assemble
   * https://github.com/assemble/assemble
   */
  var mergeOptionsArrays = function(target, name) {
    var taskArray = grunt.config(['less', 'options', name]) || [];
    var targetArray = grunt.config(['less', target, 'options', name]) || [];
    return _.union(taskArray, targetArray);
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
    if (!_.isEmpty(options)) {
      result.max = tree.toCSS();
    }
    return result;
  };
};