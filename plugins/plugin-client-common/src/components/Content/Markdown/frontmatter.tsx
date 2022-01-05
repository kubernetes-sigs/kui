/*
 * Copyright 2020 The Kubernetes Authors
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

import { u } from 'unist-builder'
import { Tab, isCodedError, isWatchable } from '@kui-shell/core'

import { CodeBlockResponse } from './components/code'

export function tryFrontmatter(
  value: string
): Pick<import('front-matter').FrontMatterResult<any>, 'body' | 'attributes'> {
  try {
    const frontmatter = require('front-matter')
    return frontmatter(value)
  } catch (err) {
    console.error('Error parsing frontmatter', err)
    return {
      body: value,
      attributes: {}
    }
  }
}

function stringifyError(response: Error) {
  return { code: isCodedError(response) ? response.code : 1, message: response.message }
}

/** Blunt attempt to avoid serializing React bits */
function reactRedactor(key: string, value: any) {
  if (key === 'tab') {
    return undefined
  } else if (key === 'block') {
    return undefined
  } else if (value && typeof value === 'object' && value.constructor === Error) {
    // the first check guards against typeof null === 'object'
    return stringifyError(value)
  } else {
    return value
  }
}

export function encodePriorResponses(responses: CodeBlockResponse[]): string {
  return JSON.stringify(
    responses.map(response => {
      if (response.response.constructor === Error) {
        return Object.assign({}, response, { response: stringifyError(response.response) })
      } else if (isWatchable(response.response)) {
        delete response.response.watch
      }
      return response
    }),
    reactRedactor
  )
}

interface KuiFrontmatter {
  /** Title of the Notebook */
  title?: string

  /**
   * A mapping that indicates which section (the `number` values) should be rendered in a given split position.
   */
  layout?: {
    left?: number
    right?: number
    bottom?: number
  }
}

export function splitTarget(node) {
  if (node.type === 'raw') {
    const match = node.value.match(/<!-- ____KUI__SECTION_START____ (.*)/)
    if (match) {
      return match[1]
    }
  }
}

/** Parse out the frontmatter at the top of a markdown file */
export function kuiFrontmatter(opts: { tab: Tab }) {
  return tree => {
    let sectionIdx = 1
    let currentSection // : { type: 'kui-split', value: string, children: [] }

    let frontmatter: KuiFrontmatter

    const newSection = (sectionIdx: number) =>
      u(
        'subtree',
        {
          data: {
            hProperties: {
              'data-kui-split': frontmatter.layout[sectionIdx] || 'default' // `<!-- ____KUI_SPLIT____ ${frontmatter.layout[sectionIdx] || 'default'} -->`,
            }
          }
        },
        []
      )

    tree.children = tree.children.reduce((newChildren, node) => {
      if (node.type === 'yaml') {
        if (node.value) {
          try {
            const { load } = require('js-yaml')
            frontmatter = load(node.value)

            if (frontmatter.layout) {
              currentSection = newSection(sectionIdx)
            }

            if (frontmatter.title && typeof frontmatter.title === 'string') {
              // don't do this synchronously. react complains about
              // any transitive calls to setState() called from a
              // render() method
              setTimeout(() => opts.tab.setTitle(frontmatter.title))
            }
          } catch (err) {
            console.error('Error parsing Markdown yaml frontmatter', err)
          }
        }
      } else if (currentSection) {
        if (node.type === 'thematicBreak') {
          newChildren.push(currentSection)
          currentSection = newSection(++sectionIdx)
        } else {
          currentSection.children.push(node)
        }
      } else {
        newChildren.push(node)
      }

      return newChildren
    }, [])

    if (currentSection) {
      tree.children.push(currentSection)
    }
  }
}
