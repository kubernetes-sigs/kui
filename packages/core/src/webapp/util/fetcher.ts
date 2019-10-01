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

import Debug from 'debug'
import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as needle from 'needle'
import * as extract from 'extract-zip'

const debug = Debug('fetcher')

/**
 * Initiate a fetch
 *
 */
const fetchElectron = (stagingArea: string, url: string, file: string) =>
  new Promise<string>((resolve, reject) => {
    const tmp = path.join(stagingArea, file)
    const out = fs.createWriteStream(tmp)

    debug('fetchElectron', tmp, url)

    needle
      .get(url)
      .pipe(out)
      .on('error', (err: Error) => {
        console.error(err)
        reject(err)
      })
      .on('finish', () => resolve(tmp))
  })

const fetchAndExtract = (stagingArea: string, fetchLock: string, doneLock: string, url: string, file: string) =>
  fetchElectron(stagingArea, url, file).then(filepath => {
    debug('fetchAndExtract extracting', filepath)

    const rm = (filepath: string) =>
      new Promise<void>((resolve, reject) => {
        fs.unlink(filepath, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    const rmdir = (filepath: string) =>
      new Promise<void>((resolve, reject) => {
        fs.rmdir(filepath, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    const removeTemps = (result: string): Promise<string> =>
      Promise.all([rm(filepath), rmdir(fetchLock)]).then(() => result)

    return new Promise<string>((resolve, reject) => {
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

        extract(filepath, { dir: stagingArea }, (err: Error) => {
          if (err) {
            console.error(err)
            reject(new Error(`error unzipping ${err}`))
          } else {
            done()
          }
        })
      } else {
        debug('extracting tarball')

        const child = spawn('tar', ['jxf', filepath], {
          cwd: stagingArea,
          stdio: 'inherit'
        })
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

const stagingArea = process.argv[2]
const fetchLock = process.argv[3]
const doneLock = process.argv[4]
const url = process.argv[5]
const file = process.argv[6]
fetchAndExtract(stagingArea, fetchLock, doneLock, url, file)
