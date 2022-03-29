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

import { v4 } from 'uuid'
import { Node } from 'hast'

import { isParent } from '../isElement'
import { isImports } from '../remark-import'

// const RE_TAB = /^(.|[\n\r])*===\s+"(.+)"\s*(\n(.|[\n\r])*)?$/
const RE_TAB = /^===\s+"([^"]+)"/

import { START_OF_TAB, END_OF_TAB, PUSH_TABS } from '.'

export default function populateTabs(tree: Node): Node {
  const tabStack = []
  let currentTabs = []
  const _flushTabs = children => {
    if (currentTabs.length > 0) {
      children.push({
        type: 'element',
        tagName: 'div',
        children: currentTabs,
        properties: {
          depth: tabStack.length,
          'data-kui-choice-group': v4(),
          'data-kui-choice-nesting-depth': tabStack.length
        }
      })
    }

    if (tabStack.length === 0) {
      currentTabs = []
    } else {
      currentTabs = tabStack.pop()
    }
  }

  const flushTabs = children => {
    if (tabStack.length > 0) {
      const parentTabs = tabStack[tabStack.length - 1]
      const lastParentTab = parentTabs[parentTabs.length - 1]
      _flushTabs(lastParentTab.children)
    } else {
      _flushTabs(children)
    }
  }

  const process = children =>
    children.reduce((newChildren, child) => {
      const addToTab = child => {
        const cur = currentTabs[currentTabs.length - 1]
        cur.children.push(child)
        if (cur.position && child.position) {
          cur.position.end.offset = child.position.end.offset
        }
        return newChildren
      }

      if (child.type === 'raw' && child.value === END_OF_TAB) {
        flushTabs(newChildren)
        return newChildren
      } else if (child.type === 'raw' && child.value === START_OF_TAB) {
        // we process this in the RE_TAB match below; this is for
        // now only a breadcrumb to help with debugging
        return newChildren
      } else if (child.type === 'raw' && child.value === PUSH_TABS) {
        if (currentTabs.length > 0) {
          tabStack.push(currentTabs)
          currentTabs = []
        }
      } else if (child.type === 'element' && child.tagName === 'div') {
        if (currentTabs.length > 0 && isImports(child.properties)) {
          const sub = populateTabs(child)
          return addToTab(sub)
        } else {
          child.children = process(child.children)
        }
      } else if (child.type === 'element' && child.tagName === 'p') {
        if (child.children.length > 0) {
          if (
            currentTabs.length > 0 &&
            (child.type === 'raw' || child.children[0].type !== 'text' || !RE_TAB.test(child.children[0].value))
          ) {
            // a new paragraph that doesn't start a new tab; add to current tab
            return addToTab(child)
          }

          child.children = child.children.reduce((newChildren, pchild) => {
            if (pchild.type === 'text') {
              const startMatch = pchild.value.match(RE_TAB)
              if (startMatch) {
                if (startMatch.index !== 0) {
                  // then we need to splice out some prefix text
                  newChildren.push({ type: 'text', value: pchild.value.slice(0, startMatch.index) })
                }

                const rest = pchild.value.slice(startMatch.index + startMatch[0].length)

                const position = {
                  start: {
                    offset: child.position.start.offset + startMatch.index
                  },
                  end: {
                    offset: child.position.end.offset + startMatch.index
                  }
                }

                currentTabs.push({
                  type: 'element',
                  tagName: 'span', // do not use 'li'
                  // here. something after us seems
                  // to join nested tabs together
                  properties: {
                    title: startMatch[1],
                    depth: tabStack.length,
                    'data-kui-tab-index': currentTabs.length
                  },
                  children: rest ? [{ type: 'text', value: rest }] : [],
                  position
                })
                return newChildren
              }
            }

            if (currentTabs.length > 0) {
              return addToTab(pchild)
            } else {
              newChildren.push(pchild)
              return newChildren
            }
          }, [])
        }
        if (currentTabs.length > 0) {
          return newChildren
        }
      } else if (currentTabs.length > 0) {
        return addToTab(child)
      }

      // no rewrite
      newChildren.push(child)

      return newChildren
    }, [])

  if (isParent(tree) && tree.children.length > 0) {
    tree.children = process(tree.children)

    while (currentTabs.length > 0) {
      flushTabs(tree.children)
    }
  }

  return tree
}
