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

const RE_TIP = /^\?\?\?(\+)?\s+tip\s+"(.+)"\s*(\n(.|[\n\r])*)?$/

export default function plugin(/* options */) {
  return function transformer(tree) {
    let currentTip
    const flushTip = children => {
      if (currentTip) {
        children.push(currentTip)
        currentTip = undefined
      }
    }

    if (tree.children && tree.children.length > 0) {
      tree.children = tree.children.reduce((newChildren, child) => {
        const addToTip = child => {
          currentTip.children.push(child)
          if (child.position) {
            currentTip.position.end = child.position.end
          }
          return newChildren
        }

        if (child.type === 'element' && child.tagName === 'p') {
          if (child.children.length > 0) {
            if (currentTip && (child.children[0].type !== 'text' || !RE_TIP.test(child.children[0].value))) {
              // a new paragraph that doesn't start a new tab; add to current tab
              return addToTip(child)
            }

            child.children = child.children.reduce((newChildren, pchild) => {
              if (pchild.type === 'text') {
                const startMatch = pchild.value.match(RE_TIP)
                if (startMatch) {
                  currentTip = {
                    type: 'element',
                    tagName: 'tip',
                    properties: { title: startMatch[2], open: !!startMatch[1] },
                    children: startMatch[3] ? [{ type: 'text', value: startMatch[3] }] : [],
                    position: child.position
                  }
                  return newChildren
                } else if (currentTip) {
                  return addToTip(pchild)
                }
              }

              newChildren.push(pchild)
              return newChildren
            }, [])
          }
          if (currentTip) {
            return newChildren
          }
        } else if (currentTip) {
          if (child.type === 'text' || (child.type === 'element' && !/^h\d+/.test(child.tagName))) {
            return addToTip(child)
          } else {
            // transition to a new section
            flushTip(newChildren)
          }
        }

        // no rewrite
        newChildren.push(child)

        return newChildren
      }, [])
    }

    if (currentTip) {
      flushTip(tree.children)
    }
    return tree
  }
}

/**
 * pymdown uses indentation to define tip content; remark-parse seems
 * to turn these into <pre> blocks before we get control; hack it for
 * now
 */
export function hackTipIndentation(source: string): string {
  let inTip = false
  return source
    .split(/\n/)
    .map(line => {
      if (/^\?\?\?(\+?)\s+tip\s+".*"/.test(line)) {
        inTip = true
      } else if (inTip) {
        if (line.length === 0 || /^ {4}/.test(line)) {
          return line.replace(/^ {4}/, '')
        } else {
          inTip = false
        }
      }
      return line
    })
    .join('\n')
}