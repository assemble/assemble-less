/*
 * assemble-less
 * https://github.com/assemble/assemble-less
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Project paths and files.
    bootstrap: grunt.file.readYAML('test/less/bootstrap.yml'),

    // Metadata for testing templates in @import statements
    path: {
      theme: 'test/less/summer'
    },

    // Metadata for testing versions.
    lessVersion: {
      stable: './test/versions/1.3.3',
      beta:   './test/versions/1.4.0-b1',
      latest: './test/versions/1.4.0-b2'
    },


    meta: {
      // banner:'/*\n' +
      //         ' * <%= pkg.title || pkg.name %>\n' +
      //         ' * Version:    <%= pkg.version %>\n' +
      //         ' * Build Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      //         ' * Author:     <%= pkg.author.name %>\n' +
      //         ' * Website:    <%= pkg.homepage %>\n' +
      //         ' *\n' +
      //         ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
      //         ' * Licensed under the <%= _.pluck(pkg.licenses, "type") %> license.\n' +
      //         ' */\n',

      // banner2: [
      //   '/*',
      //   ' * <%= pkg.name %> v<%= pkg.version %>',
      //   ' * (c) 2013 <%= pkg.author.name %> <<%= pkg.author.url %>>',
      //   ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>',
      //   ' * Licensed under the <%= _.pluck(pkg.licenses, "type") %> license.',
      //   ' */',
      // ].join('\n'),

      // // Array
      // imports: [
      //  '@import "summer/theme.less";', 
      //  '@import "winter/theme.less";'
      // ]
    },
    banner_property: 'AWESOME',
    less: {
      // Global task options.
      options: {
        process: true,
        processImports: true,
        stripBanners: true,
        version: '<%= lessVersion.latest %>',
        banner: '/* THIS TEST IS <%= banner_property %> */\n',
        imports: '@import "<%= path.theme %>/theme.less";',
        globals: '<%= bootstrap.globals %>',
        paths: ['./test/less', './test/less/winter', './test/less/bootstrap'],
        libs: 'test/less/bootstrap'
        // paths: '<%= bootstrap.less %>'
      },

      // Compile LESS "bundles" specified in ./test/bootstrap.yml
      // all: {
      //   src:  '<%= bootstrap.bundle.all %>',
      //   dest: 'test/css/bootstrap.css'
      // },
      // core: {
      //   options: {
      //     version: '<%= lessVersion.stable %>',
      //   },
      //   src:  '<%= bootstrap.bundle.core %>',
      //   dest: 'test/css/core.css'
      // },
      // common: {
      //   options: {
      //     version: '<%= lessVersion.beta %>',
      //   },
      //   src:  '<%= bootstrap.bundle.common %>',
      //   dest: 'test/css/common.css'
      // },
      nav: {
        // options: {
        //   version: '<%= lessVersion.latest %>',
        // },
        src:  '<%= bootstrap.bundle.nav %>',
        dest: 'test/css/nav.css'
      },

      // Files object, a more compact way than above for building src-dest pairs.
      // bundles: {
      //   files: {
      //     'test/css/bundle/bootstrap.css': ['<%= bootstrap.lib.less %>'],
      //     'test/css/bundle/core.css':      ['<%= bootstrap.bundle.core %>'],
      //     'test/css/bundle/common.css':    ['<%= bootstrap.bundle.common %>'],
      //     'test/css/bundle/nav.css':       ['<%= bootstrap.bundle.nav %>'],
      //     'test/css/bundle/zindex.css':    ['<%= bootstrap.bundle.zindex %>'],
      //     'test/css/bundle/misc.css':      ['<%= bootstrap.bundle.misc %>']
      //   }
      // },

      // Compile all targeted LESS files individually
      individual: {
        options: {concat: false},
        src:  '<%= bootstrap.bundle.all %>',
        dest: 'test/css/individual/'
      },

      // Compile one LESS file, in this example "alerts.less"
      // one: {
      //   src:  '<%= bootstrap.component.alerts %>',
      //   dest: 'test/css/single/alerts.css'
      // },

      // Use minimatch pattern to dynamically build a list of
      // LESS files, then compile each file individually.
      each: {
        options: {
          banner: '/* Test */',
          paths: ['./test/less', './test/less/winter', './test/less/bootstrap'],
          concat: false
        },
        src:  ['<%= bootstrap.base %>/*.less'],
        dest: 'test/css/each/'
      },

      tests: {
        options: {
          // banner: '<%= meta.banner %>',
          // imports: '<%= meta.imports %>',
          libs: 'test/less/bootstrap', 
          globals: ''
        },
        src:  'test/less/main2.less',
        dest: 'test/css/main.css'
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

 
  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Default tasks to be run.
  grunt.registerTask('default', [
    'clean',
    // 'swap-banner',
    'less:nav',
    'less:each',
    'less:tests'
  ]);

  // All assemble-less targets.
  // grunt.registerTask('all', [
  //   'clean',
  //   'less'
  // ]);

  // // Tests to be run.
  // grunt.registerTask('test', [
  //   'all',
  //   'jshint'
  // ]);
};
