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
    bootstrap: grunt.file.readYAML('test/bootstrap.yml'),

    meta: {
      banner: [
      ]
    },

    less: {
      // options: '.lessrc',
      options: {
        process: true,
        paths:   '<%= bootstrap.less %>',
        imports: {
          less: ['mixins.less', 'variables.less', 'utilities.less'],
          reference: 'bootstrap.less',
          inline: [],
          css: []
        }
      },
      all: {
        src:  '<%= bootstrap.bundle.core %>',
        dest: 'test/css/core.css'
      },
      manifest: {
        options: {
          paths:   'vendor/bootstrap/less'
        },
        src:  '<%= lib.two.options.manifest %>',
        dest: 'test/manifest.css'
      }
    },

    lib: {
      one: {
        options: {
          banner: '/*! LIB TASK <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          variables: grunt.file.readYAML('test/vars.json'),
          overrides: 'src/overrides.less',
          dest: 'test/one/two/manifest-one.less'
        }
      },
      two: {
        options: {
          banner: '/*! LIB TASK <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          variables: grunt.file.readYAML('test/vars.json'),
          overrides: 'src/overrides.less',
          dest: 'test/manifest-two.less'
        }
      },
      three: {
        options: {
          banner: '/*! LIB TASK <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          variables: grunt.file.readYAML('test/vars.json'),
          overrides: 'src/overrides.less',
          dest: 'src/manifest.less'
        }
      }
    },

    variables: {
      bootstrap: {
        options: {
          banner: '/*! VARIABLES TASK <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          variables: {
            background: 'red',
            margin: 0,
            color: 'blue'
          }
        },
        files: {
          'src/bootstrap.less': ['vendor/bootstrap/less/*.less']
        }
      },
      overrides: {
        options: {
          banner: '/*! VARIABLES TASK <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          variables: grunt.file.readYAML('test/vars.json')
        },
        files: {
          'src/overrides.less': ['vendor/bootstrap/less/*.less']
        }
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
  grunt.registerTask('default', ['jshint', 'clean', 'less', 'variables', 'lib']);

  // Tests to be run.
  grunt.registerTask('test', ['default']);
};
