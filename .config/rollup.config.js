import {getConfig, getGzipSize, red, blue, write, uglify, camelize} from './util'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import px2rem from 'postcss-px2rem'
import vue from 'rollup-plugin-vue'
import less from 'rollup-plugin-less'
import buble from 'rollup-plugin-buble'
import replace from 'rollup-plugin-replace'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from '../package.json'
const rollup = require('rollup')

process.env.NODE_ENV = 'production'

class Build {
  constructor () {
    this.config = getConfig(require('./index'), pkg)
    this.banner =
`/*!
 * ${this.config.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.contributors.join(' ')}
 * Released under the ${pkg.license} License.
 */`
    this._rollupConfig = {
      entry: this.config.entry,
      plugins: [
        this.config.nodeResolve && nodeResolve({
          jsnext: true,
          main: true
        }),
        this.config.nodeResolve && commonjs({
          include: 'node_modules/**',
          extensions: [ '.js', '.coffee' ],
          ignoreGlobal: false,
          sourceMap: false
        }),

        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),

        vue({
          compileTemplate: false,
          css: this.config.output_css,
          htmlMinifier: {
            minifyCSS: true,
            minifyJS: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,

            html5: true,
            processConditionalComments: true,
            processScripts: [
              'text/html'
            ],
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeTagWhitespace: true,
            useShortDoctype: true
          }
        }),

        less({
          insert: false,
          output: this.config.output_css
        }),

        postcss([
          autoprefixer(this.config.autoprefixer),
          this.config.px2rem && px2rem(this.config.px2rem)
        ].filter(Boolean)),

        buble()
      ].filter(Boolean)
    }
  }

  async run () {
    try {
      const bundle = await rollup.rollup(this._rollupConfig)
      await Promise.all([
        this.genCommon(bundle),
        this.genUmd(bundle),
        this.genEs(bundle)
      ])
      await Promise.all([
        this.genMin(this.umd),
        this.genCmd(this.common),
        this.genMui(this.common)
      ])

      if (this.config.outputMin) {
        const size = await getGzipSize(this.config.outputMin)
        console.log(red('gzip:') + ' ' + blue(size))
      }
    } catch (e) {
      console.error(red(e))
    }
  }

  async genCommon (bundle) {
    this.common = bundle.generate({
      banner: this.banner,
      useStrict: false,
      format: 'cjs'
    }).code
    this.config.outputCommon && await write(this.config.outputCommon, this.common)
  }

  async genUmd (bundle) {
    this.umd = bundle.generate({
      banner: this.banner,
      useStrict: false,
      format: 'umd',
      moduleName: camelize(this.config.name)
    }).code
    this.config.output && await write(this.config.output, this.umd)
  }

  async genEs (bundle) {
    this.es = bundle.generate({
      banner: this.banner,
      useStrict: false,
      format: 'es'
    }).code
    this.config.outputEs && await write(this.config.outputEs, this.es)
  }

  async genMin (umd) {
    if (!this.config.outputMin) return
    this.min = uglify(umd)
    await write(this.config.outputMin, this.min)
  }

  async genCmd (common) {
    if (!this.config.outputCmd) return
    this.cmdMin = uglify(`
      define('${pkg.group}/${this.config.name.toLowerCase()}/${pkg.version}/index.cmd.js', function(require, exports, module) {
        ${common}
      })
    `)
    await write(this.config.outputCmd, this.cmdMin)
  }

  async genMui (common) {
    if (!this.config.outputMui) return
    const dName = `${pkg.group}/${this.config.name.toLowerCase()}`
    this.muiMin = uglify(`
      define('${dName}/index.mui', function(require, exports, module) {
        ${common}
      })
    `)
    let seed = {
      combine: true,
      modules: {},
      packages: {
        [dName]: {
          debug: true,
          group: 'tm',
          ignorePackageNameInUri: true,
          path: `//g.alicdn.com/${dName}/${pkg.version}/`,
          version: pkg.version
        }
      }
    }

    await Promise.all([
      write(this.config.outputMui, this.muiMin),
      write(`${this.config.outputPath}/seed.json`, JSON.stringify(seed)),
      write(`${this.config.outputPath}/seed.js`, uglify(`KISSY.config(${JSON.stringify(seed)})`))
    ])
  }
}

new Build().run()
