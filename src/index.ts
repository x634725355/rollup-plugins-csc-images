import { createFilter } from '@rollup/pluginutils';
import { isAbsolute, parse, join, resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

interface Options {
  alias?: {
    [propName:string]: string
  },
  packPath?: string;
  exclude?: string | RegExp;
  include?: string | RegExp;
}

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

const dirname = resolve(__dirname);

const dest = dirname.match(/.*(?=[\/\\]node_modules)/)[0] ? dirname.match(/.*(?=[\/\\]node_modules)/)[0] : '';

/**
 * 基于第一个路径返回第二个路径的绝对路径
 * @param {string} firstPath 第一个路径必须是绝对路径
 * @param {string} twoPath 第二个路径为相对路径
 * @param {Object} alias 别名对象
 */
function computePath(firstPath: string, twoPath: string, alias: {[propName:string]: string}) {
  if (!isAbsolute(firstPath)) { throw '第一个路径要为绝对路径'; }
  const twoPathFirst = twoPath.match(/.*?(?<=\/)/)[0];
  const firstObj = parse(firstPath);

  if (!alias[twoPathFirst]) { return join(firstObj.dir, twoPath); }

  return join(dest, twoPath.replace(twoPathFirst, alias[twoPathFirst]));
}

/**
 * 按照路径创建文件夹
 * @param {string} path 路径
 */
function createFile(path) {
  try {
    if (!existsSync(path)) {
      mkdirSync(path)
    }
  } catch (err) {
    console.error('报错了',err)
  }
}

export function imageHandle(options: Options) {
  options = Object.assign({}, defaults, options);
  const { alias, packPath } = options;
  const filter = createFilter(options.include, options.exclude);
  const packPathParse = parse(packPath);
  // const packageJson = require(join(dest, 'package.json'));


  createFile(join(dest, packPathParse.dir));
  createFile(join(dest, packPath));

  return {
    name: 'rollup-plugins-csc-images',
    resolveId(id) {
      // if (packageJson) {
      //   const dependenciesNameArr = Object.keys(packageJson.dependencies);
      //   const dependenciesRegExp = new RegExp(`.(${dependenciesNameArr.join('|')})`);
      //   if (dependenciesRegExp.test(id)) {
      //     return { id, external: true };
      //   }
      // }

      const reg = /\.(png|jpg|jpge|gif|svg|webp)/;
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

        copyFileSync(path, join(dest, `./${packPath}/${p2}`))

        return `'./${packPathParse.base}/${p2}'`;
      });

      return { code, map: { mappings: '' } };
    }
  };
};
