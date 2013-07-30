/*
 * grunt-contrib-internal
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Add custom template delimiters.
  grunt.template.addDelimiters('assemble-docs', '{%', '%}');

  grunt.registerTask('assemble-docs', 'Generate contrib plugin files.', function() {
    var path = require('path');
    var asset = path.join.bind(null, __dirname, 'assets');

    var meta = grunt.file.readJSON('package.json');
    meta.changelog = grunt.file.readYAML('CHANGELOG');

    meta.travis = grunt.file.exists('.travis.yml');
    if (meta.travis) {
      meta.travis = meta.repository.url.replace(/.*:\/\/github.com\/(.*)\.git/, 'https://travis-ci.org/$1');
    }

    var authors = grunt.file.read('AUTHORS');
    meta.authors = authors.split('\n').map(function(author) {
      var matches = author.match(/(.*?)\s*\((.*)\)/) || [];
      return {name: matches[1], url: matches[2]};
    });

    // Used to display the "in development" warning message @ the top.
    meta.in_development = (meta.keywords || []).indexOf('gruntplugin') === -1 || '';

    // Read plugin/task docs.
    meta.docs = {plugin: {}, task: {}};
    grunt.file.expand('docs/*.md').forEach(function(filepath) {
      // Parse out the task name and section name.
      var basename = path.basename(filepath, '.md');
      var parts = basename.split('-');
      var section = parts.pop();
      var taskname = parts.join('-');

      var namespace = taskname ? meta.docs.task : meta.docs.plugin;
      if (taskname) {
        if (!namespace[taskname]) { namespace[taskname] = {}; }
        namespace = namespace[taskname];
      }

      // Read doc file.
      var doc = grunt.file.read(filepath);
      // Adjust header level to be semantically correct for the readme.
      doc = doc.replace(/^#/gm, '###');
      // Process as template.
      doc = grunt.template.process(doc, {data: meta, delimiters: 'assemble-docs'});
      namespace[section] = doc;
    });

    // Generate readme.
    var tmpl = grunt.file.read(asset('README.tmpl.md'));
    var newReadme = grunt.template.process(tmpl, {data: meta, delimiters: 'assemble-docs'});

    // Only write readme if it actually changed.
    var oldReadme = grunt.file.exists('README.md') ? grunt.file.read('README.md') : '';
    var re = /(\*This file was generated on.*)/;
    if (oldReadme.replace(re, '') !== newReadme.replace(re, '')) {
      grunt.file.write('README.md', newReadme);
      grunt.log.ok('Created README.md');
    } else {
      grunt.log.ok('Keeping README.md.');
    }

    // Copy contributing guide from grunt.
    grunt.file.copy('node_modules/assemble-internal/CONTRIBUTING.md', 'CONTRIBUTING.md');
    grunt.log.ok('Created CONTRIBUTING.md');

    // Fail task if any errors were logged.
    if (this.errorCount > 0) { return false; }
  });

};
