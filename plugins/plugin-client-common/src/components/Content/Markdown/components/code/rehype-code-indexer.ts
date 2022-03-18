/*
 * Copyright 2022 The Kubernetes Authors
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

import { Parent } from 'unist'
import { toString } from 'hast-util-to-string'
import { Element, ElementContent } from 'hast'
import { visitParents as visit } from 'unist-util-visit-parents'

import dump from './dump'
import isExecutable from './isCodeBlock'
import { isTab } from '../../rehype-tabbed'
import {
  isWizard,
  isWizardStep,
  getWizardGroup,
  getWizardStepMember,
  getTitle,
  getDescription
} from '../Wizard/rehype-wizard'
import { tryFrontmatter } from '../../frontmatter'
import { addNesting as addCodeBlockNesting } from '../Wizard/CodeBlockProps'
import { isImports, getImportKey, getImportFilepath, getImportTitle } from '../../remark-import'

export function isElement(_: Node | Parent | ElementContent): _ is Element {
  const elt = _ as Element
  return elt && typeof elt.tagName === 'string'
}

export function isElementWithProperties(_: Element | ElementContent | Parent | Node): _ is Element {
  return isElement(_) && _.properties !== undefined
}

/**
 * Heuristic: Code Blocks inside of closed "tips" (i.e. default-closed
 * expandable sections) are optional in terms of ultimate success of
 * the enclosing guidebook */
function isImplicitlyOptional(_: Parent): _ is Element {
  return isElementWithProperties(_) && _.tagName === 'tip' && _.properties.open === false
}

/**
 * Scan backwards from childIdx in grandparent's children for a
 * heading. If found, return that heading's string form.
 */
function findNearestEnclosingHeadingText(grandparent: Node, childIdx: number) {
  if (grandparent && childIdx >= 0 && isElementWithProperties(grandparent)) {
    for (let idx = childIdx - 1; idx >= 0; idx--) {
      const child = grandparent.children[idx]
      if (isElementWithProperties(child) && /^h\d+$/.test(child.tagName)) {
        return toString(child)
      }
    }
  }
}

/**
 * This rehype plugin adds a unique codeIdx ordinal property to each
 * executable code block.
 */
