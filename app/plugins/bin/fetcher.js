/*
 * Copyright 2017 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const debug = require('debug')('fetcher')
const fs = require('fs')
const path = require('path')
const needle = require('needle')
const extract = require('extract-zip')
const spawn = require('child_process').spawn

/**
 * Initiate a fetch
 *
 */
const fetch = (stagingArea, url, file) => new Promise((resolve, reject) => {
  const tmp = path.join(stagingArea, file)
  const out = fs.createWriteStream(tmp)

  debug('fetch', tmp, url)

  needle
    .get(url)
    .pipe(out)
    .on('error', err => {
      console.error(err)
      reject(err)
    })
    .on('finish', () => resolve(tmp))
})

const fetchAndExtract = (stagingArea, fetchLock, doneLock, url, file) => fetch(stagingArea, url, file).then(filepath => {
  debug('fetchAndExtract extracting', filepath)

  const rm = filepath => new Promise((resolve, reject) => {
    fs.unlink(filepath, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
  const rmdir = filepath => new Promise((resolve, reject) => {
    fs.rmdir(filepath, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
  const removeTemps = result => Promise.all([rm(filepath), rmdir(fetchLock)]).then(() => result)

  return new Promise((resolve, reject) => {
    const done = () => {
      fs.mkdir(doneLock, err => {
        if (err) {
          reject(err)
        } else {
          resolve(filepath)
        }
      })
    }

    if (filepath.endsWith('.zip')) {
      debug('extracting zip')

      extract(filepath, { dir: stagingArea }, err => {
        if (err) {
          console.error(err)
          reject(new Error(`error unzipping ${err}`))
        } else {
          done()
        }
      })
    } else {
      debug('extracting tarball')

      const child = spawn('tar', ['jxf', filepath], { cwd: stagingArea,
        stdio: 'inherit' })
      child.on('close', (code, signal) => {
        if (code !== 0) {
          reject(new Error(`error untarring ${code} ${signal}`))
        } else {
          done()
        }
      })
    }
  }).then(removeTemps, removeTemps)
})

fetchAndExtract(...process.argv.slice(2))
