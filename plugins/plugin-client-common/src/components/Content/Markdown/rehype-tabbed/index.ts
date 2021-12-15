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

// const RE_TAB = /^(.|[\n\r])*===\s+"(.+)"\s*(\n(.|[\n\r])*)?$/
const RE_TAB = /^===\s+"(.+)"/

const START_OF_TAB = `<!-- ____KUI_START_OF_TAB____ -->`
const END_OF_TAB = `<!-- ____KUI_END_OF_TAB____ -->`

export default function plugin(/* options */) {
  return function transformer(tree) {
    let currentTabs = []
    const flushTabs = children => {
      if (currentTabs.length > 0) {
        children.push({ type: 'element', tagName: 'tabbed', children: currentTabs })
        currentTabs = []
      }
    }

    if (tree.children && tree.children.length > 0) {
      tree.children = tree.children.reduce((newChildren, child) => {
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
                    tagName: 'li',
                    properties: { title: startMatch[1] },
                    children: rest ? [{ type: 'text', value: rest }] : [],
                    position
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
          return addToTab(child)
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
export function hackTabIndentation(source: string): string {
  let inTab: RegExp
  let inTabReplacement: string

  if (source.includes(START_OF_TAB)) {
    return source
  }

  return source
    .split(/\n/)
    .map(line => {
      const startMatch = line.match(/^(\s*)===\s+".*"/)
      if (startMatch) {
        inTabReplacement = startMatch[1] || ''
        inTab = new RegExp('^' + inTabReplacement + '(\\t| {4})')
        return `\n\n${inTabReplacement}${START_OF_TAB}\n\n` + line
      } else if (inTab) {
        if (line.length === 0) {
          // empty line: still in tab
          return line
        } else if (inTab.test(line)) {
          // indented line while in tab
          return line.replace(inTab, inTabReplacement)
        } else {
          inTab = undefined
          return `\n${inTabReplacement}${END_OF_TAB}\n` + line
        }
      }
      return line
    })
    .join('\n')
}
