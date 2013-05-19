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
        globals: '<%= bootstrap.globals %>', // Here, we use options.imports instead 
        imports: [
          'variables.less', 
          '/* @import "mixins.less"; */',
          '/* @import "utilities.less"; */'
        ]
      },

      // Bootstrap libs, defined via ./test/bootstrap.yml
      all: {
        options: {
          imports: '/* @import "variables.less"; @import "mixins.less"; @import "utilities.less"; */'
        },
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

      // Compile LESS files with specified version of Less.js
      version_example: {
        options: {
          version: './vendor/less-1.3.3'
        },
        src:  '<%= bootstrap.bundle.core %>',
        dest: 'test/css/core.css'
      },

      // Files object, a more compact way than 
      // above for building src-dest pairs.
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

      // Compile one LESS file, in this example "alerts.less"
      one: {
        src:  '<%= bootstrap.component.alerts %>',
        dest: 'test/css/single/alerts.css'
      },

      // Compile all targeted LESS files individually
      individual: {
        options: {concat: false},
        src:  '<%= bootstrap.bundle.all %>',
        dest: 'test/css/individual'
      },

      // Use minimatch pattern to dynamically build a list of
      // LESS files, then compile each file individually.
      each: {
        options: {concat: false},
        src:  ['<%= bootstrap.base %>/*.less'],
        dest: 'test/css/each'
      },

      // Experimental styles
      experimental: {
        src:  '<%= bootstrap.base %>/experiments.less',
        dest: 'test/css/experimental.css'        
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
    'less:core',
    'less:common',
    'less:nav'
  ]);

  // Experimental stylesheets.
  grunt.registerTask('exp', ['less:experimental']);

  // All assemble-less targets for testing.
  grunt.registerTask('all', ['clean', 'less']);

  // Tests to be run.
  grunt.registerTask('test', ['all', 'jshint']);
};

