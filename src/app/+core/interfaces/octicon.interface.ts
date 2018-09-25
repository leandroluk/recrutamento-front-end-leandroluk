export interface IOcticon {
    keywords?: string[];
    path?: string;
    height?: number;
    width?: number;
    symbol?: string;
    options?: {
        version?: string;
        width?: number;
        height?: number,
        viewBox?: string,
        class?: string,
        'aria-hidden'?: boolean
    },
    toSVG(): string;
}