import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import beautify from 'js-beautify';

export type ExtractType = void | { html: string; css: string };

export type Options = {
  cssFilename?: string;
  dist?: string;
  extractGlobalStyles?: boolean;
  formatCss?: boolean;
  formatHtml?: boolean;
  htmlFilename?: string;
  keepStyleAttribute?: boolean;
  keepStyleTags?: boolean;
  out?: 'file' | 'object';
};

const defaultOptions: Required<Options> = {
  cssFilename: 'extracted.css',
  dist: '.',
  extractGlobalStyles: true,
  formatCss: true,
  formatHtml: false,
  htmlFilename: 'output.html',
  keepStyleAttribute: false,
  keepStyleTags: false,
  out: 'file'
};

export default function extract(
  filePath: string,
  options?: Options
): ExtractType {
  if (!filePath) {
    throw new Error(`'filePath' argument is not provided.`);
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`${filePath} file not found.`);
  }

  const _options: Required<Options> = { ...defaultOptions, ...options };

  const $ = cheerio.load(fs.readFileSync(filePath));

  let css = '';

  if (_options.extractGlobalStyles) {
    $('style').each((_, el) => {
      const $this = $(el);

      if (!$this.text().length) {
        if (!_options.keepStyleTags) {
          $this.remove();
        }

        return;
      }

      css += $this.text();

      if (!_options.keepStyleTags) {
        $this.remove();
      }
    });
  }

  $('[style]').each((_, el) => {
    const $this = $(el);

    if (!$this.attr('style')!.length) {
      if (!_options.keepStyleAttribute) {
        $this.removeAttr('style');
      }

      return;
    }

    const className = `${$this.get(0).tagName}_${uid()}`;

    css += `.${className} { ${$this.attr('style')} }`;

    if (!_options.keepStyleAttribute) {
      $this.removeAttr('style');
    }

    $this.addClass(className);
  });

  if (css.length) {
    const formattedCss = _options.formatCss
      ? beautify.css(css, {
          indent_size: 2
        })
      : css;

    const formattedHtml = _options.formatHtml
      ? beautify.html($.html(), {
          indent_size: 2
        })
      : $.html();

    if (_options.out === 'file') {
      if (!fs.existsSync(_options.dist)) {
        fs.mkdir(path.join(_options.dist), { recursive: true }, (err) => {
          if (err) throw err;
        });
      }

      fs.writeFileSync(
        path.join(`${_options.dist}/${_options.cssFilename}`),
        formattedCss
      );

      fs.writeFileSync(
        path.join(`${_options.dist}/${_options.htmlFilename}`),
        formattedHtml
      );
    } else if (_options.out === 'object') {
      return {
        html: formattedHtml,
        css: formattedCss
      };
    }
  }

  console.warn('No CSS extracted.');
}

function uid(): string {
  return Math.round(Math.random() * 36 ** 6).toString(36);
}
