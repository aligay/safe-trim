import fs from 'fs'
import path from 'path'
import Uglify from 'uglify-js'
import gzipSize from 'gzip-size'

export function getConfig () {
  const userConfig = require('./index')
  return userConfig
}

export function getSize (code) {
  return `${(code.length / 1024).toFixed(2)}kb`
}

export function blue (str) {
  return `\x1b[1m\x1b[34m${String(str)}\x1b[39m\x1b[22m`
}

export function red (str) {
  return `\x1b[1m\x1b[31m${String(str)}\x1b[39m\x1b[22m`
}

export function camelize (str) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase()
  })
}

export function getGzipSize (path) {
  return read(path).then(string => {
    return `${(gzipSize.sync(string) / 1024).toFixed(2)}kb`
  })
}

export function write (dest, code) {
  const projectRoot = path.resolve(__dirname, '../')
  dest = path.resolve(projectRoot, dest)
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, code, err => {
      if (err) {
        console.error(red(JSON.stringify(err, null, 2)))
        return reject(err)
      }
      console.log(`${blue(dest)} ${getSize(code)}`)
      resolve()
    })
  })
}

export function read (dest, code) {
  const projectRoot = path.resolve(__dirname, '../')
  dest = path.resolve(projectRoot, dest)
  return new Promise((resolve, reject) => {
    fs.readFile(dest, 'utf8', (err, data) => {
      if (err) {
        console.error(red(JSON.stringify(err, null, 2)))
        reject(err)
      }
      resolve(data)
    })
  })
}

export function uglify (code) {
  return Uglify.minify(code, {fromString: true}).code
}
