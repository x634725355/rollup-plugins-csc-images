import { createFilter } from '@rollup/pluginutils';
import { isAbsolute, parse, join } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
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
__dirname = "/Users/zhaolinjie/MyCode/my-other/DDD/d-d-d/node_modules";
console.log('当前路径', __dirname);
const dest = __dirname.match(/.*(?=\/node_modules)/)[0] ? __dirname.match(/.*(?=\/node_modules)/)[0] : '';
function computePath(firstPath, twoPath, alias) {
    if (!isAbsolute(firstPath)) {
        throw '第一个路径要为绝对路径';
    }
    const twoPathFirst = twoPath.match(/.*?(?<=\/)/)[0];
    const firstObj = parse(firstPath);
    if (!alias[twoPathFirst]) {
        return join(firstObj.dir, twoPath);
    }
    return join(dest, twoPath.replace(twoPathFirst, alias[twoPathFirst]));
}
function createFile(path) {
    try {
        if (!existsSync(path)) {
            mkdirSync(path);
        }
    }
    catch (err) {
        console.error('报错了', err);
    }
}
export function imageHandle(options) {
    options = Object.assign({}, defaults, options);
    const { alias, packPath } = options;
    const filter = createFilter(options.include, options.exclude);
    const packPathParse = parse(packPath);
    createFile(join(dest, packPathParse.dir));
    createFile(join(dest, packPath));
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
                copyFileSync(path, join(dest, `./${packPath}/${p2}`));
                return `'./${packPathParse.base}/${p2}'`;
            });
            return { code, map: { mappings: '' } };
        }
    };
}
;
