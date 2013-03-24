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


