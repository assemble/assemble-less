/*
 * Based on grunt-contrib-less, please use that project if you
 * require stability, This project is focused on experimental
 * features.
 * https://github.com/grunt/grunt-contrib-less
 * Copyright (c) 2014 Tyler Kellen, contributors
 * Licensed under the MIT license.
 *
 *
 * assemble-less
 * http://github.com/assemble/assemble-less
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      copyright: 'Copyright (c) <%= grunt.template.today("yyyy") %>',
      license: '<%= _.pluck(pkg.licenses, "type").join(", ") %>',
      banner: [
        '/*',
        ' * <%= pkg.name %>',
        ' * http://assemble.io',
        ' *',
        ' * <%= meta.copyright %>, <%= pkg.author.name %>',
        ' * Licensed under the <%= meta.license %> License.',
        ' *',
        ' */\n'
      ].join('\n')
    },

    // Test variables
    bootstrap: 'test/fixtures/bootstrap',
    assets:    'test/assets/foo',

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

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/actual']
    },

    // Configuration to be run (and then tested).
    less: {
      props: {
        options: {
          imports: {
            reference: ['variables.less', 'mixins.less']
          }
        },
        src: 'test/fixtures/props.less',
        dest: 'test/actual/props.css'
      },
      merge: {
        options: {
          imports: {
            reference: ['variables.less', 'mixins.less']
          }
        },
        src: 'test/fixtures/merge.less',
        dest: 'test/actual/merge.css'
      },
      globalVariables: {
        options: {
          globalVars: {
            'content': 'Global Variable!!!'
          }
        },
        files: {
          'test/actual/globalVars.css': 'test/fixtures/globalVars.less'
        }
      },
      modifyVariables: {
        options: {
          modifyVars: {
            'content': 'BOTTOM',
            'foo': 'bar',
          }
        },
        files: {
          'test/actual/modifyVars.css': 'test/fixtures/modifyVars.less'
        }
      },
      // Should compile a single LESS file to CSS
      bootstrap: {
        src: '<%= bootstrap %>/bootstrap.less',
        dest: 'test/actual/css/bootstrap.css'
      },
      // Should use the "reference" directive to compile a single LESS file to CSS
      alerts: {
        options: {
          imports: {
            reference: ['variables.less', 'mixins.less']
          }
        },
        src: '<%= bootstrap %>/alerts.less',
        dest: 'test/actual/css/alerts.css'
      },
      // Should compile each less "component" separately using the
      // "@import (reference)" feature of less.js
      reference: {
        options: {
          // Should use these paths as the cwd for imports
          paths: ['<%= bootstrap %>'],
          // Should import these files as LESS, and append them to the source files in the files array
          imports: {
            reference: ['variables.less', 'mixins.less', 'scaffolding.less', 'forms.less', 'buttons.less', 'utilities.less']
          }
        },
        files: [
          {
            expand: true,
            cwd: '<%= bootstrap %>',
            src: ['*.less', '!{boot,var,mix}*.less'],
            dest: 'test/actual/css/reference/',
            ext: '.css'
          }
        ]
      },
      // Should process templates using metadata from grunt config
      metadata: {
        options: {
          test: 'package.json',
          // Custom metadata properties
          metadata: ['test/fixtures/data/*.{yml,json}', 'package.json', {palette: {info: 'blue'}}],
          palette: {info: 'red'},
          name: 'Overridden',
          foo: 'callout',
          bar: 'alert',
          theme: {
            name: 'Metadata test',
            description: 'Metadata was successfully processed!'
          },
          paths: ['<%= bootstrap %>'],
          imports: {
            reference: ['mixins.less', 'variables.less', 'alerts.less']
          }
        },
        files: {
          'test/actual/metadata.css':   ['test/fixtures/metadata.less'],
        }
      },
      // Should use process lodash templates in less files, using metadata as context
      lodash: {
        options: {
          metadata: ["test/fixtures/data/*.{yml,json}"],
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: ['templates-*.less'], dest: 'test/actual/lodash/', ext: '.css'}
        ]
      },
      // Should use '.lessrc' for config
      runtimeConfig: {
        options: {
          lessrc: 'test/.lessrc'
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures', src: ['templates-*.less'], dest: 'test/actual/runtimeConfig', ext: '.css'}
        ]
      },
      // Shouls strip banners from dest files
      stripbanners: {
        options: {stripBanners: true},
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures/strip_banners', src: ['*.less'], dest: 'test/actual/strip_banners/', ext: '.css'}
        ]
      },
      // Should add a banner onto dest files
      banner: {
        options: {
          stripBanners: true,
          banner: '<%= meta.banner %>'
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures/banners', src: ['*.less'], dest: 'test/actual/banners/', ext: '.css'}
        ]
      },
      // Should add a banner onto minified dest files
      bannerMinified: {
        options: {
          compress: true,
          stripBanners: true,
          banner: '<%= meta.banner %>'
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures/banners', src: ['*.less'], dest: 'test/actual/minified/', ext: '.css'}
        ]
      },
      // Should compile less files, and concat multiple source files into a single dest file.
      compile: {
        options: {
          paths: ['test/fixtures/include']
        },
        files: {
          'test/actual/less.css':   ['test/fixtures/style.less'],
          'test/actual/concat.css': ['test/fixtures/style.less', 'test/fixtures/style2.less', 'test/fixtures/style3.less']
        }
      },
      // Should minify generated CSS
      compress: {
        options: {
          paths: ['test/fixtures/include'],
          compress: true
        },
        files: {
          'test/actual/compress.css': ['test/fixtures/style.less']
        }
      },
      // Should minify and run "cleancss" on generated CSS
      cleancss: {
        options: {
          paths: ['test/fixtures/include'],
          cleancss: true
        },
        files: {
          'test/actual/cleancss.css': ['test/fixtures/style.less']
        }
      },
      // Should minify generated CSS and provide a report in the console
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
      // Should minify and run "cleancss" on generated CSS, then provide a report in the console
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
      // Should import a CSS file "as LESS" and use the variables contained therein
      variablesAsLess: {
        src: 'test/fixtures/variablesAsLess.less',
        dest: 'test/actual/variablesAsLess.css',
      },
      // Should generate a source map inline with the generated CSS
      sourceMap: {
        options: {
          sourceMap: true,
        },
        src: 'test/fixtures/style3.less',
        dest: 'test/actual/sourceMap.css',
      },
      // Should generate a source map and write it to the specified file path
      sourceMapFilename: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'test/actual/sourceMapFilename.css.map'
        },
        src: 'test/fixtures/style3.less',
        dest: 'test/actual/sourceMapFilename.css',
      },
      sourceMapURL: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'test/actual/sourceMap.css.map',
          sourceMapURL: 'custom/url/for/sourceMap.css.map'
        },
        src: 'test/fixtures/style3.less',
        dest: 'test/actual/sourceMapWithCustomURL.css',
      },
      // Should generate a source map and write it to the specified file path,
      // while only adding the basenames of the source files to the 'sources' array
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
      sourceMapLessInline: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'test/actual/sourceMapLessInline.css.map',
          outputSourceFiles: true,
        },
        src: 'test/fixtures/style3.less',
        dest: 'test/actual/sourceMapLessInline.css',
      },
      testCustomFunctions: {
        options: {
          assets: '<%= assets %>',
          customFunctions: {
            assets: function(less, assets) {
              return grunt.config.process('<%= assets %>');
            },
            prefix: function(less, assets) {
              return grunt.config.process('<%= assets %>');
            },
            'multiple-args': function(less, arg1, arg2) {
              return (((arg1.value * 1) + (arg2.value))) + arg1.unit.numerator[0];
            },
            'string-result': function(less, arg1) {
                return "\"Hello\"";
            },
            'to-rgb': function(less, color) {
              console.log(color);
              return 'rgb(' + color.rgb + ')';
            },
            'to-rgba': function(less, color) {
              console.log(color);
              return 'rgba(' + color.rgb + ',' + color.alpha + ')';
            },
            'to-hex': function (less, r, g, b) {
              r = r.value; g = g.value; b = b.value;
              return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            }
          }
        },
        files: {
          'test/actual/customFunctions.css': ['test/fixtures/customFunctions.less'],
          'test/actual/assets.css': ['test/fixtures/assets.less'],
          'test/actual/hex.css': ['test/fixtures/hex.less'],
        }
      },
      // Should keep going when no files are detected
      nofiles: {},
      // Should run, complete and provide a warning that no source files were found
      nomatchedfiles: {
        files: {
          "test/actual/nomatchedfiles.css": 'test/nonexistent/*.less'
        }
      },
      // Should correctly use the path defined in the less file,
      // without "paths" defined in the config
      nopaths: {
        files: {
          'test/actual/nopaths.css': ['test/fixtures/nopaths.less']
        }
      },
      // Should run in ie compatibility mode
      ieCompatTrue: {
        options: {
          paths: ['test/fixtures/include'],
          ieCompat: true
        },
        files: {
          'test/actual/ieCompatTrue.css': ['test/fixtures/ieCompat.less']
        }
      },
      // Should not run in ie compatibility mode
      ieCompatFalse: {
        options: {
          paths: ['test/fixtures/include'],
          ieCompat: false
        },
        files: {
          'test/actual/ieCompatFalse.css': ['test/fixtures/ieCompat.less']
        }
      }
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

  // Whenever the "test" task is run, first clean the "test/actual" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'less', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'readme']);
};

