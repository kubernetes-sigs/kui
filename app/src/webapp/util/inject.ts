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

import * as Debug from 'debug'
const debug = Debug('webapp/util/inject')
debug('loading')

import { isHeadless } from '../../core/capabilities'

interface IStylesheetContent {
  css: string
  key: string
}
function isAStylesheet (object: any): object is IStylesheetContent {
  return typeof object !== 'string' && 'css' in object
}

/**
 * Inject a stylesheet
 *
 */
export const injectCSS = (file: IStylesheetContent | string): void => {
  if (isHeadless()) {
    return
  }

  debug('injectCSS', file)

  const contentType = 'text/css'
  const rel = 'stylesheet'

  const id = isAStylesheet(file)
    ? `injected-css-${file.key}`
    : `injected-css-${file}`

  if (!document.getElementById(id)) {
    // this will be either a <style> or a <link>
    // depending on whether we have the raw text
    // or an href
    let link

    if (isAStylesheet(file)) {
      // then we have the content, not a filename
      debug('injecting stylesheet from given content')
      link = document.createElement('style')
      link.appendChild(document.createTextNode(file.css))
    } else {
      debug('injecting stylesheet from file ref')
      link = document.createElement('link')
      link.href = file
      link.rel = rel
    }

    link.id = id
    link.type = contentType
    document.getElementsByTagName('head')[0].appendChild(link)
  }

}

/**
 * Inject a script
 *
 */
export const injectScript = (url: any): Promise<any> => new Promise((resolve, reject) => {
  const type = 'script'
  const id = `injected-${type}-${url.key || url}`

  if (!document.getElementById(id)) {
    // we haven't yet injected the script
    const link = document.createElement('script')
    link.id = id

    if (url.src) {
      debug('injecting raw script')
      link.appendChild(document.createTextNode(url.src))
    } else {
      debug('injecting remote script')
      link.async = true
      link.src = url
      link.addEventListener('load', () => {
        debug('injected script', url, id, link)
        // done!
        resolve()
      })
    }

    document.getElementsByTagName('head')[0].appendChild(link)
  } else {
    // otherwise, we've already injected the script
    resolve()
  }
})

/**
 * Inject HTML stored in the given local file
 *
 */
export const loadHTML = (file: any): Promise<string> => new Promise((resolve, reject) => {
  if (file.html) {
    // then we have the raw content already
    debug('loadHTML from string')
    resolve(file.html)
  } else {
    debug('loadHTML from file', file)
    require('fs').readFile(file, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  }
})
