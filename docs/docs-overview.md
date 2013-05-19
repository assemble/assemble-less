
In your project's Gruntfile, the `less` task is already configured with a number of build `targets`. This is for convenience to show you how to create your own tests:

```js
grunt.initConfig({
  // This is a task
  less: {
    options: {
      // Task-specific options go here.
    },
    // This is a target
    example: {
      options: {
        // Target-specific options go here.
      },
      files: {
        'dest/files': ['source/files/*.*']
      }
    }
  },
  jshint: {
    ...
  }
});
grunt.loadNpmTasks('assemble-less');

grunt.registerTask('default', [
  'jshint', 
  'less'
]);
```
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


