# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %})  [![Build Status](https://travis-ci.org/assemble/{%= name %}.png)](https://travis-ci.org/assemble/{%= name %})

> Compile LESS to CSS. Adds experimental features that extend Less.js for maintaining UI components and themes. From Jon Schlinkert, core team member of Less.js.

This project is a fork of the popular [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less) by the talented [Tyler Kellen](http://goingslowly.com/). Please use that plugin if you require something stable and dependable.

## Getting Started

{%= _.doc("getting-started.md") %}

## Less task
_Run this task with the `grunt less` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options
{%= _.doc("options.md") %}

### Usage Examples
{%= _.doc("examples.md") %}

## Release History
{%= _.include("release-history.md") %}

## Authors
This project is a fork of the popular [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less) by [Tyler Kellen](http://goingslowly.com/). Please use that plugin if you require something stable and dependable.

This fork is maintained by:
{%= _.contrib("authors.md") %}

## License
{%= copyright %}
{%= license %}

***

{%= _.include("footer.md") %}

[1]: https://github.com/assemble/assemble-less/blob/master/test/fixtures/data/palette.yml
[2]: https://github.com/assemble/assemble-less/blob/master/test/fixtures/templates-palette.less
[3]: http://gruntjs.com/api/grunt.template
[4]: http://gruntjs.com/api/grunt.template#grunt.template.process