'use strict';

module.exports = function(grunt) {

  var fs   = require('fs');
  var path = require('path');
  var _    = require('lodash');

  grunt.registerMultiTask('lib', 'Builds less library file by substituting paths to locally overridden files', function() {

    // Lib options
    var options = this.options({});

    grunt.verbose.writeflags(options, 'Lib options');
    
    // Lib defaults
    var defaults = {
      banner: '/* Assembled by assemble-less */\n',
      overrides: '',
      variables: {},
      locallib: 'src/bootstrap',
      dest: '',
      vendor: 'vendor',
      vendorlib: 'bootstrap/less',
      json: 'test/manifest.json'
    };
    // Default options per target
    options = grunt.util._.defaults(options || {}, defaults);

    // Process banner.
    var banner = grunt.template.process(options.banner);
    var output;
    if(options.banner){
      output = options.banner +  '\n';
    } else {
      output = '';
    }

    // Variables
    var customVariables;
    if(options.variables) {
      var lessVar;
      for (lessVar in options.variables) {
        var value = options.variables[lessVar];
        output += '@' + lessVar + ': ' + value + ';\n';
        grunt.verbose.write('>> '.green + ('@' + lessVar).cyan + ': ' + value + ';\n');
      }
      customVariables = output += '\n';
    }

    var manifestDestFile = path.resolve(options.dest);
    var overridesFile    = path.resolve(options.overrides);
    var overrides        = getRelativePath(manifestDestFile, overridesFile);

    var libBase = unixifyPath(path.join(options.vendor + '/' + options.vendorlib));
    var srcPath = unixifyPath(path.relative(path.resolve(path.dirname(options.dest)), path.resolve(libBase)));

    var parseManifest = function(filename) {
      var manifestFile = grunt.file.read(filename);
      var importRegex = /@import "([\w\.-]+)";/;
      var start = 0;
      var match;
      var manifest = [];
      while (match = importRegex.exec(manifestFile.substring(start))) {
        manifest.push(match[1]);
        start += match['index'] + 1;
      }
      return manifest;
    };

    var createManifest = function(manifest, overrides) {
      var less = '';
      _(manifest).each(function(filename) {

        // Get the path to the "override" files
        var localOverrides =  path.join(options.locallib + '/' + filename);
        var pathToLocalLib = unixifyPath(
          path.relative(path.resolve(
            path.dirname(options.dest)), path.resolve(localOverrides)
          )
        );

        less += '@import "';
        if (_(overrides).contains(filename)) {
          less += pathToLocalLib;
        } else if (path.basename(filename) === path.basename(options.overrides)) { 
          less += filename;
        } else {
          less += srcPath + '/' + filename;
        }
        less += '";\n';
      });
      return less;
    };

    // Remove trailing slashes
    var slashRegex = /\/$/;
    _(options).each(function(option) {
      // Make sure option has a replace method
      if (option.replace) {
        option = option.replace(slashRegex, '');
      }
    });

    var lessFiles = [
        "core",
        "accordion",
        "autocomplete",
        "button",
        "datepicker",
        "dialog",
        "menu",
        "progressbar",
        "resizable",
        "selectable",
        "slider",
        "spinner",
        "tabs",
        "tooltip",
        "theme"
    ].map(function(component) {
      return "themes/base/jquery.ui." + component + ".css";
    });

    var baseLibFile = libBase + '/bootstrap.less';
    var lessArray = parseManifest(baseLibFile);

    var jsonManifest = JSON.stringify(lessArray, null, 2);
    if(options.json) {
      grunt.verbose.writeln('JSON Manifest: (' + options.json + ')\n' + jsonManifest.grey + '\n');
      grunt.file.write(options.json, jsonManifest); 
    }

    var variables = lessArray.pop();
    var utilities = lessArray.pop();
    var responsive = lessArray.pop();

    // Insert the overrides less file before utilities.less, 
    // and responsive.less, which must always come last
    if (options.overrides !== '') {
      lessArray.push(overrides);
    }
    lessArray.push(utilities);
    lessArray.push(responsive);

    // Determine which files have been overridden
    var localLibDir = grunt.file.expand({
      cwd: options.locallib
    }, '*');

    // Turn the manifest back into a string
    var outputLessLib = createManifest(lessArray, localLibDir);

    // Write the new manifest to its new location
    grunt.log.ok(outputLessLib);
    grunt.log.writeln();
    grunt.log.notverbose.ok('File "' + options.dest.magenta + '"' + ' created.');
    grunt.log.notverbose.ok('File "' + options.json.cyan + '"' + ' created.');
    grunt.file.write(options.dest, customVariables + outputLessLib);
  });

  var getRelativePath = function(from, to) {
    var fromDirname, relativePath, toBasename, toDirname;
    fromDirname = path.normalize(path.dirname(from));
    toDirname = path.normalize(path.dirname(to));
    toBasename = path.basename(to);
    relativePath = path.relative(fromDirname, toDirname);
    return unixifyPath(path.join(relativePath, toBasename));
  };

  // Windows? (from grunt.file)
  var win32 = process.platform === 'win32';
  // Normalize \\ paths to / paths.
  var unixifyPath = function(filepath) {
    if (win32) {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };

};