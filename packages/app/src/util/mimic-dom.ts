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
const debug = Debug('core/util/mimic-dom')
debug('loading')

import Store from '../main/store'

/**
 * Create structures to mimic having a head
 *
 */
export default function () {
  debug('mimicDom')

  try {
    global['localStorage'] = Store()
    debug('successfully initialized persistent localStorage')
  } catch (err) {
    debug('error initializing persistent localStorage', err)

    const localStorage = {}
    global['localStorage'] = {
      setItem: (k, v) => { localStorage[k] = v; return v },
      getItem: k => localStorage[k] || null
    }
  } finally {
    global['window'] = { localStorage: global['localStorage'] }
  }

  global['window'].addEventListener = () => true

  const dom0 = () => {
    const obj = {
      _isFakeDom: true,
      value: '',
      innerText: '',
      innerHTML: '',
      className: '',
      _classList: [],
      classList: {
        add: _ => obj._classList.push(_),
        contains: _ => obj._classList.indexOf(_) >= 0,
        remove: _ => {
          const idx = obj._classList.findIndex(x => x === _)
          if (idx >= 0) {
            obj._classList.splice(idx, 1)
          }
        }
      },
      nodeType: '',
      attrs: {},
      style: {},
      children: [],
      focus: () => { /* empty ok */ },
      appendChild: c => obj.children.push(c),
      getAttribute: (k: string) => obj.attrs[k] || '',
      setAttribute: (k: string, v) => { obj.attrs[k] = v; return v },
      removeAttribute: (k: string) => delete obj.attrs[k],
      cloneNode: () => Object.assign({}, obj),
      querySelectorAll: selector => [],
      querySelector: sel => {
        return obj[sel] || dom0()
      },
      addEventListener: () => true,
      hasStyle: (style, desiredValue) => {
        const actualValue = obj.style && obj.style[style]
        // intentional double equals, so that 500=='500'
        if (desiredValue) return desiredValue == actualValue // tslint:disable-line
        else return actualValue
      },
      recursiveInnerTextLength: () => {
        return obj.innerText.length + obj.children.reduce((sum, child) => sum + child.recursiveInnerTextLength(), 0)
      }
    }

    return obj
  }
  const dom = () => Object.assign(dom0(), {
    input: dom0()
  })
  const block = () => Object.assign(dom(), {
    '.repl-result': dom0()
  })

  const document = {
    body: dom0(),
    createElement: type => {
      const element = dom0()
      element.nodeType = type
      if (type === 'table') {
        element['rows'] = []
        element['insertRow'] = idx => {
          const row = document.createElement('tr')
          row['cells'] = []
          row['insertCell'] = idx => {
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
    createTextNode: text => { const element = dom0(); element.innerText = text; return element },
    querySelector: selector => {
      return dom0()
    }
  }
  global['document'] = document
}
