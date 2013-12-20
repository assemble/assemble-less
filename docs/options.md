## lessrc
Type: `String`

Default: null

A convenience option for externalizing task options into a `.lessrc` or `.lessrc.yml` file. If this file is specified, options defined therein will be used.

## globalVars
Type: `Object`

Default: `undefined`

Prepend variables to source files.

## modifyVars
Type: `Object`

Default: `undefined`

Append variables to source files.

## metadata
Type: `String|Array`

Default: Empty string

Pass metadata as context to Lo-Dash templates embedded in LESS files. The name of the files is used as the first path in the template variables, so if you want to use data from `palette.yml`, your templates would look something like: `<%= palette.foo %>`.

Data may be formatted in `JSON`, `YAML`. See [this YAML example][1] and [this LESS example][2].

_Note that data passed into `options.metadata` is merged at the task and target levels. You can turn this off by adding `options: {merge: false}`, which then disables merging and allows targets to override any data passed in at the task-level._

## imports
Type: `Object` (each option accepts a `String` or `Array`)

Default: `null`

Prepend `@import` statements to `src` files using any of the new `@import` directives released after Less.js v1.5.0, `less`, `css`, `inline`, `reference` (`multiple` and `once` probably aren't applicable here, but feel free to use them if you find a use case). See [examples](#usage-examples).

_Any new import directives will be immediately available upon release by Less.js._

## process
Type: `Boolean|Object`

Default: false

Process source files as [templates][3] before concatenating.

* `false` - No processing will occur.
* `true` - Process source files using [grunt.template.process][4] defaults.
* `options` object - Process source files using [grunt.template.process][4], using the specified options.
* `function(src, filepath)` - Process source files using the given function, called once for each file. The returned value will be used as source code.

_(Default processing options are explained in the [grunt.template.process][4] documentation)_

## banner
Type: `String`

Default: Empty string

This string will be prepended to the beginning of the concatenated output. It is processed using [grunt.template.process][4], using the default options.

_(Default processing options are explained in the [grunt.template.process][4] documentation)_

## stripBanners
Type: `Boolean|Object`

Default: false

Strip JavaScript banner comments from source files.

* `false` - No comments are stripped.
* `true` - `/* ... */` block comments are stripped, but _NOT_ `/*! ... */` comments.
* `options` object:
  * By default, behaves as if `true` were specified.
  * `block` - If true, _all_ block comments are stripped.
  * `line` - If true, any contiguous _leading_ `//` line comments are stripped.

## paths
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

#### rootpath
Type: `String`

Default: `""`

A path to add on to the start of every url resource.

## compress
Type: `Boolean`

Default: `false`

Compress output by removing some whitespaces.

#### cleancss
Type: `Boolean`

Default: `false`

Compress output using [clean-css](https://npmjs.org/package/clean-css).

## ieCompat
Type: `Boolean`

Default: `true`

Enforce the css output is compatible with Internet Explorer 8.

For example, the [data-uri](https://github.com/cloudhead/less.js/pull/1086) function encodes a file in base64 encoding and embeds it into the generated CSS files as a data-URI. Because Internet Explorer 8 limits `data-uri`s to 32KB, the [ieCompat](https://github.com/cloudhead/less.js/pull/1190) option prevents `less` from exceeding this.

## optimization
Type: `Integer`

Default: null

Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. This could matter for debugging, or if you want to access the individual nodes in the tree.

## strictImports
Type: `Boolean`

Default: false

Force evaluation of imports.

## strictMath
Type: `Boolean`

Default: `false`

When enabled, math is required to be in parenthesis.

## strictUnits
Type: `Boolean`

Default: `false`

When enabled, less will validate the units used (e.g. 4px/2px = 2, not 2px and 4em/2px throws an error).

## syncImport
Type: `Boolean`

Default: `false`

Read @import'ed files synchronously from disk.

## dumpLineNumbers
Type: `String`

Default: `false`

Configures -sass-debug-info support.

Accepts following values: `comments`, `mediaquery`, `all`.

## relativeUrls
Type: `Boolean`

Default: `false`

Rewrite urls to be relative. false: do not modify urls.

## customFunctions
Type: `Object`

Default: none

Define custom functions to be available within your LESS stylesheets. The function's name must be lowercase and return a primitive type (not an object or array). In the function definition, the first argument is the less object, and subsequent arguments are from the less function call. Values passed to the function are not simple primitive types, rather types defined within less. See the LESS documentation for more information on the available types.

## report
Choices: `false`|`'min'`|`'gzip'`

Default: `false`

Either do not report anything, report only minification result, or report minification and gzip results. This is useful to see exactly how well Less is performing, but using `'gzip'` can add 5-10x runtime task execution.

Example ouput using `'gzip'`:

```
Original: 198444 bytes.
Minified: 101615 bytes.
Gzipped:  20084 bytes.
```

## sourceMap
Type: `Boolean`

Default: `false`

Enable source maps.

## sourceMapFilename
Type: `String`

Default: none

Write the source map to a separate file with the given filename.

## sourceMapURL
Type: `String`

Default: none

Override the default url that points to the sourcemap from the compiled css file.

## sourceMapBasepath
Type: `String`

Default: none

Sets the base path for the less file paths in the source map.

## sourceMapRootpath
Type: `String`

Default: none

Adds this path onto the less file paths in the source map.

## outputSourceFiles
Type: `Boolean`

Default: `false`

Puts the less files into the map instead of referencing them.

## version
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