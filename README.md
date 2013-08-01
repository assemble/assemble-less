# assemble-less [![NPM version](https://badge.fury.io/js/assemble-less.png)](http://badge.fury.io/js/assemble-less)  [![Build Status](https://travis-ci.org/assemble/assemble-less.png?branch=master)](https://travis-ci.org/assemble/assemble-less)

> Compile LESS to CSS. Adds experimental features that extend Less.js for maintaining UI components, 'bundles' and themes. From Jon Schlinkert, core team member of Less.js. This project is a fork of the popular grunt-contrib-less plugin by the talented Tyler Kellen. Please use that plugin if you require something stable and dependable.

## Getting Started
This plugin requires Grunt `~0.4.1`

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

#### lessrc
Type: `String`
Default: null

A convenience option for externalizing task options into a `.lessrc` or `.lessrc.yml` file. If this file is specified, options defined therein will be used.

A `.lessrc` file must contain valid JSON and look something like this:

```json
{
  "yuicompress": true,
  "strictMath": true,
  "strictUnits": true,
  "paths": ["vendor/bootstrap/less"]
}
```

A `.lessrc.yml` must contain valid YAML and look something like this:

```yaml
yuicompress: true
strictMath: true
strictUnits: true
paths:
- vendor/bootstrap/less
```

#### process
Type: `Boolean|Object`
Default: false

Process source files as [templates][] before concatenating.

* `false` - No processing will occur.
* `true` - Process source files using [grunt.template.process][] defaults.
* `options` object - Process source files using [grunt.template.process][], using the specified options.
* `function(src, filepath)` - Process source files using the given function, called once for each file. The returned value will be used as source code.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

#### metadata
Type: `String|Array`
Default: Empty string

Specify the data to be passed into Lodash templates embedded in LESS files. The name of the files is used as the first path in the template variables, so if you want to use data from `palette.yml`, your templates would look something like: `<%= palette.some-color %>`.

Data may be formatted in `JSON`, `YAML`. See [this YAML example][1] and [this LESS example][2].

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
[1]: https://github.com/assemble/assemble-less/blob/master/test/fixtures/data/palette.yml
[2]: https://github.com/assemble/assemble-less/blob/master/test/fixtures/templates-palette.less

_Note that data passed into `options.metadata` is merged at the task and target levels. You can turn this off by adding `options: {merge: false}`, which then disables merging and allows targets to override any data passed in at the task-level._

#### banner
Type: `String`
Default: Empty string

This string will be prepended to the beginning of the concatenated output. It is processed using [grunt.template.process][], using the default options.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

#### stripBanners
Type: `Boolean|Object`
Default: false

Strip JavaScript banner comments from source files.

* `false` - No comments are stripped.
* `true` - `/* ... */` block comments are stripped, but _NOT_ `/*! ... */` comments.
* `options` object:
  * By default, behaves as if `true` were specified.
  * `block` - If true, _all_ block comments are stripped.
  * `line` - If true, any contiguous _leading_ `//` line comments are stripped.

[templates]: https://github.com/gruntjs/grunt/wiki/grunt.template
[grunt.template.process]: https://github.com/gruntjs/grunt/wiki/grunt.template#wiki-grunt-template-process

#### imports
Type: `Object` (each option accepts a `String` or `Array`)
Default: `null`

_Any new import directives will be immediately available upon release by Less.js._

Prepend one or more `@import` statements to each `src` file in a target. Using this feature you may specify any of the new `@import` directives planned for release in Less.js v1.5.0:

* `inline`
* `less`
* `css`
* `reference`

#### report
Choices: `false`|`'min'`|`'gzip'`
Default: `false`

Either do not report anything, report only minification result, or report minification and gzip results. This is useful to see exactly how well Less is performing, but using `'gzip'` can add 5-10x runtime task execution.

Example ouput using `'gzip'`:

```
Original: 198444 bytes.
Minified: 101615 bytes.
Gzipped:  20084 bytes.
```

#### paths
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

#### compress
Type: `Boolean`
Default: false

Compress output by removing some whitespaces.

#### yuicompress
Type: `Boolean`
Default: false

Compress output using cssmin.js

#### ieCompat
Type: `Boolean`
Default: true

Enforce the css output is compatible with Internet Explorer 8.

For example, the [data-uri](https://github.com/cloudhead/less.js/pull/1086) function encodes a file in base64 encoding and embeds it into the generated CSS files as a data-URI. Because Internet Explorer 8 limits `data-uri`s to 32KB, the [ieCompat](https://github.com/cloudhead/less.js/pull/1190) option prevents `less` from exceeding this.

#### optimization
Type: `Integer`
Default: null

Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. This could matter for debugging, or if you want to access the individual nodes in the tree.

#### strictImports
Type: `Boolean`
Default: false

Force evaluation of imports.

#### syncImport
Type: `Boolean`
Default: false

Read @import'ed files synchronously from disk.

#### dumpLineNumbers
Type: `String`
Default: false

Configures -sass-debug-info support.

Accepts following values: `comments`, `mediaquery`, `all`.

#### relativeUrls
Type: `boolean`
Default: false

Rewrite urls to be relative. False: do not modify urls.

#### version
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
      yuicompress: true
    },
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  }
}
```

#### Compile Individual Components

> Compile [Bootstrap's](https://github.com/twbs/bootstrap) LESS components individually.

Using the `imports: {}` option and the "files array format" enables us to compile each Bootstrap
LESS component without having to add `@import "variables.less";` and `@import "mixins.less";` to
every file.

```javascript
less: {
  options: {
    paths: 'vendor/bootstrap/less',
    imports: {
      less: ['mixins.less', 'variables.less']
    }
  },
  components: {
    files: [
      { expand: true, cwd: 'vendor/bootstrap/less', src: '*.less', dest: 'assets/css/', ext: '.css' }
    ]
  }
}
```

#### Pass in data from JSON or YAML

Using the `metadata` option we can pass in external data before compiling.

```javascript
less: {
  options: {
    metadata: 'src/data/*.{yml,json}'
  },
  components: {
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  }
}
```

In our data file, `palette.yml`, we would define our variables:

```yaml
black:       '000'
gray-darker: '111'
gray-dark:   '222'
gray:        '333'
```
Then in our LESS file:

```scss
@palette-info:    #<%= palette.info %>;
@palette-warning: #<%= palette.warning %>;
@palette-danger:  #<%= palette.danger %>;
@palette-success: #<%= palette.success %>;
```

## Release History

 * 2013-07-30   v0.5.0   Completely refactored the plugin based on grunt-contrib-less. Add examples for all features to Gruntfile. Removed the concat feature. You can now use `.lessrc` or `.lessrc.yml` for externalizing task options. New `stripBanners` option
 * 2013-06-13   v0.4.7   Cleaned up a lot of the Gruntfile. Examples are more clear. New `import` option for prepending import statements to LESS files before compiling. New `banner` option for adding banners to generated CSS files.
 * 2013-03-17   v0.3.0   New option to specify the version of less.js to use for compiling to CSS.
 * 2013-03-14   v0.2.3   New options from Less.js 1.4.0
 * 2013-02-27   v0.1.0   First commit.

***

Project authored by [Jon Schlinkert](https://github.com/jonschlinkert/).

_This file was generated on Thu Aug 01 2013 06:21:04._
