
**assemble-less** is a powerful and flexible [Grunt plugin](http://gruntjs.com/plugins) for compiling LESS to CSS. The `less` task leverages [JSON and Lo-dash templates](http://gruntjs.com/configuring-tasks) for defining any number of LESS "bundles", UI components, compressed stylesheets or themes.

### Companion projects
* [assemble](http://github.com/assemble/assemble): a Grunt plugin for **quickly launching static web projects** by emphasizing a strong separation of concerns between structure, style, content and configuration.
* [less-tests](http://github.com/upside/less-tests): a LESS / CSS test-suite that uses [assemble-less](http://github.com/assemble/assemble-less) to enable you to run any kind of test on LESS stylesheets.


### Credit
This [Grunt.js](http://github.com/gruntjs/grunt) plugin and some of the documentation on this page, is derived from [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less), authored by [Tyler Kellen](https://github.com/tkellen). This plugin was modified for this project to `concat` LESS files first, and then compile them into CSS files. This allows for prepending globally required LESS files, and it also adds the ability to build out individual CSS files, rather than building a single conctatenated file.

