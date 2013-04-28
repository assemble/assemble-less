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

'use strict';

  var path    = require('path');
  var fs      = require('fs');
  var util    = require('util');
  var _       = grunt.util._;
  var less    = false;

  // Internal libs.
  var Utils   = require('./lib/utils').init(grunt);
  var comment = require('./lib/comment').init(grunt);

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
      compress: false,
      dumpLineNumbers: '',
      processImports: true,
      strictMaths: false,
      strictUnits: false
    });
    grunt.verbose.writeln(util.inspect(this.files, 10, null));
    var configOptions = {
      version: 'less', // 'less-ref-test'
      libs: './test/less/bootstrap',
      banner: '',
      stripBanners: false,
      processContent: false,
      processContentExclude: [],
      globals: [],
      imports: '',
      concat: true
    };
    options = configOptions ? options : mergeOptionsArrays(this.target, configOptions);

    Utils.logBlock("options: ", util.inspect(options));
    Utils.logBlock("this.files: ", util.inspect(this.files));

    // try to get a src to use for configuration
    var src;
    this.files.forEach(function(fp) {
      src = fp.src;
    });

    if(!src || src.length === 0) {
      grunt.warn('No source files found.');
      return false;
    }



    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };



    // Load less version specified in options, else load default
    try {
      less = require(options.version);
    } catch (err) {
      var lessPath = path.join(process.cwd(), options.version);
      less = require(lessPath);
      grunt.log.success('\nRunning Less.js v', path.basename(options.version) + '\n');
    }

    // Normalize boolean options that accept options objects.
    if (options.stripBanners === true) { options.stripBanners = {}; }
    if (options.process === true) { options.process = {}; }


    // Process banner
    var banner  = grunt.template.process(options.banner);


    // Process imports and any templates.
    if (Array.isArray(options.imports) === false) {
      var imports = grunt.template.process(options.imports);
    } else if (Array.isArray(options.imports) === true) {
      var imports = grunt.template.process(options.imports.join(''));
    }

    // Iterate over all src-dest file pairs.
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
        // Process files as templates if requested.
        // if (typeof options.process === 'function') {
        //   var files = options.process(f.src.filter(filepath));
        // } else if (options.process) {
        //   var srcFiles = grunt.template.process(f.src.filter(filepath), options.process);
        // }
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
        grunt.log.writeln('Gathering less files: ' + file.magenta);
        grunt.util.async.concatSeries(options.globals, function(file, next) {
          if(grunt.util._.contains(dependencies, file) === false) {
            srcCode.push(grunt.file.read(file));
            dependencies.push(file);
          }
          next(null);
        }, function() {});
        srcCode.push(grunt.file.read(file));
        grunt.log.writeln('Reading: ' + file.magenta);
        next(null);
      };
      

      // Render multiple concatenated LESS files.
      var concatRender = function() {
        var lessCode = imports + srcCode.join(grunt.util.normalizelf(grunt.util.linefeed));
        grunt.verbose.writeln(util.inspect(files, 10, null));
        grunt.log.writeln('Compiling less files...'.grey);
        compileLess(destFile, lessCode, options, function(css, err) {
          grunt.log.writeln('Compiling: ' + destFile.grey);
          if (lessCode.length < 1) {
            grunt.log.warn(('Destination not written because compiled LESS file, '.red + (path.basename(destFile)).grey + ', was empty.'.red));
          }
          if(!err) {
            // If a banner is specified, add it.
            if ( options.banner ) {
              css = options.banner + '\n' + css;
            }
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
        singleSrcCode = imports + singleSrcCode.join(grunt.util.normalizelf(grunt.util.linefeed));
        compileLess(file, singleSrcCode, options, function(css, err) {
          if(!err) {
            // If a banner is specified, add it.
            if ( options.banner ) {
              css = options.banner + '\n' + css;
            }
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

  // Strip banners if requested.
  var strippedFiles = function(file) {
    comment.stripBanner(file, options.stripBanners);
  };

  var compileLess = function(filename, srcCode, options, callback) {
    options = grunt.util._.extend({filename: filename}, options);

    options.paths = options.paths || [path.dirname(filename)];

    var css;

    // LESS Parser (parseCopyProperties)
    var parser = new less.Parser(grunt.util._.pick(options, lessOptions.parse));
    grunt.verbose.writeln('before parse');
     grunt.verbose.writeln(util.inspect(parser, 10, null));
     parser.parse(srcCode, function(parse_err, tree) {
      if (parse_err) {
        Utils.lessError(parse_err);
        callback('',true);
      }

      try {
        grunt.verbose.writeln('parsed...');
        // LESS (evalCopyProperties)
        css = tree.toCSS(grunt.util._.pick(options, lessOptions.render));
        callback(css, null);
      } catch (e) {
        Utils.lessError(e);
        callback(css, true);
        grunt.verbose.writeln('rendered...');
      }
    });
  };
};