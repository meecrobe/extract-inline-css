export declare type ExtractType = void | {
    html: string;
    css: string;
};
export declare type Options = {
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
export default function extract(filePath: string, options?: Options): ExtractType;
