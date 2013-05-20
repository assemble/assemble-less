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

    // Metadata for templates
    pkg: grunt.file.readJSON('package.json'),
    bootstrap: grunt.file.readYAML('test/less/bootstrap.yml'),


    less: {
      options: {
        process: true,
        paths:   '<%= bootstrap.less %>',
        imports: {
          less: ['mixins', 'variables', 'utilities'],
          reference: 'bootstrap',
          css: []
        }
      },
      all: {
        src:  '<%= bootstrap.bundle.all %>',
        dest: 'test/css/bootstrap.css'
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

    variables: {
      bootstrap: {
        options: {
          background: 'red',
          margin: 0
        },
        files: {
          'test/bootstrap.less': ['test/less/bootstrap/bootstrap.less']
        }
      }
    },
    // Clean out files from last run,
    // before creating new ones.
    clean: {
      tests: { src: 'test/css/**/*.css' }
    },
    watch: {
      project: {
        files: ['test/**/*.{less,yml,json}'],
        tasks: ['default']
      }
    }
  });

  grunt.config.set('bootstrap.base', 'test/less/bootstrap');

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Default tasks to be run.
  grunt.registerTask('default', [
    'clean',
    'less'
  ]);

  // Experimental stylesheets.
  grunt.registerTask('exp', ['less:experimental']);

  // All assemble-less targets for testing.
  grunt.registerTask('all', ['clean', 'less']);

  // Tests to be run.
  grunt.registerTask('test', ['all']);
};
