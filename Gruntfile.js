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
    bootstrap: grunt.file.readYAML('test/less/bootstrap.yml'),
 
    less: {
      // Global task options.
      options: {
        libs: 'test/less/bootstrap', 
        paths: '<%= bootstrap.less %>',    
        globals: '<%= bootstrap.globals %>'
      },

      // Compile LESS "bundles" specified in ./test/bootstrap.yml
      main: {
        options: {
          paths: ['test/less', 'test/less/winter']
        },
        src:  'test/less/main2.less',
        dest: 'test/css/main.css'
      },

      // Compile LESS "bundles" specified in ./test/bootstrap.yml
      all: {
        src:  '<%= bootstrap.bundle.all %>',
        dest: 'test/css/bootstrap.css'
      },
      core: {
        options: {
          version: './test/versions/1.3.3',
        },
        src:  '<%= bootstrap.bundle.core %>',
        dest: 'test/css/core.css'
      },
      common: {
        options: {
          version: './test/versions/1.4.0-b1',
        },
        src:  '<%= bootstrap.bundle.common %>',
        dest: 'test/css/common.css'
      },
      nav: {
        options: {
          version: './test/versions/1.4.0-b2',
        },
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

      // Files object, a more compact way than above for building src-dest pairs.
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
        options: {concat: false},
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
        options: {concat: false},
        src:  ['<%= bootstrap.base %>/*.less'],
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
    'less:nav',
    'less:zindex',
    'less:bundles',
    'less:individual',
    'less:one'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'less',
    'jshint'
  ]);
};
