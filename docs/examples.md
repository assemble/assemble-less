> Basic config for compiling LESS to CSS.

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

## lessrc

A `.lessrc` file must contain valid JSON and look something like this:

```json
{
  "compress": true,
  "metadata": "src/*.{json,yml}",
  "paths": ["vendor/bootstrap/less"]
}
```

A `.lessrc.yml` must contain valid YAML and look something like this:

```yaml
compress: true
paths:
- vendor/bootstrap/less
```

## Import directives

> Prepend `@import` statements to `src` files using any of the new `@import` directives released after Less.js v1.5.0.

Options are:

* `reference`: use a less file but do not output it
* `inline`: include the source file in the output but do not process as less
* `less`: treat the file as a less file, no matter what the file extension
* `css`: treat the file as a css file, no matter what the file extension

```javascript
less: {
  options: {
    paths: 'vendor/bootstrap/less',
    imports: {
      reference: ['variables.less', 'mixins.less'],
      inline: ['normalize.css'],
      less: ['normalize.css'],
      css: ['foo.css', 'bar.css']
    }
  },
  files: {}
}
```

## Compile individual bootstrap components

> Use import directives to compile each [Bootstrap's](https://github.com/twbs/bootstrap) LESS components separately.

Using the `imports: {}` option and the "files array format" enables us to compile each Bootstrap LESS component without having to add `@import "variables.less";` and `@import "mixins.less";` to
every file.

```javascript
less: {
  options: {
    paths: 'vendor/bootstrap/less',
    imports: {
      reference: ['variables.less', 'mixins.less'],
    }
  },
  components: {
    files: [
      { expand: true, cwd: 'vendor/bootstrap/less', src: '*.less', dest: 'assets/css/', ext: '.css' }
    ]
  }
}
```

## Pass metadata to Lo-Dash templates

Use the `metadata` option to pass context to Lo-Dash templates before compiling. For example, let's say you have a config like this:

```javascript
less: {
  options: {
    metadata: 'src/*.{json,yml}'
  },
  styles: {
    files: {
      'css/style.css': ['src/style.less']
    }
  }
}
```

and a data file, `palette.yml`, with some variables defined:

```yaml
# palette.yml
info:    '#000'
warning: '#111'
danger:  '#222'
success: '#333'
```

Then in our LESS file:

```scss
// Use as values to variables
@palette-info:    <%= palette.info %>;
@palette-warning: <%= palette.warning %>;

.swatch-info {
  background: @palette-info;
}
.swatch-warning {
  background: @palette-warning;
}

// or directly as variables
.swatch-danger {
  background: <%= palette.danger %>;
}
.swatch-success {
  background: <%= palette.success %>;
}
```
