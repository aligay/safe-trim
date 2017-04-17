'use strict'
const config = require('./webpack.base.config')
const merge = require('webpack-merge')
const WebpackNotifierPlugin = require('webpack-notifier')
const pkg = require('../package.json')

module.exports = merge(config, {
  devtool: 'eval-source-map',
  plugins: [
    new WebpackNotifierPlugin({
      title: `${pkg.name}@${pkg.version}`,
      excludeWarnings: true,
      contentImage: `${__dirname}/logo.png`
    })
  ],
  babel: {
    presets: ['es2015'],
    plugins: ['typecheck', 'transform-flow-strip-types', 'transform-runtime']
  }
})
