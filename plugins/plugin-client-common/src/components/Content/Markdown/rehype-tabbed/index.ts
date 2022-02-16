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

import { Element } from 'hast'
import { START_OF_TIP, END_OF_TIP } from '../rehype-tip'

/** A placeholder marker to indicate markdown that uses indentation not to mean Tab or Tip content */
const FAKE_END_MARKER = ''

// const RE_TAB = /^(.|[\n\r])*===\s+"(.+)"\s*(\n(.|[\n\r])*)?$/
const RE_TAB = /^===\s+"([^"]+)"/

const START_OF_TAB = `<!-- ____KUI_START_OF_TAB____ -->`
const PUSH_TABS = `<!-- ____KUI_NESTED_TABS____ -->`
const END_OF_TAB = `<!-- ____KUI_END_OF_TAB____ -->`

export function isTab(elt: Element): boolean {
  return elt.properties['data-kui-tab-index'] !== undefined
}

export default function plugin(/* options */) {
  return function transformer(tree) {
    const tabStack = []
    let currentTabs = []
    const _flushTabs = children => {
      if (currentTabs.length > 0) {
        children.push({
          type: 'element',
          tagName: 'tabbed',
          children: currentTabs,
          properties: {
            depth: tabStack.length,
            'data-kui-choice-group': v4()
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
        } else if (child.type === 'raw' && child.value === PUSH_TABS) {
          tabStack.push(currentTabs)
          currentTabs = []
        } else if (child.type === 'element' && child.tagName === 'div') {
          child.children = process(child.children)
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

    if (tree.children && tree.children.length > 0) {
      tree.children = process(tree.children)
    }

    while (currentTabs.length > 0) {
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
  let inTab: RegExp
  let inBlockquote = false
  let inCodeBlock = false
  let blockquoteOrCodeBlockIndent: number
  const endMarkers: string[] = []

  const indentDepthOfContent: number[] = []

  const unindent = (line: string) => {
    if (!inBlockquote && !inCodeBlock) {
      return line.replace(/^\s*/, '')
    } else {
      if (blockquoteOrCodeBlockIndent > 0) {
        return line.replace(new RegExp(`^\\s{${blockquoteOrCodeBlockIndent}}`), '')
      } else {
        return line
      }
    }
  }

  const pop = (line: string, delta = 0) => {
    const indentMatch = line.match(/^\s+/)
    const curIndentDepth = indentDepthOfContent[indentDepthOfContent.length - 1]
    const thisIndentDepth = !indentMatch ? 0 : ~~(indentMatch[0].length / 4)

    let pop = ''
    for (let idx = curIndentDepth; idx > thisIndentDepth + delta; idx--) {
      indentDepthOfContent.pop()
      const endMarker = endMarkers.pop()
      if (endMarker) {
        pop += `\n${endMarker}\n\n`
      }
    }

    if (pop) {
      if (endMarkers.length === 0) {
        inTab = undefined
      } else {
        const indentDepth = indentDepthOfContent[indentDepthOfContent.length - 1]
        inTab = new RegExp(
          '^' +
            Array(indentDepth * 4)
              .fill(' ')
              .join('')
        )
      }
    }
    return pop
  }

  const rewrite = source.split(/\n/).map(line => {
    const tabStartMatch = line.match(/^(\s*)===\s+".*"/)
    const tipStartMatch = line.match(/^(\s*)[?!][?!][?!](\+?)\s+(tip|todo|bug|info|note|warning|success|question)/)
    const startMatch = tabStartMatch || tipStartMatch

    if (!inBlockquote && startMatch) {
      const thisIndentation = startMatch[1] || ''
      const indentDepth = indentDepthOfContent[indentDepthOfContent.length - 1] || 0
      const thisIndentDepth = !thisIndentation ? 1 : ~~(thisIndentation.length / 4) + 1

      const currentEndMarker = endMarkers.length === 0 ? undefined : endMarkers[endMarkers.length - 1]
      const endMarker = tabStartMatch ? END_OF_TAB : END_OF_TIP

      const possibleEndTab =
        (indentDepth === thisIndentDepth && currentEndMarker === END_OF_TIP) || endMarker === END_OF_TIP
          ? pop(line, 0)
          : !(inTab && indentDepth > thisIndentDepth)
          ? ''
          : pop(line, 1)

      const possibleNesting = !(
        inTab &&
        tabStartMatch &&
        indentDepth < thisIndentDepth &&
        endMarkers.find(_ => _ === END_OF_TAB)
      )
        ? ''
        : `\n\n${PUSH_TABS}\n\n`

      const startMarker = tabStartMatch ? START_OF_TAB : START_OF_TIP

      if (thisIndentDepth > indentDepth + 1) {
        // then the markdown is using indentation in ways beyond that
        // which would be "normal" for pymdown, i.e. to indicate Tab
        // or Tip content
        endMarkers.push(FAKE_END_MARKER)
        indentDepthOfContent.push(-1)
      }

      if (endMarker === END_OF_TIP || endMarkers.length === 0 || thisIndentDepth > indentDepth) {
        endMarkers.push(endMarker)
        indentDepthOfContent.push(thisIndentDepth)
      }

      inTab = new RegExp(
        '^' +
          Array(thisIndentDepth * 4)
            .fill(' ')
            .join('')
      )

      return `\n\n${possibleEndTab}${possibleNesting}${startMarker}\n\n` + unindent(line)
    } else if (/^\s*```/.test(line)) {
      const possibleEndOfTab = !inTab || inTab.test(line) ? '' : pop(line)

      if (/(bash|sh|shell)/.test(line)) {
        blockquoteOrCodeBlockIndent = line.search(/\S/)
        inCodeBlock = true
      } else if (inCodeBlock) {
        inCodeBlock = false
      } else if (!inBlockquote) {
        blockquoteOrCodeBlockIndent = line.search(/\S/)
        inBlockquote = true
      } else {
        inBlockquote = false
      }
      return possibleEndOfTab + unindent(line)
    } else if (inTab) {
      const unindented = unindent(line)

      if (line.length === 0 || /^\s+$/.test(line) || inBlockquote || inTab.test(line)) {
        // empty line, in blockquote, or still in tab
        return unindented
      } else {
        // possibly pop the stack of indentation
        return pop(line) + unindented
      }
    } else if (inBlockquote || inCodeBlock) {
      return unindent(line)
    }

    return line
  })

  while (endMarkers.length > 0) {
    const endMarker = endMarkers.pop()
    if (endMarker) {
      rewrite.push(endMarker)
    }
  }

  return rewrite.join('\n')
}
