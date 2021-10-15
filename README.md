### rollup 插件

#### 处理 js 中的图片

## 参数

```ts
// 参数设置
options = {
  // 别名参数 默认值{}
  alias?: {
    [propName:string]: string
  },
  // 图片打包的位置 默认值: dist/assetss
  packPath?: string;
  // 排除参数 默认值: node_modules/**
  exclude?: string | RegExp;
  // 包含参数 默认值: src/**
  include?: string | RegExp;
}
```

## 使用方法

```jsx
const { imageHandle } = require("rollup-plugins-csc-images");

{
  // 插件区使用 
  plugins: [
    // 里面的参数 根据自身项目添加
    imageHandle({
      packPath: 'xxxx',
      alias: {
        xx: 'xxx'
      },
    })
  ]
}


```
