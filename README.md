# [assemble-less v0.4.0](http://github.com/assemble/assemble-less) [![Build Status](https://travis-ci.org/assemble/assemble-less.png)](https://travis-ci.org/assemble/assemble-less)

> Compile LESS to CSS, with options for creating 'bundles', individual components, themes or whatever makes you happy.


_This project just launched **so expect frequent changes**._ And if you find this project interesting please consider starring it to receive updates.

### Getting Help

assemble-less has many more features than we've been able to document thus far. So while we work to improve the docs, _please let us know if you have any questions or have any trouble getting assemble-less to work. And feel free to create an [Issue][issues], we're here to help._

#### [Please visit the wiki](http://github.com/assemble/assemble-less/wiki) 
**Table of Contents**

- [Getting Started](#getting-started)
- [The "less" task](#the-less-task)
  - [Options](#options)
- [Examples](#usage-examples)
  - [Using default options](#default-options)
  - [Using custom options](#custom-options)
  - [Compiling Bootstrap Components](#twitter-bootstrap)
- [About](#about)
- [Contributing](#contributing)
- [Authors](#authors)
- [Credit](#credit)
- [Release History](#release-history)


## Quick start
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to read the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. 

Then install [the required local dependencies](package.json) and this plugin with this command:

```shell
$ npm install
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble-less');
```

When completed, you'll be able to run the various `grunt` commands provided:

#### compile - `grunt less`
Runs the Less.js compiler to rebuild the specified `/test/fixtures/*.less` files.  Requires [Less.js](http://github.com/cloudhead/less.js) and [assemble-less](http://github.com/assemble/assemble-less).

#### watch - `grunt watch`
This is a convenience task to "Run predefined tasks whenever watched file patterns are added, changed or deleted". Requires [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch), `npm i grunt-contrib-watch`.

Should you encounter problems with installing dependencies or running the `grunt` commands, be sure to first uninstall any previous versions (global and local) you may have installed, and then rerun `npm install`.




## The "less" task
In your project's Gruntfile, add a section named `assemble` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  less: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
});
grunt.loadNpmTasks('assemble-less');

grunt.registerTask('default', [
  'jshint', 
  'less'
]);
```
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


## Options

### Custom Options

> Options developed specifically for the `assemble-less` plugin

#### version
Type: `String`
Default: _less_

Specify the path to the Less.js version that you wish to use for compiling to CSS. Useful for testing to see if one version produces different output than another.

#### lessrc
Type: `String`
Default value: `null`

A convenience option for externalizing task options into a `.lessrc` file. If this file is specified, options defined therein will be used. 

``` javascript
less: {
  options: grunt.file.readJSON('.lessrc')
}
```
The `.lessrc` file must be valid JSON and looks something like this:

``` json
{
  "require": null,
  "concat": false,
  "compress": false,
  "yuicompress": false,
  "optimization": 03,
  "strictImports": true,
  "dumpLineNumbers": false,
  "strictMaths": false,
  "strictUnits": false
}
```

#### require
Type: `String|Array`
Default: _empty string_

Specified files will be _prepended_ to the beginning of src files, **_not_** to the concatenated output. This feature is useful for "inlining" globaly-required LESS files, such as `variables` or `mixins`, so that _they do not need to be referenced with `@import` statements inside any individual files_.

#### concat
Type: `Boolean`
Default: _true_

Concatenate all source files by default. If you change the value to false, all source files will compile into individual files.

#### globals (under consideration)
Type: `Object`
Default: _null_

Data object for defining global variables inside the Gruntfile which will be accessible in LESS files.  



### Standard Options

> These options will be passed through directly to [Less.js](http://github.com/cloudhead/less.js)

See the [Less.js documentation](http://github.com/cloudhead/less.js) for more info about supported options.

#### paths
Type: `String|Array`
Default: _Directory of input files_

Specifies directories to scan for `@import` directives when parsing. The default value is the directory of the specified source files. In other words, the `paths` option allows you to specify paths for your @import statements in the `less` task as an alternative to specifying a path on every `@import` statement that appears throughout your LESS files. So instead of doing this:

``` css
@import "path/to/my/less/files/mixins/mixins.less";
```
you can do this:

``` css
@import "mixins.less";
```

#### compress
Type: `Boolean`
Default: _false_

Specifies if we should compress the compiled css by removing some whitespaces.

#### yuicompress
Type: `Boolean`
Default: _false_

Compress output using cssmin.js.

#### optimization
Type: `Integer`
Default: null

Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. This could matter for debugging, or if you want to access the individual nodes in the tree.

#### strictImports
Type: `Boolean`
Default: _false_

Force evaluation of imports.

#### strictMaths
Type: `Boolean`
Default: _true_

Force operations to be enclosed within parenthesis, `(2 / 6)`.

#### strictUnits
Type: `Boolean`
Default: _true_

Force strict evaluation of units. If set to `false` the compiler will not throw an error with operations such as `(3 * 1em)`. 

#### dumpLineNumbers
Type: `String`
Default: _false_

Configures -sass-debug-info support.

Accepts following values: `comments`, `mediaquery`, `all`.


---

## Usage Examples

#### Compile

```javascript
less: {
  selectors_test: {
    files: {
      'selectors.css': ['selectors.less']
    }
  }
}
```

#### Concatenate and Compile

As an alternative to using `@import` to "inline" `.less` files, you can specify an array of `src` paths and they will be concatenated. 

```javascript
less: {
  dist: {
    files: {
      'test.css': ['reset.less', 'test.less']
    }
  }
}
```

#### Compile multiple files individually

You can specify multiple `destination: [source]` items in `files`.

```javascript
less: {
  dist: {
    files: {
      'test.css': ['test.less'],
      'mixins.css': ['mixins.less']
    }
  }
}
```

#### Custom Options

In this example, the `paths` and `requires` options are used:

```js
less: {
  development: {
    options: {
      paths: ['test/fixtures'],
      require: [
        'globals/variables.less',
        'globals/mixins.less'
      ]
    },
    files: {
      'styles.css': ['styles.less']
    }
  },
  production: {
    options: {
      paths: ['assets/less'],
      yuicompress: true
    },
    files: {
      'styles.min.css': ['styles.less']
    }
  }
}
```

#### Concatenate and Compile

Grunt supports filename expansion (also know as globbing) via the built-in [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) libraries. So Templates may be used in filepaths or glob patterns.

```
debug: {
  options: {
    paths:   ['<%= tests.debug.import %>']
  },
  src:  ['<%= tests.test.imports %>', 'test/fixtures/*.less'],
  dest: 'test/result/debug'
}
```
For more on glob pattern syntax, see the [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) documentation.



## Contributing
Want to help make **assemble-less** even better? All constructive feedback and contributions are welcome, so please consider contributing!  We can always use help creating, tests, documentation or resolving [Issues](https://github.com/assemble/assemble-less/issues), but if you have other ideas for how you can help, Brian and I would love to hear them!

[https://github.com/assemble/assemble-less/issues](http://github.com/assemble/assemble-less/issues)
 


## About
**assemble-less** is a powerful and flexible [Grunt plugin](http://gruntjs.com/plugins) for compiling LESS to CSS. The `less` task leverages [JSON and Lo-dash templates](http://gruntjs.com/configuring-tasks) for defining any number of LESS "bundles", UI components, compressed stylesheets or themes.

### Companion projects
* [assemble](http://github.com/assemble/assemble): a Grunt plugin for **quickly launching static web projects** by emphasizing a strong separation of concerns between structure, style, content and configuration.
* [less-tests](http://github.com/upside/less-tests): a LESS / CSS test-suite that uses [assemble-less](http://github.com/assemble/assemble-less) to enable you to run any kind of test on LESS stylesheets.


### Credit
This [Grunt.js](http://github.com/gruntjs/grunt) plugin and some of the documentation on this page, is derived from [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less), authored by [Tyler Kellen](https://github.com/tkellen). This plugin was modified for this project to `concat` LESS files first, and then compile them into CSS files. This allows for prepending globally required LESS files, and it also adds the ability to build out individual CSS files, rather than building a single conctatenated file.




## Authors

**Jon Schlinkert**

+ [http://twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)
+ [http://github.com/jonschlinkert](http://github.com/jonschlinkert)

**Brian Woodward**

+ [http://twitter.com/doowb](http://twitter.com/doowb)
+ [http://github.com/doowb](http://github.com/doowb)

## Copyright and license
Copyright 2013 Assemble

[MIT License](LICENSE-MIT)

## Release History
* 2013-03-17    v0.3.0    Adds new option to specify the version of less.js to use for compiling to CSS 
* 2013-03-14    v0.2.3    adds new options from Less.js 1.4.0 
* 2013-03-09    v0.2.0    in bootstrap.json, changed the path to bootstrap folder, new globals object new targets for single component, bootstrap.less lib, ignore pattern. 
* 2013-03-08    v0.1.7    Enhanced boostrap.json model. Many task improvements. Greatly improved examples, readme updates. 
* 2013-02-27    v0.1.2    Add support for requires option Add support for concat option 
* 2013-02-27    v0.1.0    First commit. 


### Roadmap
* Options for upcoming features in Less.js, such as 'silentImport'.
* variables option for modifying LESS variables directly inside the Gruntfile.
* upstage option for importing components from the [upstage](http://github.com/upstage) component library.


---
Authored by [assemble](https://github.com/assemble/assemble-less)

_This file was generated using Grunt and [assemble](http://github.com/assemble/assemble) on Sun Mar 24 2013 15:34:47._




[download]: https://github.com/assemble/assemble-less/zipball/master


[org]: https://github.com/assemble
[assemble]: https://github.com/assemble/assemble
[issues]: https://github.com/assemble/assemble/issues
[wiki]: https://github.com/assemble/assemble/wiki



[config]: https://github.com/assemble/assemble/wiki/Configuration
[gruntfile]: https://github.com/assemble/assemble/wiki/Gruntfile
[tasks]: https://github.com/assemble/assemble/wiki/Task-and-Targets
[options]: https://github.com/assemble/assemble/wiki/Options


[templates]: https://github.com/assemble/assemble/wiki/Templates
[layouts]: https://github.com/assemble/assemble/wiki/Layouts
[pages]: https://github.com/assemble/assemble/wiki/Pages
[partials]: https://github.com/assemble/assemble/wiki/Partials


[content]: https://github.com/assemble/assemble/wiki/Content
[data]: https://github.com/assemble/assemble/wiki/Data
[yaml]: https://github.com/assemble/assemble/wiki/YAML-front-matter
[markdown]: https://github.com/assemble/assemble/wiki/Markdown


[helpers]: https://github.com/assemble/assemble/wiki/Helpers
[assets]: https://github.com/assemble/assemble/wiki/Assets
[collections]: https://github.com/assemble/assemble/wiki/Collections


[examples]: https://github.com/assemble/assemble-examples
[exampleReadme]: https://github.com/assemble/assemble-examples-readme
[exampleBasic]: https://github.com/assemble/assemble-examples-basic
[exampleAdvanced]: https://github.com/assemble/assemble-examples-advanced
[exampleGrid]: https://github.com/assemble/assemble-examples-grid
[exampleTable]: https://github.com/assemble/assemble-examples-table
[exampleForm]: https://github.com/assemble/assemble-examples-form
[exampleSite]: https://github.com/assemble/assemble-examples-site
[exampleSitemap]: https://github.com/assemble/assemble-examples-sitemap


[contribute]: https://github.com/assemble/assemble/wiki/Contributing-to-Assemble
[extend]: https://github.com/assemble/assemble/wiki/Extending-Assemble
[helpers-lib]: https://github.com/assemble/assemble/wiki/Helpers


[grunt]: http://gruntjs.com/
[upgrading]: http://gruntjs.com/upgrading-from-0.3-to-0.4
[getting-started]: http://gruntjs.com/getting-started
[package]: https://npmjs.org/doc/json.html


[assemble]: https://github.com/assemble/assemble
[pre]: https://github.com/assemble/pre
[dry]: https://github.com/assemble/dry
[assemble-github-com]: https://github.com/assemble/assemble.github.com
[assemble-examples-bootstrap]: https://github.com/assemble/assemble-examples-bootstrap
[assemble-internal]: https://github.com/assemble/assemble-internal
[assemble-less]: https://github.com/assemble/assemble-less
[assemble-examples-readme]: https://github.com/assemble/assemble-examples-readme
[grunt-toc]: https://github.com/assemble/grunt-toc
[helper-lib]: https://github.com/assemble/helper-lib
[grunt-dry]: https://github.com/assemble/grunt-dry
[assemble-examples]: https://github.com/assemble/assemble-examples
