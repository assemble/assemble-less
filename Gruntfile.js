/*
 * assemble-less
 * http://github.com/assemble/assemble-less
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
    bootstrap: grunt.file.readYAML('test/bootstrap.yml'),


    less: {
      // Global task options. Options can also be set for each target.
      options: {
        // lessrc: '.lessrc'

        paths: ['<%= bootstrap.base %>'],
        globals: '<%= bootstrap.globals %>',
        bootstrap: './test/less/bootstrap',
        concat: true,
        compress: false,    
        optimization: 1,
        yuicompress: false,  
        dumpLineNumbers: false,
        processImports: false,
        strictImports: true,
        strictMaths: true,
        strictUnits: true 
      },

      // Compile LESS "bundles" specified in ./test/bootstrap.yml
      all: {
        src:  '<%= bootstrap.bundle.all %>',
        dest: 'test/css/bootstrap.css'
      },
      core: {
        src:  '<%= bootstrap.bundle.core %>',
        dest: 'test/css/core.css'
      },
      common: {
        src:  '<%= bootstrap.bundle.common %>',
        dest: 'test/css/common.css'
      },
      nav: {
        src:  '<%= bootstrap.bundle.nav %>',
        dest: 'test/css/nav.css'
      },
      zindex: {
        src:  '<%= bootstrap.bundle.zindex %>',
        dest: 'test/css/zindex.css'
      },
      misc: {
        src:  '<%= bootstrap.bundle.misc %>',
        dest: 'test/css/misc.css'
      },
      utilities: {
        src:  '<%= bootstrap.bundle.util %>',
        dest: 'test/css/utilities.css'
      },

      // Files object, a more compact way of building the same thing as above.
      bundles: {
        files: {
          'test/css/bundle/bootstrap.css': ['<%= bootstrap.lib.less %>'],
          'test/css/bundle/core.css':      ['<%= bootstrap.bundle.core %>'],
          'test/css/bundle/common.css':    ['<%= bootstrap.bundle.common %>'],
          'test/css/bundle/nav.css':       ['<%= bootstrap.bundle.nav %>'],
          'test/css/bundle/zindex.css':    ['<%= bootstrap.bundle.zindex %>'],
          'test/css/bundle/misc.css':      ['<%= bootstrap.bundle.misc %>']
        }
      },

      // Compile all targeted LESS files individually
      individual: {
        options: {concat: false },
        src:  '<%= bootstrap.bundle.all %>',
        dest: 'test/css/individual'
      },

      // Compile one LESS file, in this example "alerts.less"
      one: {
        src:  '<%= bootstrap.component.alerts %>',
        dest: 'test/css/single/alerts.css'
      },

      // Use minimatch pattern to build a list of LESS files,
      // then compile each file individually.
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
        tasks: ['less', 'assemble:less']
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

    // Examples for building less components
    'less:core',
    'less:common',
    'less:bundles',
    'less:individual',
    'less:one',
    'less:each'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'less',
    'jshint'
  ]);
};
