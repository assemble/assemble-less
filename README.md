# assemble-styles

> Compile your styles using JSON and LESS.


`assemble-styles` is a Grunt.js plugin that makes it easy to build LESS/CSS stylesheets and components and themes.

 is more about convention and grunt plugin uses JSON configuration and templates to build LESS and theme source files.


## Options


### Task defaults
Task targets, files and options may be specified according to the Grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


#### flatten
Type: `Boolean`
Default: `false`

Remove anything after (and including) the first "." in the destination path, then append this value.




## Example

### Twitter Bootstrap


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
    }
}
```