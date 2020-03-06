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

## Options

| Option              | Type                | Default         | Description                                    |
| ------------------- | ------------------- | --------------- | ---------------------------------------------- |
| cssFilename         | `string`            | `extracted.css` | Filename of the resulting CSS file             |
| dist                | `string`            | `.`             | Output directory path                          |
| extractGlobalStyles | `boolean`           | `true`          | Extract CSS from `<style>` tags                |
| formatCss           | `boolean`           | `true`          | Beautify CSS output                            |
| formatHtml          | `boolean`           | `false`         | Beautify HTML output                           |
| htmlFilename        | `string`            | `result.html`   | Filename of the resulting HTML file            |
| keepStyleAttribute  | `boolean`           | `false`         | Do not strip 'style' attributes from HTML tags |
| keepStyleTags       | `boolean`           | `false`         | Do not strip `<style>` tags                    |
| out                 | `'file' | 'object'` | `file`          | Output format                                  |

## License

MIT