export default function plugin(uuid: string) {
  return (ast /*: Root */) => {
    let codeIdx = 0
    const allocCodeBlockId = (myCodeIdx: number) => `${uuid}-${myCodeIdx}`

    visit(/* <Element> */ ast, 'element', function visitor(node, ancestors) {
      if (node.tagName === 'code') {
        // react-markdown v6+ places the language in the className
        const match = node.properties.className ? /language-([\w{.]+)/.exec(node.properties.className.toString()) : ''
        const language = match ? match[1].replace(/[{.]/g, '') : undefined
        // re: the replace: this is a bit of a hack to support {.bash .no-copy} style languages from pymdown

        if (isExecutable(language)) {
          const myCodeIdx = codeIdx++
          node.properties.codeIdx = myCodeIdx

          if (node.children.length === 1 && node.children[0].type === 'text') {
            // the AST node that houses this code block's string content
            const codeValueElement = node.children[0]

            const code = String(codeValueElement.value).trim()
            const { body, attributes } = tryFrontmatter(code)

            if (typeof attributes === 'object') {
              if (!attributes.id) {
                // assign a codeBlockId if the author did not specify one
                attributes.id = allocCodeBlockId(myCodeIdx)
              }

              const dumpCodeBlockProps = () =>
                Buffer.from(JSON.stringify(Object.assign({ body, language }, attributes))).toString('base64')

              let codeBlockProps = dumpCodeBlockProps()

              const reserialize = () => {
                // re-serialize this update for later use
                codeBlockProps = dumpCodeBlockProps()
                codeValueElement.value = dump(attributes, body)
              }

              const addNesting = (...params: Parameters<typeof addCodeBlockNesting>) => {
                addCodeBlockNesting(...params)
                reserialize()
              }

              // go from top to bottom, which is in reverse order, so
              // that we can synthesize the "optional" and "choices"
              // attributes
              for (let idx = ancestors.length - 1; idx >= 0; idx--) {
                const _ = ancestors[idx]

                if (attributes.validate === '$body') {
                  attributes.validate = body
                  reserialize()
                }

                if (attributes.optional === true || isImplicitlyOptional(_)) {
                  // don't propagate code blocks out of either
                  // explicitly or implicitly optional elements. Re:
                  // implicitly, the idea is that we should stop
                  // propagating the code block upwards if we reach
                  // some element that seems indicative of blocking
                  // out an optional area, e.g. an expandable section
                  // that is default-closed
                  attributes.optional = true
                  reserialize()
                }

                if (isElementWithProperties(_)) {
                  if (isTab(_)) {
                    if (!attributes.choice || !attributes.choice.group) {
                      // get the choice group id from the parent (which encloses the tabs... in this group)
                      const parent = ancestors[idx - 1]
                      if (isElementWithProperties(parent)) {
                        // title for this choice
                        const title = _.properties.title.toString()

                        // identifier for this choice's group of choices
                        const group = parent.properties['data-kui-choice-group'].toString()

                        // identifier for this member of that group
                        const member = parseInt(_.properties['data-kui-tab-index'].toString(), 0)
                        // const nestingDepth = parseInt(parent.properties['data-kui-choice-nesting-depth'].toString(), 0)

                        const grandparent = ancestors[idx - 2]
                        const parentIdx = !grandparent ? -1 : grandparent.children.findIndex(child => child === parent)
                        addNesting(attributes, {
                          kind: 'Choice',
                          group,
                          title,
                          member,
                          groupTitle: findNearestEnclosingHeadingText(grandparent, parentIdx)
                        })
                      }
                    }
                  } else if (isWizardStep(_.properties)) {
                    const parent = ancestors[idx - 1]
                    if (parent && isElementWithProperties(parent) && isWizard(parent.properties)) {
                      addNesting(attributes, {
                        kind: 'WizardStep',
                        group: getWizardGroup(_.properties),
                        member: getWizardStepMember(_.properties),
                        title: getTitle(_.properties),
                        description: getDescription(_.properties),
                        wizard: {
                          title: getTitle(parent.properties),
                          description: getDescription(parent.properties)
                        }
                      })
                    }
                  } else if (isImports(_.properties)) {
                    addNesting(attributes, {
                      kind: 'Import',
                      key: getImportKey(_.properties),
                      title: getImportTitle(_.properties),
                      filepath: getImportFilepath(_.properties)
                    })
                  }
                }
              }

              // we had to go from top to bottom, so reverse now
              if (attributes.nesting) {
                attributes.nesting = attributes.nesting.reverse()
                reserialize()
              }

              // go from bottom to top stopping at the first import,
              // accumulating code blocks
              // let isOnImportChain = false
              for (let idx = ancestors.length - 1; idx >= 0; idx--) {
                const _ = ancestors[idx]

                if (isElementWithProperties(_)) {
                  if (Array.isArray(_.properties.containedCodeBlocks)) {
                    // satisify any element that has requested that
                    // we aggregate code blocks
                    _.properties.containedCodeBlocks.push(codeBlockProps)
                  }

                  if (isImports(_.properties)) {
                    // don't propagate containedCodeBlocks above the
                    // import declaration
                    // isOnImportChain = true
                    break
                  }
                }
              }

              const root = ancestors.find(_ => _.type === 'root')
              if (root) {
                let properties: { containedCodeBlocks: string[] } = root['properties']
                if (!properties) {
                  properties = root['properties'] = { containedCodeBlocks: [] }
                } else if (!properties.containedCodeBlocks) {
                  properties.containedCodeBlocks = []
                }

                properties.containedCodeBlocks.push(codeBlockProps)
              }
            }
          }
        }
      }
    })
  }
}
