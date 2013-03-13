/*
 * assemble-styles
 * http://github.com/assemble/assemble-styles
 *
 * Copyright (c) 2013 Assemble
 * MIT License
 */

module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Project paths and files.
    bootstrap: grunt.file.readJSON('test/bootstrap.json'),

    styles: {
      // Global task options. Options can also be set for each target.
      options: {
        paths:    ['<%= bootstrap.base %>'],
        requires: '<%= bootstrap.less.globals %>'
      },

      // Compile bootstrap.less
      bootstrap: {
        src:  '<%= bootstrap.lib %>',
        dest: 'test/css/bootstrap.css'
      },

      // Compile LESS "bundles" specified in ./test/bootstrap.json
      core: {
        src:  '<%= bootstrap.less.core %>',
        dest: 'test/css/core.css'
      },
      common: {
        src:  '<%= bootstrap.less.common %>',
        dest: 'test/css/common.css'
      },
      nav: {
        src:  '<%= bootstrap.less.nav %>',
        dest: 'test/css/nav.css'
      },
      zindex: {
        src:  '<%= bootstrap.less.zindex %>',
        dest: 'test/css/zindex.css'
      },
      misc: {
        src:  '<%= bootstrap.less.misc %>',
        dest: 'test/css/misc.css'
      },
      utilities: {
        src:  '<%= bootstrap.less.util %>',
        dest: 'test/css/utilities.css'
      },

      // Files object, different way of building 
      // the same thing as above.
      bundles: {
        files: {
          'test/css/bundle/bootstrap.css': ['<%= bootstrap.lib %>'],
          'test/css/bundle/core.css':      ['<%= bootstrap.less.core %>'],
          'test/css/bundle/common.css':    ['<%= bootstrap.less.common %>'],
          'test/css/bundle/nav.css':       ['<%= bootstrap.less.nav %>'],
          'test/css/bundle/zindex.css':    ['<%= bootstrap.less.zindex %>'],
          'test/css/bundle/misc.css':      ['<%= bootstrap.less.misc %>'],
          'test/css/bundle/util.css':      ['<%= bootstrap.less.util %>']
        }
      },

      // Compile all targeted LESS files individually
      individual: {
        options: {concat: false },
        src:  '<%= bootstrap.less.all %>',
        dest: 'test/css/individual'
      },

      // Compile a single LESS file 
      single: {
        options: {concat: false },
        src:  '<%= bootstrap.less.alerts %>',
        dest: 'test/css/single'
      },

      // Compile each LESS file identified with 
      // minimatch pattern individually 
      each: {
        options: {concat: false },
        src:  ['test/less/bootstrap/**/*.less'],
        dest: 'test/css/each'
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/**/*.js'
      ],
      options: { 
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      // Clear out example files before creating new ones.
      tests: { src: 'test/css' }
    },
    watch: {
      project: {
        files: ['test/**/*.{less,json}'],
        tasks: ['styles', 'assemble:styles']
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Default tasks to be run.
  grunt.registerTask('default', [
    'clean:tests',

    // Build style components 
    'styles:bundles',
    'styles:individual',
    'styles:bootstrap'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'styles',
    'jshint'
  ]);
};
