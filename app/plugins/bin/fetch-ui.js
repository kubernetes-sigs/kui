/*
 * Copyright 2017-18 IBM Corporation
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

const debug = require('debug')('fetch-ui')
const mkdirp = require('mkdirp-promise')

const variants = {
  win32: 'win32-x64.zip',
  linux: 'linux-x64.zip',
  darwin: 'darwin-x64.tar.bz2'
}

/**
 * If package.json shows that we're running a dev verison, then use
 * the 'dev' bucket.
 *
 */
const versionFromPackageJson = () => require('../../package.json')

/**
 * Return the COS bucket for this version
 *
 */
const bucket = version => {
  if (version.indexOf('-dev.') > 0) {
    return 'dev'
  } else {
    return version
  }
}

/**
 * Read version from env vars
 *
 */
const versionFromEnv = process.env.VERSION && { version: process.env.VERSION }

const { version } = versionFromEnv || versionFromPackageJson()
const baseURL = 'https://s3-api.us-geo.objectstorage.softlayer.net/kui'
const { productName } = require('../../build/config.json')
const file = `${encodeURIComponent(productName)}-${variants[process.platform]}`
const url = `${baseURL}-${bucket(version)}/${file}`

const fs = require('fs')
const spawn = require('child_process').spawn
const path = require('path')

const appDir = `${productName}-${process.platform}-x64`
const app = {
  win32: productName,
  linux: productName,
  darwin: path.join(`${productName}.app`, 'Contents', 'MacOS', productName)
}

/**
 * Wait for fetch to complete
 *
 */
const waitForDone = (notifyOfProgress, stagingArea, doneLock) => new Promise((resolve, reject) => {
  const iter = (idx, doneMessageNeeded = false) => {
    debug('waiting for completion')

    try {
      fs.stat(doneLock, (err, stats) => {
        if (stats) {
          const result = path.join(stagingArea, appDir, app[process.platform])
          debug('completed', result)

          if (notifyOfProgress && doneMessageNeeded) {
            console.log(' Done.'.green) // clear the waiting message with a newline
          }

          resolve(result)
        }
        if (err) {
          if (notifyOfProgress) {
            if (idx === 0) {
              process.stdout.write('Waiting for UI components to download')
            } else if (idx % 5 === 2) {
              process.stdout.write('.')
            }
          }

          setTimeout(() => iter(idx + 1, idx === 0), 500)
        }
      })
    } catch (err) {
      reject(err)
    }
  }

  iter(0)
})

/**
 * If we're not done downloading, either wait for completion of the
 * download, or initiate a download
 *
 */
const doneWaitOrFetch = (notifyOfProgress = false) => stagingArea => new Promise((resolve, reject) => {
  debug('doneWaitOrFetch', notifyOfProgress, stagingArea)

  if (!stagingArea) {
    return reject(new Error('no staging area specified'))
  }

  stagingArea = path.join(stagingArea, version)
  debug('stagingArea', stagingArea)

  const doneLock = path.join(stagingArea, 'fetch-ui.done')
  const fetchLock = path.join(stagingArea, 'fetch-ui.lock')

  const handle = err => {
    console.error(err)
    return fs.rmdir(fetchLock, () => {
      return fs.rmdir(doneLock, () => {
        reject(err)
      })
    })
  }

  return mkdir(stagingArea).then(() => fs.stat(doneLock, (err, stats) => {
    if (stats) {
      // already fetched
      debug('already fetched')
      waitForDone(notifyOfProgress, stagingArea, doneLock).then(resolve, reject)
    }
    if (err) {
      return fs.stat(fetchLock, (err, stats) => {
        if (stats) {
          // currently fetching
          debug('currently fetching variant 1')
          waitForDone(notifyOfProgress, stagingArea, doneLock).then(resolve, reject)
        }
        if (err) {
          return fs.mkdir(fetchLock, err => {
            if (err && err.code === 'EEXIST') {
              // currently fetching
              debug('currently fetching variant 2')
              waitForDone(notifyOfProgress, stagingArea, doneLock).then(resolve, reject)
            } else if (err) {
              handle(err)
            } else {
              debug('need to fetch')

              const child = spawn('node', [path.join(__dirname, 'fetcher.js'),
                stagingArea,
                fetchLock,
                doneLock,
                url,
                file
              ],
              { stdio: 'inherit', detached: true })
              child.on('close', (code, signal) => {
                if (code !== 0) {
                  handle(err)
                }
              })
              child.unref()

              debug('fetch initiated')
              waitForDone(notifyOfProgress, stagingArea, doneLock).then(resolve, reject)
            }
          })
        }
      })
    }
  }))
})

/** promise mkdir */
const mkdir = filepath => mkdirp(filepath)
  .catch(err => {
    if (err.code !== 'EEXIST') {
      throw err
    }
  })

// if invoked from the CLI, all we do is call main
if (require.main === module) {
  debug('called directly')

  doneWaitOrFetch(true)(process.argv[2])
    .then(console.log)
    .catch(err => {
      console.error(err.red)
      process.exit(1)
    })
} else {
  debug('required as a module')
  exports.fetch = doneWaitOrFetch(false)
  exports.watch = stagingArea => ({ wait: () => doneWaitOrFetch(true)(stagingArea) })
}
