"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageHandle = void 0;
const pluginutils_1 = require("@rollup/pluginutils");
const path_1 = require("path");
const fs_1 = require("fs");
const defaults = {
    exclude: 'node_modules/**',
    include: 'src/**',
    packPath: 'dist/assets',
    alias: {}
};
const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};
const dirname = (0, path_1.resolve)(__dirname);
const dest = dirname.match(/.*(?=\/node_modules)/)[0] ? dirname.match(/.*(?=\/node_modules)/)[0] : '';
function computePath(firstPath, twoPath, alias) {
    if (!(0, path_1.isAbsolute)(firstPath)) {
        throw '第一个路径要为绝对路径';
    }
    const twoPathFirst = twoPath.match(/.*?(?<=\/)/)[0];
    const firstObj = (0, path_1.parse)(firstPath);
    if (!alias[twoPathFirst]) {
        return (0, path_1.join)(firstObj.dir, twoPath);
    }
    return (0, path_1.join)(dest, twoPath.replace(twoPathFirst, alias[twoPathFirst]));
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
function imageHandle(options) {
    options = Object.assign({}, defaults, options);
    const { alias, packPath } = options;
    const filter = (0, pluginutils_1.createFilter)(options.include, options.exclude);
    const packPathParse = (0, path_1.parse)(packPath);
    createFile((0, path_1.join)(dest, packPathParse.dir));
    createFile((0, path_1.join)(dest, packPath));
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
                const path = computePath(id, str.substr(1, str.length - 2), alias);
                (0, fs_1.copyFileSync)(path, (0, path_1.join)(dest, `./${packPath}/${p2}`));
                return `'./${packPathParse.base}/${p2}'`;
            });
            return { code, map: { mappings: '' } };
        }
    };
}
exports.imageHandle = imageHandle;
;
