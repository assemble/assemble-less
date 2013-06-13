
#### Compile

```javascript
less: {
  components: {
    files: {
      'selectors.css': ['selectors.less']
    }
  }
}
```

#### Example of the `imports` option

In this example, the `paths` and `imports.less` options are used:

```js
less: {
  options: {
    paths: 'vendor/bootstrap/less',
    imports: {
      less: ['mixins.less', 'variables.less']
    }
  },
  bootstrap: {
    src:  'vendor/bootstrap/less/bootstrap.less',
    dest: 'test/css/bootstrap.css'
  },
  alerts: {
    src:  'vendor/bootstrap/less/alerts.less',
    dest: 'test/css/alerts.css'        
  },
  buttons: {
    src:  'vendor/bootstrap/less/buttons.less',
    dest: 'test/css/buttons.css'        
  }
}
```

#### Compile multiple files individually

Use the files array format to compile each file in a given target to separate CSS files. Using [Bootstrap](https://github.com/twitter/bootstrap) as the example, this option (along with the `imports` option) will enable you to compile all of the Bootstrap LESS components without having to use the `bootstrap.less` manifest file.

```javascript
less: {
  components: {
    files: [
      { expand: true, cwd: 'vendor/bootstrap/less', src: '*.less', dest: 'assets/css/', ext: '.css' }
    ]
  }
}
```

Or you can use the "files object" format to specify multiple "src-dest pairings" in each target:

```javascript
less: {
  components: {
    files: {
      'test.css': ['test.less'],
      'mixins.css': ['mixins.less']
    }
  }
}
```

#### Concatenate and Compile

As an alternative to using `@import` to "inline" `.less` files, you can specify an array of `src` paths and they will be concatenated. 

```javascript
less: {
  components: {
    files: {
      'test.css': ['reset.less', 'test.less']
    }
  }
}
```

Grunt supports filename expansion (also know as globbing) via the built-in [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) libraries. So Templates may be used in filepaths or glob patterns.

```
less: {
  options: {
    concat: true,
    paths: 'vendor/bootstrap/less',
    imports: {
      less: ['mixins.less', 'variables.less']
    }
  },
  components: {
    files: [
      { expand: true, cwd: 'vendor/bootstrap/less', src: '*.less', dest: 'assets/css/', ext: '.css' }
    ]      
  }
}
```
For more on glob pattern syntax, see the [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) documentation.
