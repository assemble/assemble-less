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
      compress: true
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

## Pass in data from JSON or YAML

Using the `metadata` option we can pass in external data before compiling.

```javascript
less: {
  options: {
    metadata: 'src/data/*.{yml,json}'
  },
  components: {
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  }
}
```

In our data file, `palette.yml`, we would define our variables:

```yaml
black:       '000'
gray-darker: '111'
gray-dark:   '222'
gray:        '333'
```
Then in our LESS file:

```scss
@palette-info:    #<%= palette.info %>;
@palette-warning: #<%= palette.warning %>;
@palette-danger:  #<%= palette.danger %>;
@palette-success: #<%= palette.success %>;
```