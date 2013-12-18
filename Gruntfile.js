/*
 * Based on grunt-contrib-less
 * https://github.com/grunt/grunt-contrib-less
 * Copyright (c) 2013 Tyler Kellen, contributors
 * Licensed under the MIT license.
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
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Metadata
    meta: {
      copyright: 'Copyright (c) <%= grunt.template.today("yyyy") %>',
      license: '<%= _.pluck(pkg.licenses, "type").join(", ") %>',
      banner: [
        '/*',
        ' * <%= pkg.name %> v<%= pkg.version %>',
        ' * http://assemble.io',
        ' *',
        ' * <%= meta.copyright %>, <%= pkg.author.name %>',
        ' * Licensed under the <%= meta.license %> License.',
        ' *',
        ' */\n',
        '@injectedVar: injectedVarValue;\n\n' // test
      ].join('\n')
    },


    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/actual']
    },


    /**
     * Test variables
     * For custom functions and template expansion.
     */
    bootstrap: 'test/fixtures/bootstrap',
    assets:    'test/assets/foo',


    /**
     * The "less" task
     */
    less: {
      // task-level options
      options: {
        metadata: ['test/fixtures/data/*.{yml,json}', 'package.json']
      },
      bootstrap: {
        src: '<%= bootstrap %>/bootstrap.less',
        dest: 'test/actual/css/bootstrap.css'
      },
      alerts: {
        options: {
          imports: {reference: ['<%= bootstrap %>/{mix,var}*.less']}
        },
        src: '<%= bootstrap %>/alerts.less',
        dest: 'test/actual/css/alerts.css'
      },
      components: {
        options: {
          imports: {
            less: [
              '<%= bootstrap %>/variables.less',
              '<%= bootstrap %>/mixins.less',
              '<%= bootstrap %>/scaffolding.less',
              '<%= bootstrap %>/forms.less',
              '<%= bootstrap %>/buttons.less',
              '<%= bootstrap %>/utilities.less'
            ]
          }
        },
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/bootstrap',
            src: ['*.less', '!{boot,var,mix}*.less'],
            dest: 'test/actual/css/components/',
            ext: '.css'
          }
        ]
      },
      reference: {
        options: {
          paths: ['test/fixtures/booststrap', 'test/fixtures/include'],
          imports: {
            reference: ['mixins.less', 'variables.less', 'modal.less', 'navbar.less']
          }
        },
        files: {
          'test/actual/reference.css':   ['test/fixtures/reference.less'],
        }
      },
      assetsPath: {
        options: {
          assets: 'test/assets/css',
          customFunctions: {
            assets: function(less, assets) {
              return grunt.config.process('<%= assets %>');
            },
            prefix: function(less, assets) {
              return grunt.config.process('<%= assets %>');
            }
          }
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: ['assets.less'], dest: 'test/actual/', ext: '.css'}
        ]
      },
      runtimeConfig: {
        options: {
          lessrc: 'test/.lessrc'
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: ['templates-*.less'], dest: 'test/actual/runtimeConfig', ext: '.css'}
        ]
      },
      lodash: {
        options: {
          metadata: []
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: ['templates-*.less'], dest: 'test/actual/', ext: '.css'}
        ]
      },
      stripbanners: {
        options: {stripBanners: true},
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures/strip_banners', src: ['*.less'], dest: 'test/actual/strip_banners/', ext: '.css'}
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
      cleancss: {
        options: {
          paths: ['test/fixtures/include'],
          cleancss: true
        },
        files: {
          'test/actual/cleancss.css': ['test/fixtures/style.less']
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
      cleancssReport: {
        options: {
          paths: ['test/fixtures/include'],
          cleancss: true,
          report: 'gzip'
        },
        files: {
          'test/actual/cleancssReport.css': ['test/fixtures/style.less', 'test/fixtures/style2.less', 'test/fixtures/style3.less']
        }
      },
      variablesAsLess: {
        src: 'test/fixtures/variablesAsLess.less',
        dest: 'test/actual/variablesAsLess.css',
      },
      sourceMap: {
        options: {
          sourceMap: true,
        },
        src: 'test/fixtures/style3.less',
        dest: 'test/actual/sourceMap.css',
      },
      sourceMapFilename: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'test/actual/sourceMapFilename.css.map'
        },
        src: 'test/fixtures/style3.less',
        dest: 'test/actual/sourceMapFilename.css',
      },
      sourceMapBasepath: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'test/actual/sourceMapBasepath.css.map',
          sourceMapBasepath: 'test/fixtures/'
        },
        src: 'test/fixtures/style3.less',
        dest: 'test/actual/sourceMapBasepath.css',
      },
      sourceMapRootpath: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'test/actual/sourceMapRootpath.css.map',
          sourceMapRootpath: 'http://example.org/'
        },
        src: 'test/fixtures/style3.less',
        dest: 'test/actual/sourceMapRootpath.css',
      },
      testCustomFunctions: {
        options: {
          customFunctions: {
            'get-color': function(less, color) {
              return 'red';
            },
            'multiple-args': function(less, arg1, arg2) {
              return (((arg1.value * 1) + (arg2.value))) + arg1.unit.numerator[0];
            },
            'string-result': function(less, arg1) {
                return "\"Hello\"";
            },
            // Alpha parameter is for opacity
            // hexToRgba: function (c, alpha) {
            //   var rgb = c.rgb.map(function (c) {
            //     return scaled(c, 256);
            //   });
            //   return new(tree.Color)(rgb, alpha);
            // }
          }
        },
        files: {
          'test/actual/customFunctions.css': ['test/fixtures/customFunctions.less']
        }
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-readme');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'less', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'readme']);
};

