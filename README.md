# assemble-styles

> Compile your styles using JSON and LESS.


`assemble-styles` is a gruntplugin for compiling LESS to CSS, but with a twist that you won't find in other similar plugins.  This plugin makes it much easier to maintain libraries of LESS components and themes, by leveraging external JSON configuration files, underscore templates, and options for "inlining" globaly-required LESS files, such as `variables.less` and `mixins.less` so that they do not need to be referenced with `@import` statements in any individual files.

The plugin is **quite simple to use**, and it demonstrates good conventions for managing your LESS components. But the best part is that you can easily switch back and forth between compiling your LESS components _individually_, or concatentating all of your LESS files into a _singe file_.  and the best part is that your code will be more maintainable.


**Table of Contents**

- [Getting Started](#getting-started)
- ["styles" task](#styles-task)
  - [Options](#options)
- [Examples](#usage-examples)
  - [Twitter Bootstrap Components](#twitter-bootstrap-components)
- [Credit](#credit)
- [Release History](#release-history)


## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install assemble-styles --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble-styles');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-less/tree/grunt-0.3-stable).*


## styles task
_Run this task with the `grunt styles` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
### Options

#### paths
Type: `String|Array`
Default: Directory of input file.

Specifies directories to scan for @import directives when parsing. Default value is the directory of the source, which is probably what you want.

#### compress
Type: `Boolean`
Default: False

Compress output by removing some whitespaces.

#### yuicompress
Type: `Boolean`
Default: False

Compress output using cssmin.js

#### optimization
Type: `Integer`
Default: null

Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. This could matter for debugging, or if you want to access the individual nodes in the tree.

#### strictImports
Type: `Boolean`
Default: False

Force evaluation of imports.

#### dumpLineNumbers
Type: `String`
Default: false

Configures -sass-debug-info support.

Accepts following values: `comments`, `mediaquery`, `all`.

#### requires
Type: `String|Array`
Default: Directory of input file.

Specifies files to append to all src files, such as `variables.less` and `mixins.less`.

#### concat
Type: `Boolean`
Default: true

Concatent all source files by default, or change value to `false` to compile source files into individual files.


### Usage Examples

**TODO...**

```js
styles: {
  development: {
    options: {
      paths: ['src/less'],
      requires: [
        'src/less/variables.less',
        'src/less/mixins.less'
      ]
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


#### Twitter Bootstrap Components

**TODO...**

* JSON
* Underscore templates
* Components


``` js
styles: {
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
    },

    // Compile LESS files individually
    all: {
      options: { concat: false },
      src:  'src/less/**/*.less',
      dest: 'src/assets/css/individual'
    }
}
```



## Credit

`assemble-styles` is derived from [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less), submitted by [Tyler Kellen](https://github.com/tkellen).

Most, but not all, of the following documentation on this page is from that plugin as well. In case you're curious, we decided to create a new plugin because we had to reverse the order in which files are compiled/concatenated, and we needed to add options to compliment the `assemble` project, some of which are arguably not necessary for a "baseline" plugin like grunt-contrib-less.



## Release History (from grunt-contrib-less)

TODO... replace with version history for this plugin

 * 2013-02-14   v0.5.0   First official release for Grunt 0.4.0.
 * 2013-01-22   v0.5.0rc7   Updating grunt/gruntplugin dependencies to rc7. Changing in-development grunt/gruntplugin dependency versions from tilde version ranges to specific versions. Remove experimental wildcard destination support. Switching to this.files api.
 * 2012-10-17   v0.3.2   Add support for dumpLineNumbers.
 * 2012-10-11   v0.3.1   Rename grunt-contrib-lib dep to grunt-lib-contrib.
 * 2012-09-23   v0.3.0   Global options depreciated Revert normalize linefeeds.
 * 2012-09-15   v0.2.2   Support all less options Normalize linefeeds Default path to dirname of src file.
 * 2012-09-09   v0.2.0   Refactored from grunt-contrib into individual repo.

---

