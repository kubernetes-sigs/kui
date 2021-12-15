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
import { KResponse } from '@kui-shell/core'

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

export function codeWithResponseFrontmatter(body: string, language: string, response?: KResponse) {
  const frontmatter = !response
    ? ''
    : `---
response: ${JSON.stringify(response)}
---
`

  return `\`\`\`${language || ''}
${frontmatter}${body}
\`\`\``
}

interface KuiFrontmatter {
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
export function kuiFrontmatter() {
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
