const { createFilter } = require('@rollup/pluginutils');
const { isAbsolute, parse, join } = require('path');
const { copyFileSync, existsSync, mkdirSync } = require('fs');

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

/**
 * 基于第一个路径返回第二个路径的绝对路径
 * @param {string} firstPath 第一个路径必须是绝对路径
 * @param {string} twoPath 第二个路径为相对路径
 */
function computePath(firstPath, twoPath) {
  if (!isAbsolute(firstPath)) { throw '第一个路径要为绝对路径'; }

  const firstObj = parse(firstPath);

  return join(firstObj.dir, twoPath);
}

function createFile(path) {
  try {
    if (!existsSync(path)) {
      mkdirSync(path)
    }
  } catch (err) {
    console.error('报错了',err)
  }
}


module.exports = function () {
  const options = { ...defaults };
  const filter = createFilter(options.include, options.exclude);
  const dest = __dirname.match(/.*(?=\/node_modules)/)[0] ? __dirname.match(/.*(?=\/node_modules)/)[0] : '';
  createFile(join(dest, 'dist'));
  createFile(join(dest, 'dist/assets'));

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

        copyFileSync(path, join(dest, `./dist/assets/${p2}`))

        return `'./assets/${p2}'`;
      });

      return { code, map: { mappings: '' } };
    }
  };
};
