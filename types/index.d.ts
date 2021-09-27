interface Options {
    alias?: {
        [propName: string]: string;
    };
    packPath?: string;
    exclude?: string;
    include?: string;
}
export declare function imageHandle(options: Options): {
    name: string;
    resolveId(id: any): {
        id: any;
        external: boolean;
    };
    load(id: any): void;
    transform(code: any, id: any): {
        code: any;
        map: {
            mappings: string;
        };
    };
};
export {};
