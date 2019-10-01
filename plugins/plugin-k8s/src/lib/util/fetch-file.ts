/*
 * Copyright 2018-19 IBM Corporation
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

import { Capabilities, Errors, Util } from '@kui-shell/core'

const debug = Debug('k8s/util/fetch-file')

async function needle(method: 'get', url: string): Promise<{ statusCode: number; body: string }> {
  if (Capabilities.inBrowser()) {
    debug('fetch via xhr')
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(method, url)
      xhr.addEventListener('error', () => {
        console.error('error in xhr', xhr)
        reject(xhr.response || 'Internal Error')
      })
      xhr.addEventListener('load', () => {
        resolve({
          statusCode: xhr.status,
          body: xhr.response.response
        })
      })
      xhr.send()
    })
  } else if (Capabilities.isHeadless()) {
    debug('fetch via needle')
    const needle = await import('needle')
    return needle(method, url, { follow_max: 10 }).then(_ => ({ statusCode: _.statusCode, body: _.body }))
  } else {
    debug('fetch via electron.net')
    const { net } = (await import('electron')).remote

    return new Promise((resolve, reject) => {
      const request = net.request({
        method,
        url,
        redirect: 'follow'
      })

      request.on('response', response => {
        const statusCode = response.statusCode
        debug('got response', statusCode)

        // we will accumulate the body chunks below
        let body = ''

        // Warning: you must register 'end' before 'data'.
        // https://github.com/electron/electron/issues/12545
        response.on('end', () => {
          debug('got end')
          if (response.statusCode < 300) {
            resolve({ statusCode, body })
          } else {
            const error: Errors.CodedError = new Error(body)
            error.statusCode = statusCode
            reject(error)
          }
        })

        response.on('data', chunk => {
          debug('got chunk', chunk.toString())
          body += chunk.toString()
        })
      })

      request.end()
    })
  }
}

/**
 * Either fetch a remote file or read a local one
 *
 */
export const fetchFile = (url: string): Promise<(string | Buffer)[]> => {
  debug('fetchFile', url)

  const urls = url.split(/,/)

  return Promise.all(
    urls.map(async url => {
      if (url.match(/http(s)?:\/\//)) {
        debug('fetch remote', url)
        const fetchOnce = () => needle('get', url).then(_ => _.body)

        const retry = (delay: number) => async (err: Error) => {
          if (/timeout/.test(err.message) || /hang up/.test(err.message) || /hangup/.test(err.message)) {
            debug('retrying', err)
            await new Promise(resolve => setTimeout(resolve, delay))
            return fetchOnce()
          } else {
            throw err
          }
        }

        // fetch with three retries
        return fetchOnce()
          .catch(retry(500))
          .catch(retry(1000))
          .catch(retry(5000))
      } else {
        debug('fetch local', url)

        // why the dynamic import? being browser friendly here
        const { readFile } = await import('fs-extra')

        return readFile(Util.findFile(Util.expandHomeDir(url)))
      }
    })
  )
}

/** same as fetchFile, but returning a string rather than a Buffer */
export const fetchFileString = (url: string): Promise<string[]> => {
  return fetchFile(url).then(_ => _.map(_ => _.toString()))
}
