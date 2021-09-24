"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const pluginutils_1 = require("@rollup/pluginutils");
const path_1 = require("path");
const fs_1 = require("fs");
const defaults = {
    exclude: 'node_modules/**',
    include: 'src/**',
};
const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};
function computePath(firstPath, twoPath) {
    if (!(0, path_1.isAbsolute)(firstPath)) {
        throw '第一个路径要为绝对路径';
    }
    const firstObj = (0, path_1.parse)(firstPath);
    return (0, path_1.join)(firstObj.dir, twoPath);
}
function createFile(path) {
    try {
        if (!(0, fs_1.existsSync)(path)) {
            (0, fs_1.mkdirSync)(path);
        }
    }
    catch (err) {
        console.error('报错了', err);
    }
}
function handle(options) {
    options = { ...defaults, ...options };
    const { alias } = options;
    const filter = (0, pluginutils_1.createFilter)(options.include, options.exclude);
    const dest = __dirname.match(/.*(?=\/node_modules)/)[0] ? __dirname.match(/.*(?=\/node_modules)/)[0] : '';
    createFile((0, path_1.join)(dest, 'dist'));
    createFile((0, path_1.join)(dest, 'dist/assets'));
    return {
        name: 'rollup-plugins-csc-images',
        resolveId(id) {
            const reg = /.(png|jpg|jpge|gif|svg|webp)/;
            if (reg.test(id)) {
                return { id, external: true };
            }
            return null;
        },
        load(id) {
        },
        transform(code, id) {
            if (!filter(id)) {
                return null;
            }
            let reg = /['"](.*\/)(.*\.(png|jpg|jpge|gif))['"]/g;
            code = code.replace(reg, (str, p1, p2) => {
                const path = computePath(id, str.substr(1, str.length - 2));
                (0, fs_1.copyFileSync)(path, (0, path_1.join)(dest, `./dist/assets/${p2}`));
                return `'./assets/${p2}'`;
            });
            return { code, map: { mappings: '' } };
        }
    };
}
exports.handle = handle;
;
