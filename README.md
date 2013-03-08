# assemble-styles

> Compile your styles using JSON, underscore templates and LESS.


`assemble-styles` is a gruntplugin for compiling LESS to CSS, but with a twist that you won't find in other similar plugins.  This plugin makes it much easier to maintain libraries of LESS components and themes, by leveraging JSON and underscore templates to enable you to define LESS "packages" or "bundles" using external configuration files.

See the [example configuration file](), `bootstrap.json`.

The plugin is **quite simple to use**, and it demonstrates good conventions for managing your LESS components. But the best part is that you can easily switch back and forth between compiling your LESS components _individually_, or concatentating all of your LESS files into a _singe file_.  and the best part is that your code will be more maintainable.


**Table of Contents**

- [Getting Started](#getting-started)
- ["styles" task](#the-styles-task)
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


## The "styles" task
_Run this task with the `grunt styles` command._


### Overview
In your project's Gruntfile, add a section named `styles` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  styles: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
### Options

#### requires
Type: `String|Array`
Default: empty string

Specified files will be prepended to the beginning of src files, _not_ to the concatenated output. This feature is useful for "inlining" globaly-required LESS files, such as `variables.less` and `mixins.less`, so that _they do not need to be referenced with `@import` statements inside any individual files_.

#### concat
Type: `Boolean`
Default: true

Concatenate all source files by default. If you change the value to false, all source files will compile into individual files.

#### paths
Type: `String|Array`
Default: Directory of input file.

Specifies directories to scan for `@import` directives when parsing. Default value is the directory of the source, which is probably what you want. In other words, the `paths` option allows you to specify paths for your @import statements in the `styles` task, as an alternative to specifying a path on every @import statement that appears throughout your LESS files. So instead of doing this:

``` css
@import "path/to/my/less/files/mixins/mixins.less";
@import "path/to/my/less/files/bootstrap.less";
@import "path/to/my/custom/less/files/somewhere/else/custom.less";
```
you can do this:

``` css
@import "mixins.less";
@import "bootstrap.less";
@import "custom.less";
```

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


### Usage Examples


#### Default Options

In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  styles: {
    options: {},
    files: {
      'path/to/result.css': ['path/to/source.less']
    }
  }
})
```


#### Custom Options

In this example, the `paths` and `requires` options are used:

```js
styles: {
  development: {
    options: {
      paths: ['path/to/my/less/files/'],
      requires: [
        'src/less/variables.less',
        'src/less/mixins.less'
      ]
    },
    files: {
      'path/to/result.css': ['path/to/source.less']
    }
  },
  production: {
    options: {
      paths: ['assets/css'],
      yuicompress: true
    },
    files: {
      'path/to/result.css': ['path/to/source.less']
    }
  }
}
```


#### Twitter Bootstrap

> Pick and choose which Bootstrap components you want to "bundle" or exclude.

A common (unjustified) complaint about Bootstrap is that it's bloated or has too many "extras", which really means: "it's too much work to comment out or remove the @import statements I'm not using".

Well, lazy people rejoice! Because `assemble-styles` makes it easier than squeeze cheeze to customize Bootstrap.


``` js
styles: {

  // Task-wide options.
  options: {
    paths: ['<%= bootstrap.less.base %>'],
    requires: [
      '<%= bootstrap.less.variables %>',
      '<%= bootstrap.less.mixins %>'
    ]
  },

  // Compile LESS "Bundles"
  core: {
    src:  '<%= bootstrap.less.core %>',
    dest: 'examples/css/core.css'
  },
  common: {
    src:  '<%= bootstrap.less.common %>',
    dest: 'examples/css/common.css'
  },
  nav: {
    src:  '<%= bootstrap.less.nav %>',
    dest: 'examples/css/nav.css'
  },
  zindex: {
    src:  '<%= bootstrap.less.zindex %>',
    dest: 'examples/css/zindex.css'
  },
  misc: {
    src:  '<%= bootstrap.less.misc %>',
    dest: 'examples/css/misc.css'
  },
  utilities: {
    src:  '<%= bootstrap.less.util %>',
    dest: 'examples/css/utilities.css'
  },

  // Compile LESS files individually
  individual: {
    options: { concat: false },
    src:  '<%= bootstrap.less.all %>',
    dest: 'examples/css/individual'
  },

  // Compile LESS files individually, using minimatch instead of "bundles"
  // Also note that a template was added for exclude patterns.
  each: {
    options: { concat: false },
    src:  ['examples/less/**/*.less', '!<%= bootstrap.ignore %>'],
    dest: 'examples/css/individual'
  }
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Credit

`assemble-styles` is derived from [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less), submitted by [Tyler Kellen](https://github.com/tkellen), and some of the documentation on this page is from [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less) as well.

**Why create another grunt/less plugin?**
This is simple, we had to because we needed to reverse the order in which files are compiled/concatenated in grunt-contrib-less, and we require additional features than what might be necessary for a "baseline" plugin like grunt-contrib-less.


## Release History

 * 2013-02-27   v0.1.2   Add support for concat and requires options.
 * 2013-02-27   v0.1.0   First commit.

---

