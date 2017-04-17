/*
[name].js // umd 未压缩
[name].min.js // umd 压缩
[name].cmd.js // 已压缩 加 warning
[name].mui.js // 已压缩，配置后还会额外生成 seed.json 和 seed.js
[name].common.js // 不压缩
*/

'user strict'
const pkg = require('../package.json')
// 默认模块名取 package.js 的 name，但有特殊需求，需要声明 package.name 和包名不一致，使用 x-name
const name = pkg['x-name'] || pkg.name
const outputPath = 'dist'
module.exports = {
  name: name,
  outputPath: outputPath,
  entry: 'src/index.js',
  output: `${outputPath}/${name}.js`,
  outputMin: `${outputPath}/${name}.min.js`,
  outputCommon: `${outputPath}/${name}.common.js`,
  outputEs: `${outputPath}/${name}.es.js`,
  // outputCmd: `${outputPath}/${name}.cmd.js`,
  // outputMui: `${outputPath}/${name}.mui.js`,
  browser: 'test/browser.js',
  nodeResolve: true, // 是否把 node_modules 中的 js 也 inline, 默认 true
  autoprefixer: {
    browsers: ['Android >= 4', 'iOS >= 7', 'IE >= 9', 'Firefox >= 50', 'Chrome >= 21']
  }
// px2rem: {remUnit: 100, baseDpr: 1} // 开启后需在页面中加入 `!function (t) {t.style.fontSize = t.getBoundingClientRect().width / 3.75 + 'px'}(document.documentElement)`
}
