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

const RE_TEXT = /^text|strong$/
const RE_TIP = /^([?!][?!][?!])(\+?)\s+(tip|info|note|warning)\s+"(.+)"\s*(\n(.|[\n\r])*)?$/
const RE_TIP_START = /^([?!][?!][?!])(\+?)\s+(tip|info|note|warning)\s+"(.+)$/
const RE_TIP_END = /^(.*)"\s*(\n(.|[\n\r])*)?$/

const START_OF_TIP = `<!-- ____KUI_START_OF_TIP____ -->`
const END_OF_TIP = `<!-- ____KUI_END_OF_TIP____ -->`

export default function plugin(/* options */) {
  return function transformer(tree) {
    let currentTip
    const flushTip = children => {
      if (currentTip) {
        children.push(currentTip)
        currentTip = undefined
      }
    }

    const process = children =>
      children.reduce((newChildren, child) => {
        const addToTip = child => {
          currentTip.children.push(child)
          if (child.position) {
            currentTip.position.end = child.position.end
          }
          return newChildren
        }

        if (child.type === 'raw' && child.value === END_OF_TIP) {
          flushTip(newChildren)
          return newChildren
        } else if (child.type === 'element' && child.tagName === 'div') {
          child.children = process(child.children)
        } else if (child.type === 'element' && child.tagName === 'p') {
          if (child.children.length > 0) {
            if (currentTip && (child.children[0].type !== 'text' || !RE_TIP_START.test(child.children[0].value))) {
              // a new paragraph that doesn't start a new tab; add to current tab
              return addToTip(child)
            }

            child.children = child.children.reduce((pnewChildren, pchild) => {
              if (currentTip && currentTip.properties.partial) {
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
                  flushTip(newChildren)

                  currentTip = {
                    type: 'element',
                    tagName: 'tip',
                    properties: { title: startMatch[4], open: !!startMatch[2] || startMatch[1] === '!!!' },
                    children: startMatch[5] ? [{ type: 'text', value: startMatch[5] }] : [],
                    position: child.position
                  }
                  return pnewChildren
                } else {
                  const startMatch = pchild.value.match(RE_TIP_START)
                  if (startMatch) {
                    flushTip(newChildren)

                    currentTip = {
                      type: 'element',
                      tagName: 'tip',
                      properties: {
                        title: startMatch[4],
                        open: !!startMatch[2] || startMatch[1] === '!!!',
                        partial: true
                      },
                      children: [],
                      position: child.position
                    }
                  } else if (currentTip) {
                    return addToTip(pchild)
                  }
                }
              } else if (currentTip) {
                return addToTip(pchild)
              }

              pnewChildren.push(pchild)
              return pnewChildren
            }, [])
          }
          if (currentTip) {
            return newChildren
          }
        } else if (currentTip) {
          if (
            RE_TEXT.test(child.type) ||
            child.type === 'raw' ||
            (child.type === 'element' && !/^h\d+/.test(child.tagName))
          ) {
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

    if (tree.children && tree.children.length > 0) {
      tree.children = process(tree.children.slice())
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
  let inTip: RegExp
  let inTipReplacement: string

  if (source.includes(START_OF_TIP)) {
    return source
  }

  return source
    .split(/\n/)
    .map(line => {
      const startMatch = line.match(/^(\s*)[?!][?!][?!](\+?)\s+(tip|info|note|warning)\s+".*"/)
      if (startMatch) {
        inTipReplacement = startMatch[1] || ''
        inTip = new RegExp('^' + inTipReplacement + '(\\t| {4})')
        return `\n\n${inTipReplacement}${START_OF_TIP}\n\n` + line
      } else if (inTip) {
        if (line.length === 0 || /^\s+$/.test(line)) {
          // empty line: still in tip
          return line
        } else if (inTip.test(line)) {
          // indented line while in tip
          return line.replace(inTip, inTipReplacement)
        } else {
          inTip = undefined
          return `\n${inTipReplacement}${END_OF_TIP}\n` + line
        }
      }
      return line
    })
    .join('\n')
}
