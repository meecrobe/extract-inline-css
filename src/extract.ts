import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import beautify from 'js-beautify';

export type ExtractType = void | { html: string; css: string };

export type Options = {
  /** Filename of the resulting CSS file */
  cssFilename?: string;
  /** Output directory path */
  dist?: string;
  /** Extract CSS from <style> tags */
  extractGlobalStyles?: boolean;
  /** Beautify CSS output */
  formatCss?: boolean;
  /** Beautify HTML output */
  formatHtml?: boolean;
  /** Filename of the resulting HTML file */
  htmlFilename?: string;
  /** Do not strip 'style' attributes from HTML tags */
  keepStyleAttribute?: boolean;
  /** Do not strip <style> tags */
  keepStyleTags?: boolean;
  /** Output format */
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
  /** Path to HTML file */
  filePath: string,
  /** Options */
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

      return;
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
