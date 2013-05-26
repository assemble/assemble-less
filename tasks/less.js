/*
 * NOTICE: Most of this code is from grunt-contrib-less
 * but it has been modified to concat the LESS
 * files first, then compile them into a CSS
 * file. This plugin allows for "requiring" LESS files
 * and also for easily building out individual components.
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


  var fs   = require('fs');
  var path = require('path');
  var util = require('util');
  var _    = grunt.util._;
  var less = false;

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
      'strictMaths',
      'strictUnits',
      'ieCompat'
    ]
  };

  grunt.registerMultiTask('less', 'Compile LESS to CSS using underscore and JSON.', function() {
    var done = this.async();

    // Default options.
    var options = this.options({
      version: 'less',
      globals: [],
      concat: true,
      imports: '',
      banner: '',
      process: false,

      // Less.js defaults
      verbose: true,
      processImports: true,
      strictMaths: false,
      strictUnits: false
    });


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
    grunt.verbose.writeln('Less loaded');

    // Normalize boolean options that accept options objects.
    if (options.process === true) { options.process = {}; }

    // Process imports and any templates.
    var imports = [];
    var prependImport = '@import ' ;
    // var appendImport = "\n/* this is a test */\n";

    for(var directive in options.imports) {
      if(options.imports.hasOwnProperty(directive)) {
        var list = options.imports[directive];
        if(!Array.isArray(list)) {
          list = [list];
        }
        var directiveString = '(' + directive + ') ';
        _.each(list, function(item) {
          imports.push(prependImport + directiveString + '"' + grunt.template.process(item) + '";');
        });
      }
    }

    // var ref = options.variables;
    // for (name in ref) {
    //   var value = ref[name];
    //   output += '@' + name + ': ' + value + ';\n';
    // }
    // output += '\n';


    imports = imports.join('\n');

    // Process banner.
    var banner = grunt.template.process(options.banner);

    grunt.util.async.forEachSeries(this.files, function(f, nextFileObj) {
      var destFile = f.dest;

      var files = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files.
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      // No src files, goto next target.
      // Warn would have been issued above.
      if (files.length === 0) {
        nextFileObj();
      }

      var compiled = [];
      var dependencies = [];
      var srcCode = [];

      // Compile multiple concatenated LESS files.
      var concatCompile = function(file, next) {
        grunt.verbose.writeln('Compiling: ' + file.magenta);
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
        var lessCode = banner + imports + srcCode.join(grunt.util.normalizelf(grunt.util.linefeed));
        if (options.process) {
           lessCode = grunt.template.process(lessCode, options.process);
        }
        compileLess(destFile, lessCode, options, function(css, err) {
          if(!err) {
            grunt.file.write(destFile, css);
            grunt.log.notverbose.ok('Compiled "' + destFile.cyan + '"...' + 'OK'.green);
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
        singleSrcCode = banner + imports + singleSrcCode.join(grunt.util.normalizelf(grunt.util.linefeed));

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

      grunt.verbose.writeflags(options, 'assemble-less options');

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

    grunt.verbose.ok('Attempting to parse...' + 'OK'.green);
    parser.parse(srcCode, function(parse_err, tree) {
      if (parse_err) {
        lessError(parse_err);
        callback('',true);
      }
      try {
        grunt.verbose.ok('File(s) parsed...' + 'OK'.green);
        css = tree.toCSS(grunt.util._.pick(options, lessOptions.render));
        grunt.verbose.ok('File(s) rendered...' + 'OK'.green);
        callback(css, null);
      } catch (e) {
        lessError(e);
        callback(css, true);
      }
    });
  };

  _.mixin({

    /* Read optional JSON from Ben Alman, https://gist.github.com/2876125 */
    readOptionalJSON: function(filepath) {
      var data = {};
      try {
        data = grunt.file.readJSON(filepath);
      } catch (e) {}
      return data;
    },
    /* Function from assemble https://github.com/assemble/assemble */
    mergeOptionsArrays: function(target, name) {
      var globalArray = grunt.config(['lessrc', 'options', name]) || [];
      var targetArray = grunt.config(['lessrc', target, 'options', name]) || [];
      return _.union(globalArray, targetArray);
    }
  });

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
