"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var js_beautify_1 = __importDefault(require("js-beautify"));
var defaultOptions = {
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
function extract(filePath, options) {
    if (!filePath) {
        throw new Error("'filePath' argument is not provided.");
    }
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error(filePath + " file not found.");
    }
    var _options = __assign(__assign({}, defaultOptions), options);
    var $ = cheerio_1.default.load(fs_1.default.readFileSync(filePath));
    var css = '';
    if (_options.extractGlobalStyles) {
        $('style').each(function (_, el) {
            var $this = $(el);
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
    $('[style]').each(function (_, el) {
        var $this = $(el);
        if (!$this.attr('style').length) {
            if (!_options.keepStyleAttribute) {
                $this.removeAttr('style');
            }
            return;
        }
        var className = $this.get(0).tagName + "_" + uid();
        css += "." + className + " { " + $this.attr('style') + " }";
        if (!_options.keepStyleAttribute) {
            $this.removeAttr('style');
        }
        $this.addClass(className);
    });
    if (css.length) {
        var formattedCss = _options.formatCss
            ? js_beautify_1.default.css(css, {
                indent_size: 2
            })
            : css;
        var formattedHtml = _options.formatHtml
            ? js_beautify_1.default.html($.html(), {
                indent_size: 2
            })
            : $.html();
        if (_options.out === 'file') {
            if (!fs_1.default.existsSync(_options.dist)) {
                fs_1.default.mkdir(path_1.default.join(_options.dist), { recursive: true }, function (err) {
                    if (err)
                        throw err;
                });
            }
            fs_1.default.writeFileSync(path_1.default.join(_options.dist + "/" + _options.cssFilename), formattedCss);
            fs_1.default.writeFileSync(path_1.default.join(_options.dist + "/" + _options.htmlFilename), formattedHtml);
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
    return Math.round(Math.random() * Math.pow(36, 6)).toString(36);
}
//# sourceMappingURL=index.js.map