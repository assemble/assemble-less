/*
 * assemble-less
 * http://github.com/assemble
 * Copyright (c) 2013 Assemble
 * MIT License
 */

module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({

    less: {
      options: {
        paths:   'vendor/bootstrap/less',
        imports: {
          less: ['mixins.less', 'variables.less']
        }
      },
      bootstrap: {
        src:  'vendor/bootstrap/less/bootstrap.less',
        dest: 'test/css/bootstrap.css'
      },
      component: {
        src:  'vendor/bootstrap/less/alerts.less',
        dest: 'test/css/alerts.css'        
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/**/*.js'
      ]
    },

    // Clean out files from last run,
    // before creating new ones.
    clean: {
      tests: { src: 'test/css/**/*.css' }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Default tasks to be run.
  grunt.registerTask('default', ['jshint', 'clean', 'less']);

  // Tests to be run.
  grunt.registerTask('test', ['default']);
};
