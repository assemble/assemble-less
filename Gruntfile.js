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
    bootstrap: grunt.file.readJSON('examples/bootstrap.json'),

    styles: {
      // Global task options. Options can also be set for each target.
      options: {
        paths:    ['<%= bootstrap.base %>'],
        requires: '<%= bootstrap.less.globals %>'
      },

      // Compile bootstrap.less
      bootstrap: {
        src:  '<%= bootstrap.lib %>',
        dest: 'examples/css/bootstrap.css'
      },

      // Compile LESS "bundles" specified in ./examples/bootstrap.json
      core: {
        src:  '<%= bootstrap.less.core %>',
        dest: 'examples/css/core.css'
      },
      common: {
        src:  '<%= bootstrap.less.common %>',
        dest: 'examples/css/common.css'
      },
      nav: {
        src:  '<%= bootstrap.less.nav %>',
        dest: 'examples/css/nav.css'
      },
      zindex: {
        src:  '<%= bootstrap.less.zindex %>',
        dest: 'examples/css/zindex.css'
      },
      misc: {
        src:  '<%= bootstrap.less.misc %>',
        dest: 'examples/css/misc.css'
      },
      utilities: {
        src:  '<%= bootstrap.less.util %>',
        dest: 'examples/css/utilities.css'
      },

      // Files object, different way of building 
      // the same thing as above.
      bundles: {
        files: {
          'examples/css/bundle/bootstrap.css': ['<%= bootstrap.lib %>'],
          'examples/css/bundle/core.css':      ['<%= bootstrap.less.core %>'],
          'examples/css/bundle/common.css':    ['<%= bootstrap.less.common %>'],
          'examples/css/bundle/nav.css':       ['<%= bootstrap.less.nav %>'],
          'examples/css/bundle/zindex.css':    ['<%= bootstrap.less.zindex %>'],
          'examples/css/bundle/misc.css':      ['<%= bootstrap.less.misc %>'],
          'examples/css/bundle/util.css':      ['<%= bootstrap.less.util %>']
        }
      },

      // Compile all targeted LESS files individually
      individual: {
        options: {concat: false },
        src:  '<%= bootstrap.less.all %>',
        dest: 'examples/css/individual'
      },

      // Compile a single LESS file 
      single: {
        options: {concat: false },
        src:  '<%= bootstrap.less.alerts %>',
        dest: 'examples/css/single'
      },

      // Compile each LESS file identified with 
      // minimatch pattern individually 
      each: {
        options: {concat: false },
        src:  ['examples/less/bootstrap/**/*.less'],
        dest: 'examples/css/each'
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
      examples: { src: 'examples/css' }
    },
    watch: {
      project: {
        files: ['examples/**/*.{less,json}'],
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
    'clean:examples',
    // 
    'styles:individual',
    'styles:bootstrap'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'jshint',
    'styles'
  ]);
};
