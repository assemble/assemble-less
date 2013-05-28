
exports.init = function(grunt) {
  var util = require('util');
  var fs   = require('fs');
  var _    = grunt.util._;


  var exports = {};

  
  /* function pulled from assemble */
  /* https://github.com/assemble/assemble */
  exports.mergeOptionsArrays = function(target, name) {
    var globalArray = grunt.config(['manifest', 'options', name]) || [];
    var targetArray = grunt.config(['manifest', target, 'options', name]) || [];
    return _.union(globalArray, targetArray);
  };

  exports.varDump = function(obj) {
    grunt.log.writeln(util.inspect(obj));
  };

  exports.logBlock = function(heading, message) {
    grunt.verbose.writeln(heading.cyan);
    grunt.verbose.writeln(message);
    grunt.verbose.writeln();
  };


  var formatLessError = function(e) {
    var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
    return e.filename + ': ' + pos + ' ' + e.message;
  };

  exports.lessError = function(e) {
    var message = less.formatError ? less.formatError(e) : formatLessError(e);

    grunt.log.error(message);
    grunt.fail.warn('Error compiling LESS.');
  };

  var detectDestType = function(dest) {
    if(_.endsWith(dest, path.sep)) {
      return "directory";
    } else {
      return "file";
    }
  };

  var logBlock = function(heading, message) {
    grunt.verbose.writeln(heading.cyan);
    grunt.verbose.writeln(message);
    grunt.verbose.writeln();
  };

  var getEngineOf = function(fileName) {
    var ext = extension(fileName);
    return  _( _(extensions).keys() ).include(ext) ? extensions[ext] : false;
  };

  var extension = function(fileName) {
    grunt.verbose.writeln('extension');
    grunt.verbose.writeln(fileName);
    if(kindOf(fileName) === "array" && fileName.length > 0) {
      fileName = fileName[0];
    }
    return _(fileName.match(/[^.]*$/)).last();
  };

  var urlNormalize = function(urlString) {
    return urlString.replace(/\\/g, '/');
  };

  return exports;
};
