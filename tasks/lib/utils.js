/*
 * general utils
 * https://github.com/sellside/utils
 * Copyright (c) 2014 Sellside
 */

'use strict';

// Node.js
var path  = require('path');
var fs    = require('fs');

// node_modules
var grunt = require('grunt');
var _     = require('lodash');



exports.relativePath = function(from, to) {
  var basename = path.basename(to);
  var relative = path.relative(path.dirname(from), path.dirname(to));
  return path.join(relative, basename).replace(/\\/g, '/');
};

exports.normalizePath = function(filepath) {
  return filepath.replace(/\\/g, '/');
};


exports.isEmptyFile = function(src) {
  src = fs.readFileSync(src, 'utf8');
  return (src.length === 0 || src === '') ? true : false;
};

/**
 * Data file reader factory
 * Automatically determines the reader based on extension.
 * Use instead of grunt.file.readJSON or grunt.file.readYAML
 */

exports.readData = function(filepath) {
  var ext = path.extname(filepath);
  var reader = grunt.file.readJSON;
  switch(ext) {
    case '.json':
      grunt.verbose.writeln('>> Reading JSON'.yellow);
      reader = grunt.file.readJSON;
      break;
    case '.yml':
    case '.yaml':
      grunt.verbose.writeln('>> Reading YAML'.yellow);
      reader = grunt.file.readYAML;
      break;
  }
  return reader(filepath);
};

/**
 * @param  {String} filepath The filepath to read or string pattern to expand then read
 * @param  {Object} opts     Object of options. 'namespace' will use the basename of
 *                           the source file as the name of the returned object
 * @return {Object}          Object of metadata
 */

exports.readDataFiles = function (filepath, opts) {
  var obj = {};
  grunt.file.expand(filepath).map(function (file) {
    var name = path.basename(file, path.extname(file));
    if (exports.isEmptyFile(file)) {
      grunt.verbose.warn('Skipping empty path:'.yellow, file);
    } else {
      if(opts.namespace === true) {
        obj[name] = exports.readData(file);
      } else {
        obj = exports.readData(file);
      }
    }
  });
  return obj;
};

/**
 * Reads in data from a string, object or array
 * @param  {String|Object|Array} optsData Supply a string, object or array
 * @param  {Object} opts                  Pass an object of options
 * @return {Object}                       Returns an object of metadata
 */

exports.readOptionsData = function (optsData, opts) {
  var metadata = {};
  if (_.isString(optsData) || _.isArray(optsData)) {
    optsData = _.flatten(Array.isArray(optsData) ? optsData : [optsData]);
    optsData.map(function (meta) {
      if (_.isString(meta)) {
        return _.merge(metadata, exports.readDataFiles(meta, opts));
      } else if (_.isObject(meta)) {
        return _.extend(metadata, meta);
      }
    });
  } else {
    metadata = _.extend(metadata, optsData);
  }
  return metadata;
};
