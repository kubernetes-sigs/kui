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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import * as Debug from 'debug'
const debug = Debug('core/util/mimic-dom')
debug('loading')

import Store from '../main/store'

/* export interface ElementMimic {
  _isFakeDom: boolean
  cells?: ElementMimic[]
  children: ElementMimic[]
  className: string
  innerText: string
  hasStyle: (style: string, desiredValue?: number | string) => boolean | string
  nodeType: string
  rows?: ElementMimic[]
  style: { [key: string]: string }
  recursiveInnerTextLength: () => number
  } */

class ClassList {
  readonly classList: string[] = []

  get length(): number {
    return this.classList.length
  }

  forEach(fn: (str: string) => void) {
    this.classList.forEach(fn)
  }

  add(_: string) {
    return this.classList.push(_)
  }

  contains(_: string): boolean {
    return this.classList.indexOf(_) >= 0
  }

  remove(_: string) {
    const idx = this.classList.findIndex((x: string) => x === _)
    if (idx >= 0) {
      this.classList.splice(idx, 1)
    }
  }
}

/** generic clone */
function clone<T>(instance: T): T {
  const copy = new (instance.constructor as { new (): T })()
  Object.assign(copy, instance)
  return copy
}

export class ElementMimic {
  private readonly _isFakeDom = true

  value = ''

  innerText = ''

  innerHTML = ''

  className = ''

  classList = new ClassList()

  nodeType = ''

  style: { [key: string]: string } = {}

  children: ElementMimic[] = []

  cells: ElementMimic[] = []

  rows: ElementMimic[] = []

  private _attrs: { [key: string]: string } = {}

  focus() {
    /* empty ok */
  }

  appendChild(c: ElementMimic) {
    return this.children.push(c)
  }

  getAttribute(k: string): string {
    return this._attrs[k] || ''
  }

  setAttribute(k: string, v: string): string {
    this._attrs[k] = v
    return v
  }

  removeAttribute(k: string): string {
    const attr = this._attrs[k]
    delete this._attrs[k]
    return attr
  }

  cloneNode(): ElementMimic {
    return clone(this)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  querySelectorAll(selector: string): ElementMimic[] {
    return []
  }

  querySelector(sel: string): ElementMimic {
    return this[sel] || new ElementMimic()
  }

  addEventListener() {
    return true
  }

  hasStyle(style: string, desiredValue?: number | string): boolean | string {
    const actualValue = this.style && this.style[style]
    // intentional double equals, so that 500=='500'
    // eslint-disable-next-line eqeqeq
    if (desiredValue) return desiredValue == actualValue
    else return actualValue
  }

  recursiveInnerTextLength(): number {
    return (
      this.innerText.length + this.children.reduce((sum: number, child) => sum + child.recursiveInnerTextLength(), 0)
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isFakeDom(dom: any): dom is ElementMimic {
    return dom && (dom as ElementMimic)._isFakeDom
  }
}

/**
 * Create structures to mimic having a head
 *
 */
export default function() {
  debug('mimicDom')

  try {
    global['localStorage'] = Store()
    debug('successfully initialized persistent localStorage')
  } catch (err) {
    debug('error initializing persistent localStorage', err)

    const localStorage = {}
    global['localStorage'] = {
      setItem: (k: string, v: string) => {
        localStorage[k] = v
        return v
      },
      getItem: (k: string) => localStorage[k] || null
    }
  } finally {
    global['window'] = { localStorage: global['localStorage'] }
  }

  global['window'].addEventListener = () => true

  const dom0 = (): ElementMimic => {
    return new ElementMimic()
  }

  const document = {
    body: dom0(),
    createElement: (tag: string) => {
      const element = dom0()
      element.nodeType = tag
      if (tag === 'table') {
        element['rows'] = []
        element['insertRow'] = (idx: number) => {
          const row = document.createElement('tr')
          row['cells'] = []
          row['insertCell'] = (idx: number) => {
            const cell = document.createElement('td')
            if (idx === -1) row['cells'].push(cell)
            else row['cells'].splice(idx, 0, cell)
            return cell
          }
          if (idx === -1) element['rows'].push(row)
          else element['rows'].splice(idx, 0, row)
          return row
        }
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
  global['document'] = document
}
