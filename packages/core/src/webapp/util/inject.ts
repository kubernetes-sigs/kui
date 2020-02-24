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

import Debug from 'debug'

import { isHeadless } from '../../core/capabilities'
const debug = Debug('webapp/util/inject')
debug('loading')

interface StylesheetDirect {
  css: string
  key: string
}
interface StylesheetFile {
  path: string
  key: string
}
function isAStylesheetDirect(object: StylesheetSpec): object is StylesheetDirect {
  return typeof object !== 'string' && 'css' in object && 'key' in object
}
function isAStylesheetFile(object: StylesheetSpec): object is StylesheetFile {
  return typeof object !== 'string' && 'path' in object && 'key' in object
}

type StylesheetSpec = StylesheetDirect | StylesheetFile | string

declare const mediaUri: string

/**
 * Inject a stylesheet
 *
 */
export const injectCSS = (file: StylesheetSpec): void => {
  if (isHeadless() || typeof document === 'undefined' || !document.getElementById) {
    return
  }

  const contentType = 'text/css'
  const rel = 'stylesheet'

  const id = isAStylesheetDirect(file) || isAStylesheetFile(file) ? `injected-css-${file.key}` : `injected-css-${file}`

  if (!document.getElementById(id)) {
    // this will be either a <style> or a <link>
    // depending on whether we have the raw text
    // or an href
    let link

    if (isAStylesheetDirect(file)) {
      // then we have the content, not a filename
      // debug('injecting stylesheet from given content')
      link = document.createElement('style')
      link.appendChild(document.createTextNode(file.css))
    } else {
      // debug('injecting stylesheet from file ref')
      link = document.createElement('link')
      link.rel = rel
      const muri = typeof mediaUri !== 'undefined' ? mediaUri + '/' : ''
      if (isAStylesheetFile(file)) {
        link.href = `${muri}${file.path}`
      } else {
        link.href = `${muri}${file}`
      }
    }

    link.id = id
    link.type = contentType
    document.getElementsByTagName('head')[0].appendChild(link)
  }
}

/**
 * Remove a stylesheet
 *
 */
export const uninjectCSS = ({ key }: { key: string }): void => {
  if (isHeadless() || typeof document === 'undefined' || !document.getElementById) {
  } else {
    const id = `injected-css-${key}`
    const link = document.getElementById(id)

    // debug('uninjectCSS', id, link)
    if (link && link.parentNode) {
      link.parentNode.removeChild(link)
    }
  }
}
