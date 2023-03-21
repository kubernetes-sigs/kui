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
    } as any as Window['navigator']
  } as any as Window & typeof globalThis

  // add animation frame mimics
  let lastAnimationFrame = 0
  global.window.requestAnimationFrame = function (callback: FrameRequestCallback) {
    const currTime = new Date().getTime()
    const timeToCall = Math.max(0, 16 - (currTime - lastAnimationFrame))
    const id = setTimeout(() => callback(currTime + timeToCall), timeToCall) // eslint-disable-line n/no-callback-literal
    lastAnimationFrame = currTime + timeToCall
    return id as unknown as number
  }
  global.window.cancelAnimationFrame = function (id: number) {
    clearTimeout(id)
  }

  try {
    global.localStorage = Store() as any as Storage
    global.sessionStorage = Store() as any as Storage
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
    } as any as Storage
    global.sessionStorage = {
      setItem: (k: string, v: string) => {
        _sessionStorage[k] = v
        return v
      },
      getItem: (k: string) => _sessionStorage[k] || null
    } as any as Storage
  } finally {
    global.window.localStorage = localStorage
    global.window.sessionStorage = sessionStorage
  }

  window.addEventListener = () => true

  const dom0 = (): ElementMimic & HTMLElement => {
    return new ElementMimic() as ElementMimic & HTMLElement
  }

  global.document = {
    body: dom0(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getElementById: (id: string) => dom0(),
    createElement: <T>(tag: string) => {
      const element = dom0()
      ;(element as any as { nodeType: string }).nodeType = tag
      if (tag === 'table') {
        ;(element as any as { rows: any[] }).rows = []
      }
      return element as any as T
    },
    addEventListener: () => true,
    createTextNode: (text: string) => {
      const element = dom0()
      element.innerText = text
      return element as any as Text
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    querySelector: (selector: string) => {
      return dom0()
    }
  } as any as Document

  debug('mimicDom done')
}
