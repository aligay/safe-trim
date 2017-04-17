'use strict'
const path = require('path')
const nodeDir = path.resolve(__dirname, '../node_modules')
const projectRoot = path.resolve(__dirname, '../')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const px2rem = require('postcss-px2rem')
const config = require('./index')

module.exports = {
  entry: './' + config.browser,
  output: {
    filename: './' + config.browser
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    root: path.resolve('../src'),
    alias: {
      vue: path.resolve(nodeDir, 'vue/dist/vue.js'),
      vuex: path.resolve(nodeDir, 'vuex/dist/vuex.js')
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.js$/,
      loader: 'rollup',
      exclude: /node_modules/
    }, {
      test: /\.less$/,
      loader: 'style!css?sourceMap!postcss!less?strictMath&noIeCompat&sourceMap'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  rollup: [
    require('rollup-plugin-buble')({
      exclude: 'node_modules/**'
    })
  ],
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  postcss: [
    config.autoprefixer && autoprefixer(config.autoprefixer),
    config.px2rem && px2rem(config.px2rem)
  ].filter(Boolean)
}
