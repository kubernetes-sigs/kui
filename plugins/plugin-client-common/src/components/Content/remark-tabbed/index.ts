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

const tabStart = /^===\s+"(.+)"\s*(\n(.|[\n\r])*)?$/

export default function plugin(/* options */) {
  return function transformer(tree) {
    let currentTabs = []
    const flushTabs = children => {
      children.push({ type: 'element', tagName: 'tabbed', children: currentTabs })
      currentTabs = []
    }

    if (tree.children && tree.children.length > 0) {
      tree.children = tree.children.reduce((newChildren, child) => {
        const addToTab = child => {
          const cur = currentTabs[currentTabs.length - 1]
          cur.children.push(child)
          if (child.position) {
            cur.position.end = child.position.end
          }
          return newChildren
        }

        if (child.type === 'element' && child.tagName === 'p') {
          if (child.children.length > 0) {
            if (
              currentTabs.length > 0 &&
              (child.children[0].type !== 'text' || !tabStart.test(child.children[0].value))
            ) {
              // a new paragraph that doesn't start a new tab; add to current tab
              return addToTab(child)
            }

            child.children = child.children.reduce((newChildren, pchild) => {
              if (pchild.type === 'text') {
                const startMatch = pchild.value.match(tabStart)
                if (startMatch) {
                  currentTabs.push({
                    type: 'element',
                    tagName: 'li',
                    properties: { title: startMatch[1] },
                    children: startMatch[2] ? [{ type: 'text', value: startMatch[2] }] : [],
                    position: child.position
                  })
                  return newChildren
                } else if (currentTabs.length > 0) {
                  return addToTab(pchild)
                }
              }

              newChildren.push(pchild)
              return newChildren
            }, [])
          }
          if (currentTabs.length > 0) {
            return newChildren
          }
        } else if (currentTabs.length > 0) {
          if (child.type === 'text' || (child.type === 'element' && !/^h\d+/.test(child.tagName))) {
            return addToTab(child)
          } else {
            // transition to a new section
            flushTabs(newChildren)
          }
        }

        // no rewrite
        newChildren.push(child)

        return newChildren
      }, [])
    }

    if (currentTabs.length > 0) {
      flushTabs(tree.children)
    }
    return tree
  }
}

/**
 * pymdown uses indentation to define tab content; remark-parse seems
 * to turn these into <pre> blocks before we get control; hack it for
 * now
 */
export function hackIndentation(source: string): string {
  let inTab = false
  return source
    .split(/\n/)
    .map(line => {
      if (/^===\s+".*"/.test(line)) {
        inTab = true
      } else if (inTab) {
        if (line.length === 0 || /^ {4}/.test(line)) {
          return line.replace(/^ {4}/, '')
        } else {
          inTab = false
        }
      }
      return line
    })
    .join('\n')
}
