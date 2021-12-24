# extract-inline-css

![Travis (.org)](https://img.shields.io/travis/meecrobe/extract-inline-css)

Extract and replace inline CSS with classnames.

## Installation

```bash
$ yarn add -D extract-inline-css
```

## Usage

```js
import extract from 'extract-inline-css';

extract('./index.html', {
  dist: './dist'
});
```

This will generate `extracted.css` and `result.html` files inside `dist/` directory.

If you want to get results in string format, set `out: 'object'` option:

```js
import extract from 'extract-inline-css';

const { css, html } = extract('./index.html', {
  out: 'object'
});
```

### Input:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        background: #bada55;
      }
    </style>
  </head>
  <body>
    <h1 style="font-size: 22px; line-height: 1.2;">Hello world!</h1>
  </body>
</html>
```

### Output:

`result.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1 class="h1_g4q7h2">Hello world!</h1>
  </body>
</html>
```

`extracted.css`

```css
body {
  background: #bada55;
}

.h1_g4q7h2 {
  font-size: 22px;
  line-height: 1.2;
}
```

## Options

| Option              | Type                       | Default         | Description                                    |
| ------------------- | -------------------------- | --------------- | ---------------------------------------------- |
| cssFilename         | `string`                   | `extracted.css` | Filename of the resulting CSS file             |
| dist                | `string`                   | `.`             | Output directory path                          |
| extractGlobalStyles | `boolean`                  | `true`          | Extract CSS from `<style>` tags                |
| formatCss           | `boolean`                  | `true`          | Beautify CSS output                            |
| formatHtml          | `boolean`                  | `false`         | Beautify HTML output                           |
| htmlFilename        | `string`                   | `output.html`   | Filename of the resulting HTML file            |
| keepStyleAttribute  | `boolean`                  | `false`         | Do not strip 'style' attributes from HTML tags |
| keepStyleTags       | `boolean`                  | `false`         | Do not strip `<style>` tags                    |
| out                 | `'file'` &#124; `'object'` | `file`          | Output format                                  |

## License

MIT
