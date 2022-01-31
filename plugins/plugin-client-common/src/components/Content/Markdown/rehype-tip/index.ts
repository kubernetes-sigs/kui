/*
 * Copyright 2021 The Kubernetes Authors
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

import { i18n } from '@kui-shell/core'

const strings = i18n('plugin-client-common', 'markdown')

const RE_TIP = /^([?!][?!][?!])(\+?)\s+(tip|todo|bug|info|note|warning|success|question)(\s+"(.+)"\s*)?(\s+inline)?(\s+inline\s+end)?(\n(.|[\n\r])*)?$/
const RE_TIP_START = /^([?!][?!][?!])(\+?)\s+(tip|todo|bug|info|note|warning|success|question)(\s+"(.+))?$/
const RE_TIP_END = /^(.*)"\s*(\n(.|[\n\r])*)?$/

export const START_OF_TIP = `<!-- ____KUI_START_OF_TIP____ -->`
export const END_OF_TIP = `<!-- ____KUI_END_OF_TIP____ -->`

export default function plugin(/* options */) {
  return function transformer(tree) {
    let currentTip
    let currentTipLevel = -1
    const flushTip = () => {
      if (currentTip) {
        currentTip = undefined
        currentTipLevel = -1
      }
    }

    const process = (children: any[], level: number) =>
      children.reduce((newChildren, child) => {
        const addToTip = child => {
          currentTip.children.push(child)
          if (child.position) {
            currentTip.position.end = child.position.end
          }
          return newChildren
        }

        if (child.type === 'raw' && child.value === END_OF_TIP) {
          flushTip()
          return newChildren
        } else if (
          child.type === 'element' &&
          (child.tagName === 'div' || child.tagName === 'span' || child.tagName === 'tabbed')
        ) {
          const newChild = Object.assign({}, child, { children: [] })
          const children = currentTipLevel === level ? currentTip.children : newChildren
          children.push(newChild)
          newChild.children = process(child.children, level + 1)
          return newChildren
        } else if (child.type === 'element' && child.tagName === 'p') {
          if (child.children.length > 0) {
            if (
              currentTipLevel === level &&
              (child.children[0].type !== 'text' || !RE_TIP_START.test(child.children[0].value))
            ) {
              // a new paragraph that doesn't start a new tip; add to current tip
              return addToTip(child)
            }

            child.children = child.children.reduce((pnewChildren, pchild) => {
              if (currentTipLevel === level && currentTip.properties.partial) {
                if (pchild.type === 'text') {
                  const endMatch = pchild.value.match(RE_TIP_END)
                  if (endMatch) {
                    delete currentTip.properties.partial
                    if (endMatch[1]) {
                      currentTip.properties.title += endMatch[1]
                    }
                    if (endMatch[2]) {
                      currentTip.children.push({ type: 'text', value: endMatch[2] })
                    }
                  }
                } else {
                  // PatternFly's ExpandableSection currently only supports `string` for the title text :(
                  // hacks for now
                  currentTip.properties.title += pchild.children
                    .filter(_ => _.type === 'text')
                    .map(_ => _.value)
                    .join(' ')
                }
              } else if (pchild.type === 'text') {
                const startMatch = pchild.value.match(RE_TIP)
                if (startMatch) {
                  flushTip()

                  currentTipLevel = level
                  currentTip = {
                    type: 'element',
                    tagName: 'tip',
                    properties: {
                      className: startMatch[3], // e.g. tip, todo, bug, warning, ...
                      float: startMatch[6] ? 'left' : startMatch[7] ? 'right' : undefined,
                      title: startMatch[5] || strings(startMatch[3]),
                      open: !!startMatch[2] || startMatch[1] === '!!!'
                    },
                    children: startMatch[8] ? [{ type: 'text', value: startMatch[8] }] : [],
                    position: child.position
                  }
                  newChildren.push(currentTip)
                  return pnewChildren
                } else {
                  const startMatch = pchild.value.match(RE_TIP_START)
                  if (startMatch) {
                    flushTip()

                    currentTipLevel = level
                    currentTip = {
                      type: 'element',
                      tagName: 'tip',
                      properties: {
                        className: startMatch[3], // e.g. tip, todo, bug, warning, ...
                        title: startMatch[5] || strings(startMatch[3]),
                        open: !!startMatch[2] || startMatch[1] === '!!!',
                        partial: true
                      },
                      children: [],
                      position: child.position
                    }
                    newChildren.push(currentTip)
                    return pnewChildren
                  } else if (currentTipLevel === level) {
                    return addToTip(pchild)
                  }
                }
              } else if (currentTipLevel === level) {
                return addToTip(pchild)
              }

              pnewChildren.push(pchild)
              return pnewChildren
            }, [])
          }
          if (currentTipLevel === level) {
            return newChildren
          }
        } else if (currentTipLevel === level) {
          return addToTip(child)
        }

        // no rewrite
        newChildren.push(child)

        return newChildren
      }, [])

    if (tree.children && tree.children.length > 0) {
      tree.children = process(tree.children, 0)
    }

    if (currentTip) {
      flushTip()
    }
    return tree
  }
}
