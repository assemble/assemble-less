# assemble-less [![NPM version](https://badge.fury.io/js/assemble-less.png)](http://badge.fury.io/js/assemble-less)  [![Build Status](https://travis-ci.org/assemble/assemble-less.png)](https://travis-ci.org/assemble/assemble-less)

> Compile LESS to CSS. Adds experimental features that extend Less.js for maintaining UI components and themes. From Jon Schlinkert, core team member of Less.js.

This project is a fork of the popular [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less) by the talented [Tyler Kellen](http://goingslowly.com/). Please use that plugin if you require something stable and dependable.

## Getting Started

This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install assemble-less --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble-less');
```


## Less task
_Run this task with the `grunt less` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options
### lessrc
Type: `String`

Default: null

A convenience option for externalizing task options into a `.lessrc` or `.lessrc.yml` file. If this file is specified, options defined therein will be used.

### globalVars
Type: `Object`

Default: `undefined`

Prepend variables to source files.

### modifyVars
Type: `Object`

Default: `undefined`

Append variables to source files.

### metadata
Type: `String|Array`

Default: Empty string

Pass metadata as context to Lo-Dash templates embedded in LESS files. The name of the files is used as the first path in the template variables, so if you want to use data from `palette.yml`, your templates would look something like: `<%= palette.foo %>`.

Data may be formatted in `JSON`, `YAML`. See [this YAML example][1] and [this LESS example][2].

_Note that data passed into `options.metadata` is merged at the task and target levels. You can turn this off by adding `options: {merge: false}`, which then disables merging and allows targets to override any data passed in at the task-level._

### imports
Type: `Object` (each option accepts a `String` or `Array`)

Default: `null`

Prepend `@import` statements to `src` files using any of the new `@import` directives released after Less.js v1.5.0, `less`, `css`, `inline`, `reference` (`multiple` and `once` probably aren't applicable here, but feel free to use them if you find a use case). See [examples](#usage-examples).

_Any new import directives will be immediately available upon release by Less.js._

### process
Type: `Boolean|Object`

Default: false

Process source files as [templates][3] before concatenating.

* `false` - No processing will occur.
* `true` - Process source files using [grunt.template.process][4] defaults.
* `options` object - Process source files using [grunt.template.process][4], using the specified options.
* `function(src, filepath)` - Process source files using the given function, called once for each file. The returned value will be used as source code.

_(Default processing options are explained in the [grunt.template.process][4] documentation)_

### banner
Type: `String`

Default: Empty string

This string will be prepended to the beginning of the concatenated output. It is processed using [grunt.template.process][4], using the default options.

_(Default processing options are explained in the [grunt.template.process][4] documentation)_

### stripBanners
Type: `Boolean|Object`

Default: false

Strip JavaScript banner comments from source files.

* `false` - No comments are stripped.
* `true` - `/* ... */` block comments are stripped, but _NOT_ `/*! ... */` comments.
* `options` object:
  * By default, behaves as if `true` were specified.
  * `block` - If true, _all_ block comments are stripped.
  * `line` - If true, any contiguous _leading_ `//` line comments are stripped.

### paths
Type: `String|Array`

Default: Directory of input file.

Specifies directories to scan for `@import` directives when parsing. The default value is the directory of the specified source files. In other words, the `paths` option allows you to specify paths for your @import statements in the `less` task as an alternative to specifying a path on every `@import` statement that appears throughout your LESS files. So instead of doing this:

``` css
@import "path/to/less/files/mixins.less";
```
you can do this:

``` css
@import "mixins.less";
```

##### rootpath
Type: `String`

Default: `""`

A path to add on to the start of every url resource.

### compress
Type: `Boolean`

Default: `false`

Compress output by removing some whitespaces.

##### cleancss
Type: `Boolean`

Default: `false`

Compress output using [clean-css](https://npmjs.org/package/clean-css).

### ieCompat
Type: `Boolean`

Default: `true`

Enforce the css output is compatible with Internet Explorer 8.

For example, the [data-uri](https://github.com/cloudhead/less.js/pull/1086) function encodes a file in base64 encoding and embeds it into the generated CSS files as a data-URI. Because Internet Explorer 8 limits `data-uri`s to 32KB, the [ieCompat](https://github.com/cloudhead/less.js/pull/1190) option prevents `less` from exceeding this.

### optimization
Type: `Integer`

Default: null

Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. This could matter for debugging, or if you want to access the individual nodes in the tree.

### strictImports
Type: `Boolean`

Default: false

Force evaluation of imports.

### strictMath
Type: `Boolean`

Default: `false`

When enabled, math is required to be in parenthesis.

### strictUnits
Type: `Boolean`

Default: `false`

When enabled, less will validate the units used (e.g. 4px/2px = 2, not 2px and 4em/2px throws an error).

### syncImport
Type: `Boolean`

Default: `false`

Read @import'ed files synchronously from disk.

### dumpLineNumbers
Type: `String`

Default: `false`

Configures -sass-debug-info support.

Accepts following values: `comments`, `mediaquery`, `all`.

### relativeUrls
Type: `Boolean`

Default: `false`

Rewrite urls to be relative. false: do not modify urls.

### customFunctions
Type: `Object`

Default: none

Define custom functions to be available within your LESS stylesheets. The function's name must be lowercase and return a primitive type (not an object or array). In the function definition, the first argument is the less object, and subsequent arguments are from the less function call. Values passed to the function are not simple primitive types, rather types defined within less. See the LESS documentation for more information on the available types.

### report
Choices: `false`|`'min'`|`'gzip'`

Default: `false`

Either do not report anything, report only minification result, or report minification and gzip results. This is useful to see exactly how well Less is performing, but using `'gzip'` can add 5-10x runtime task execution.

Example ouput using `'gzip'`:

```
Original: 198444 bytes.
Minified: 101615 bytes.
Gzipped:  20084 bytes.
```

### sourceMap
Type: `Boolean`

Default: `false`

Enable source maps.

### sourceMapFilename
Type: `String`

Default: none

Write the source map to a separate file with the given filename.

### sourceMapURL
Type: `String`

Default: none

Override the default url that points to the sourcemap from the compiled css file.

### sourceMapBasepath
Type: `String`

Default: none

Sets the base path for the less file paths in the source map.

### sourceMapRootpath
Type: `String`

Default: none

Adds this path onto the less file paths in the source map.

### outputSourceFiles
Type: `Boolean`

Default: `false`

Puts the less files into the map instead of referencing them.

### version
Type: `String`

Default: `less` (current release)

Specify the directory containing the version of Less.js to use for compiling. You may specify a version at the task level or a different version for each target.

```javascript
less: {
  options: {
    version: 'vendor/less'
  },
  styles: {
    files: {
      'css/style.css': ['src/style.less']
    }
  }
}
```
Useful for testing new features included in a beta or alpha release, or for comparing the compiled results from different versions of Less.js.


### Usage Examples
> Basic config for compiling LESS to CSS.

```js
less: {
  development: {
    options: {
      paths: ["assets/css"]
    },
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  },
  production: {
    options: {
      paths: ["assets/css"],
      compress: true
    },
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  }
}
```

### lessrc

A `.lessrc` file must contain valid JSON and look something like this:

```json
{
  "compress": true,
  "metadata": "src/*.{json,yml}",
  "paths": ["vendor/bootstrap/less"]
}
```

A `.lessrc.yml` must contain valid YAML and look something like this:

```yaml
compress: true
paths:
- vendor/bootstrap/less
```

### Import directives

> Prepend `@import` statements to `src` files using any of the new `@import` directives released after Less.js v1.5.0.

Options are:

* `reference`: use a less file but do not output it
* `inline`: include the source file in the output but do not process as less
* `less`: treat the file as a less file, no matter what the file extension
* `css`: treat the file as a css file, no matter what the file extension

```javascript
less: {
  options: {
    paths: 'vendor/bootstrap/less',
    imports: {
      reference: ['variables.less', 'mixins.less'],
      inline: ['normalize.css'],
      less: ['normalize.css'],
      css: ['foo.css', 'bar.css']
    }
  },
  files: {}
}
```

### Compile individual bootstrap components

> Use import directives to compile each [Bootstrap's](https://github.com/twbs/bootstrap) LESS components separately.

Using the `imports: {}` option and the "files array format" enables us to compile each Bootstrap LESS component without having to add `@import "variables.less";` and `@import "mixins.less";` to
every file.

```javascript
less: {
  options: {
    paths: 'vendor/bootstrap/less',
    imports: {
      reference: ['variables.less', 'mixins.less'],
    }
  },
  components: {
    files: [
      { expand: true, cwd: 'vendor/bootstrap/less', src: '*.less', dest: 'assets/css/', ext: '.css' }
    ]
  }
}
```

### Pass metadata to Lo-Dash templates

Use the `metadata` option to pass context to Lo-Dash templates before compiling. For example, let's say you have a config like this:

```javascript
less: {
  options: {
    metadata: 'src/*.{json,yml}'
  },
  styles: {
    files: {
      'css/style.css': ['src/style.less']
    }
  }
}
```

and a data file, `palette.yml`, with some variables defined:

```yaml
## palette.yml
info:    '#000'
warning: '#111'
danger:  '#222'
success: '#333'
```

Then in our LESS file:

```scss
// Use as values to variables
@palette-info:    <%= palette.info %>;
@palette-warning: <%= palette.warning %>;

.swatch-info {
  background: @palette-info;
}
.swatch-warning {
  background: @palette-warning;
}

// or directly as variables
.swatch-danger {
  background: <%= palette.danger %>;
}
.swatch-success {
  background: <%= palette.success %>;
}
```



## Release History

 * 2014-01-01   v0.7.0   Update to use the Less.js v1.6.0 API for `banner`, `globalVars` and `modifyVars`.
 * 2013-12-18   v0.6.0   Adds `globalVars` and `modifyVars` options. See readme and Gruntfile for examples. Support `sourceMapURL` Support `outputSourceFiles` Support `sourceMapFilename`, `sourceMapBasepath` and `sourceMapRootpath` Upgrade to LESS 1.5 Support `strictUnits` option Support sourceMap option Add `customFunctions` option for defining custom functions within LESS Output the source file name on error yuicompress option now cleancss (Less changed underlying dependency)
 * 2013-07-30   v0.5.0   Completely refactored the plugin based on grunt-contrib-less. Add examples for all features to Gruntfile. Removed the concat feature. You can now use `.lessrc` or `.lessrc.yml` for externalizing task options. New `stripBanners` option
 * 2013-06-13   v0.4.7   Cleaned up a lot of the Gruntfile. Examples are more clear. New `import` option for prepending import statements to LESS files before compiling. New `banner` option for adding banners to generated CSS files.
 * 2013-03-17   v0.3.0   New option to specify the version of less.js to use for compiling to CSS.
 * 2013-03-14   v0.2.3   New options from Less.js 1.4.0
 * 2013-02-27   v0.1.0   First commit.


## Authors
This project is a fork of the popular [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less) by [Tyler Kellen](http://goingslowly.com/). Please use that plugin if you require something stable and dependable.

This fork is maintained by:

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

**Brian Woodward**

+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/jonschlinkert)


## License
Copyright (c) 2014 Jon Schlinkert, contributors.
Released under the MIT license

***

_This file was generated by [grunt-readme](https://github.com/assemble/grunt-readme) on Wednesday, January 1, 2014._

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html


[1]: https://github.com/assemble/assemble-less/blob/master/test/fixtures/data/palette.yml
[2]: https://github.com/assemble/assemble-less/blob/master/test/fixtures/templates-palette.less
[3]: http://gruntjs.com/api/grunt.template
[4]: http://gruntjs.com/api/grunt.template#grunt.template.process