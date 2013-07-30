# Usage Examples

```js
less: {
  development: {
    options: {
      paths: ["assets/css"]
    },
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  },
  production: {
    options: {
      paths: ["assets/css"],
      yuicompress: true
    },
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  }
}
```

## Compile Individual Components

> Compile [Bootstrap's](https://github.com/twbs/bootstrap) LESS components individually.

Using the `imports: {}` option and the "files array format" enables us to compile each Bootstrap
LESS component without having to add `@import "variables.less";` and `@import "mixins.less";` to
every file.

```javascript
less: {
  options: {
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