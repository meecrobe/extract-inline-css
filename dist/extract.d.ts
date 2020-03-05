export declare type ExtractType = void | {
    html: string;
    css: string;
};
export declare type Options = {
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
export default function extract(
/** Path to HTML file */
filePath: string, 
/** Options */
options?: Options): ExtractType;
