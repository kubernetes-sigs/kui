/*
 * Copyright 2017 The Kubernetes Authors
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
const debug = Debug('core/util/mimic-dom')
debug('loading')

import Store from '../main/store'
import ElementMimic from './element-mimic'

/**
 * Create structures to mimic having a head
 *
 */
export default function () {
  debug('mimicDom')

  global.window = {
    navigator: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:74.0) Gecko/20100101 Firefox/74.0'
    }
  }
  try {
    global.localStorage = Store()
    global.sessionStorage = Store()
    debug('successfully initialized persistent localStorage')
  } catch (err) {
    debug('error initializing persistent localStorage', err)

    const _localStorage: Record<string, string> = {}
    const _sessionStorage: Record<string, string> = {}
    global.localStorage = {
      setItem: (k: string, v: string) => {
        _localStorage[k] = v
        return v
      },
      getItem: (k: string) => _localStorage[k] || null
    }
    global.sessionStorage = {
      setItem: (k: string, v: string) => {
        _sessionStorage[k] = v
        return v
      },
      getItem: (k: string) => _sessionStorage[k] || null
    }
  } finally {
    global.window.localStorage = localStorage
    global.window.sessionStorage = sessionStorage
  }

  window.addEventListener = () => true

  const dom0 = (): ElementMimic => {
    return new ElementMimic()
  }

  global.document = {
    body: dom0(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getElementById: (id: string) => dom0(),
    createElement: (tag: string) => {
      const element = dom0()
      element.nodeType = tag
      if (tag === 'table') {
        element.rows = []
      }
      return element
    },
    addEventListener: () => true,
    createTextNode: (text: string) => {
      const element = dom0()
      element.innerText = text
      return element
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    querySelector: (selector: string) => {
      return dom0()
    }
  }

  debug('mimicDom done')
}
