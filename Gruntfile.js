/*
 * Based on grunt-contrib-less
 * http://gruntjs.com/
 * Copyright (c) 2013 Tyler Kellen, contributors
 *
 * assemble-less
 * http://github.com/assemble/assemble-less
 * Copyright (c) 2013 Jon Schlinkert, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {jshintrc: '.jshintrc'},
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ]
    },

    // Metadata
    meta: {
      license: '<%= _.pluck(pkg.licenses, "type").join(", ") %>',
      copyright: 'Copyright (c) <%= grunt.template.today("yyyy") %>',
      banner:
        '/* \n' +
        ' * <%= pkg.name %> v<%= pkg.version %> \n' +
        ' * http://assemble.io \n' +
        ' * \n' +
        ' * <%= meta.copyright %>, <%= pkg.author.name %> \n' +
        ' * Licensed under the <%= meta.license %> License. \n' +
        ' * \n' +
        ' */ \n\n'
    },

    // Configuration to be run (and then tested).
    less: {
      options: {
        metadata: ['test/fixtures/data/*.{yml,json}', 'package.json']
      },
      bootstrap: {
        src: 'test/fixtures/bootstrap/bootstrap.less',
        dest: 'test/actual/css/bootstrap.css'
      },
      alerts: {
        options: {
          lessrc: '.lessrc'
        },
        src: 'test/fixtures/bootstrap/alerts.less',
        dest: 'test/actual/css/alerts.css'
      },
      components: {
        options: {
          lessrc: '.lessrc.yml'
        },
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/bootstrap',
            src: ['*.less', '!{bootstrap,variables,mixins}.less'],
            dest: 'test/actual/css/components/',
            ext: '.css'
          }
        ]
      },
      lodash: {
        options: {
          merge: true,
          metadata: []
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: ['templates-*.less'], dest: 'test/actual/', ext: '.css'}
        ]
      },
      nomerge: {
        options: {
          metadata: []
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: ['templates-*.less'], dest: 'test/actual/', ext: '.css'}
        ]
      },
      banner: {
        options: {
          stripBanners: true,
          banner: '<%= meta.banner %>'
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures/banners', src: ['*.less'], dest: 'test/actual/banners/', ext: '.css'}
        ]
      },
      stripbanners: {
        options: {stripBanners: true},
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures/banners', src: ['*.less'], dest: 'test/actual/stripbanners/', ext: '.css'}
        ]
      },
      compile: {
        options: {
          paths: ['test/fixtures/include']
        },
        files: {
          'test/actual/less.css':   ['test/fixtures/style.less'],
          'test/actual/concat.css': ['test/fixtures/style.less', 'test/fixtures/style2.less', 'test/fixtures/style3.less']
        }
      },
      compress: {
        options: {
          paths: ['test/fixtures/include'],
          compress: true
        },
        files: {
          'test/actual/compress.css': ['test/fixtures/style.less']
        }
      },
      nopaths: {
        files: {
          'test/actual/nopaths.css': ['test/fixtures/nopaths.less']
        }
      },
      ieCompatTrue: {
        options: {
          paths: ['test/fixtures/include'],
          ieCompat: true
        },
        files: {
          'test/actual/ieCompatTrue.css': ['test/fixtures/ieCompat.less']
        }
      },
      ieCompatFalse: {
        options: {
          paths: ['test/fixtures/include'],
          ieCompat: false
        },
        files: {
          'test/actual/ieCompatFalse.css': ['test/fixtures/ieCompat.less']
        }
      },
      nofiles: {},
      nomatchedfiles: {
        files: {
          "test/actual/nomatchedfiles.css": 'test/nonexistent/*.less'
        }
      },
      compressReport: {
        options: {
          paths: ['test/fixtures/include'],
          compress: true,
          report: 'min'
        },
        files: {
          'test/actual/compressReport.css': ['test/fixtures/style.less', 'test/fixtures/style2.less']
        }
      },
      yuicompressReport: {
        options: {
          paths: ['test/fixtures/include'],
          yuicompress: true,
          report: 'gzip'
        },
        files: {
          'test/actual/yuicompressReport.css': ['test/fixtures/style.less', 'test/fixtures/style2.less', 'test/fixtures/style3.less']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/actual/**']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('assemble-internal');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'less', 'nodeunit']);
  grunt.registerTask('docs', ['assemble-internal']);

};

