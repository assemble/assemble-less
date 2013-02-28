/*
 * assemble-themes
 * http://assemble.github.com/assemble-themes
 *
 * Copyright (c) 2013 Assemble
 *
 */

module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Project paths and files.
    build    : grunt.file.readJSON('config/.build'),
    ignore   : grunt.file.readJSON('config/.buildignore'),
    bootstrap: grunt.file.readJSON('src/themes/bootstrap.json'),

    themes: {
      options: {
        paths: ['<%= bootstrap.less.base %>'],
        requires: [
          '<%= bootstrap.variables %>',
          '<%= bootstrap.mixins %>'
        ]
      },
      core: {
        src:  '<%= bootstrap.less.core %>',
        dest: 'src/assets/css/core.css'
      },
      common: {
        src:  '<%= bootstrap.less.common %>',
        dest: 'src/assets/css/common.css'
      },
      nav: {
        src:  '<%= bootstrap.less.nav %>',
        dest: 'src/assets/css/nav.css'
      },
      zindex: {
        src:  '<%= bootstrap.less.zindex %>',
        dest: 'src/assets/css/zindex.css'
      },
      misc: {
        src:  '<%= bootstrap.less.misc %>',
        dest: 'src/assets/css/misc.css'
      },
      utilities: {
        src:  '<%= bootstrap.less.util %>',
        dest: 'src/assets/css/utilities.css'
      },
      // Compile LESS files individually
      individual: {
        options: { concat: false },
        src:  '<%= bootstrap.less.all %>',
        dest: 'src/assets/css/individual'
      }
      // catchall: {
      //   options: { concat: false },
      //   src:  '<%= bootstrap.less.base %>/*.less',
      //   dest: 'src/assets/css/individual'
      // }
    },

    // Build files from templates.
    assemble: {
      styles: {
        options: {
          engine: "handlebars",
          layout: 'src/themes/layout.tmpl',
          assets: 'src/theme/assets',
          data:   'src/themes/stark/theme.json',
          ext:    '.less'
        },
        src: ['src/themes/stark/variables.tmpl'],
        dest: 'src/themes/stark'
      }
    },

    clean: {
      test: {
        src: [ 'src/assets/css' ]
      }
    },

    watch: {
      project: {
        files: [ 'src/**/*.{hbs,less,tmpl,json,yaml,yml,mustache}' ],
        tasks: ['themes', 'assemble:styles']
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Load local tasks.
  grunt.loadTasks('config/tasks');

  // Default task.
  grunt.registerTask('default', [
    'clean:test',
    'themes',
    'assemble'
  ]);

};
