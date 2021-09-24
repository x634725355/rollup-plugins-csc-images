export declare function handle(options: any): {
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
