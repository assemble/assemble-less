
### Task Options

> Options developed specifically for the `assemble-less` plugin

      libs: './src/bootstrap',
      version: './test/versions/1.3.3', // 'less-ref-test'
      globals: [],
      concat: true,
      compress: false,
      processImports: true,
      stripComments: false,
      strictMaths: false,
      strictUnits: false

#### version
Type: `String`
Default: _1.3.3_

Specify the path to the Less.js version that you wish to use for compiling to CSS. You may specify a different version for each target, this can be useful for testing if a new version produces different output than the previous. 

#### banner
Type: `String`
Default: _empty string_

This string will be prepended to the beginning of the concatenated output. It is processed using [grunt.template.process][], using the default options. This can be used for adding code comments to the output, or for prepending `@import` statements onto each file in a target.

(Banner and process options adapted from [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat). Default processing options are explained in the [grunt.template.process][] documentation)

#### process
Type: `Boolean` `Object`
Default: `false`

Process source files as [templates][] before concatenating.

* `false` - No processing will occur.
* `true` - Process source files using [grunt.template.process][] defaults.
* `options` object - Process source files using [grunt.template.process][], using the specified options.
* `function(src, filepath)` - Process source files using the given function, called once for each file. The returned value will be used as source code.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

  [templates]: https://github.com/gruntjs/grunt/wiki/grunt.template
  [grunt.template.process]: https://github.com/gruntjs/grunt/wiki/grunt.template#wiki-grunt-template-process


#### libs (experimental)
Type: `String`
Default: _undefined_

Path to library of `.less` files to use. This feature is in anticipation of the new `@import` directives introduced to Less.js in version 1.4.0 and 1.4.1. Behavior is unpredictable. 

#### lessrc (next release)
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
  "globals": null,
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

#### globals
Type: `String|Array`
Default: _empty string_

Specified files will be _prepended_ to the beginning of src files, **_not_** to the concatenated output. This feature is useful for "inlining" globaly-required LESS files, such as `variables` or `mixins`, so that _they do not need to be referenced with `@import` statements inside any individual files_.

#### concat
Type: `Boolean`
Default: _true_

Concatenate all source files by default. If you change the value to false, all source files will compile into individual files.



### Less Options

> These options are from the Less.js parser and compiler and will be passed through directly to [Less.js](http://github.com/cloudhead/less.js)

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


### Under consideration

#### variables (under consideration)
Type: `Object`
Default: _null_

Data object for defining global variables inside the Gruntfile which will be accessible in LESS files.  


#### imports (under consideration)
Type: `String|Array`
Default: _null_

Prepend one or more `@import` statements to each `src` file in a target. Would also allow specifying new `@import` directives planned for release in LESS v1.4.0:

* `inline`
* `less`
* `css`
* `mixins`

This feature would probably replace the `globals` feature. 

---
