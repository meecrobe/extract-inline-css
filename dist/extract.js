"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_beautify_1 = __importDefault(require("js-beautify"));
const defaultOptions = {
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
function extract(
/** Path to HTML file */
filePath, 
/** Options */
options) {
    if (!filePath) {
        throw new Error(`'filePath' argument is not provided.`);
    }
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error(`${filePath} file not found.`);
    }
    const _options = { ...defaultOptions, ...options };
    const $ = cheerio_1.default.load(fs_1.default.readFileSync(filePath));
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
        if (!$this.attr('style').length) {
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
            ? js_beautify_1.default.css(css, {
                indent_size: 2
            })
            : css;
        const formattedHtml = _options.formatHtml
            ? js_beautify_1.default.html($.html(), {
                indent_size: 2
            })
            : $.html();
        if (_options.out === 'file') {
            if (!fs_1.default.existsSync(_options.dist)) {
                fs_1.default.mkdir(path_1.default.join(_options.dist), { recursive: true }, (err) => {
                    if (err)
                        throw err;
                });
            }
            fs_1.default.writeFileSync(path_1.default.join(`${_options.dist}/${_options.cssFilename}`), formattedCss);
            fs_1.default.writeFileSync(path_1.default.join(`${_options.dist}/${_options.htmlFilename}`), formattedHtml);
            return;
        }
        else if (_options.out === 'object') {
            return {
                html: formattedHtml,
                css: formattedCss
            };
        }
    }
    console.warn('No CSS extracted.');
}
exports.default = extract;
function uid() {
    return Math.round(Math.random() * 36 ** 6).toString(36);
}
//# sourceMappingURL=extract.js.map