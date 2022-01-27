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

import { Heading } from 'mdast'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { Literal, Node, Root } from 'hast'
import { visitParents } from 'unist-util-visit-parents'

import { Tab } from '@kui-shell/core'

import KuiFrontmatter, { hasWizardSteps, isValidPosition, isValidPositionObj } from './KuiFrontmatter'

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

export function splitTarget(node) {
  if (node.type === 'raw') {
    const match = node.value.match(/<!-- ____KUI__SECTION_START____ (.*)/)
    if (match) {
      return match[1]
    }
  }
}

function isLiteral(node: Node): node is Literal {
  return typeof (node as Literal).value === 'string'
}

/** Parse out the frontmatter at the top of a markdown file */
function extractKuiFrontmatter(tree): KuiFrontmatter {
  // e.g.
  // layout:
  //    1: left
  //    default: wizard
  let frontmatter: KuiFrontmatter

  visit(tree, 'yaml', node => {
    if (isLiteral(node) && node.value) {
      try {
        const { load } = require('js-yaml')
        frontmatter = load(node.value)

        return false // stop traversing immediately
      } catch (err) {
        console.error('Error parsing Markdown yaml frontmatter', err)
      }
    }
  })

  return frontmatter
}

/** Scan and process the `wizard` schema of the given `frontmatter` */
function preprocessWizardSteps(tree: Root, frontmatter: KuiFrontmatter) {
  if (hasWizardSteps(frontmatter)) {
    if (!frontmatter.layout) {
      frontmatter.layout = 'wizard'
    }

    visitParents<Heading>(tree, 'heading', (node, ancestors) => {
      if (
        node.children &&
        node.children[0] &&
        node.children[0].type === 'text' &&
        ancestors.length > 0 &&
        frontmatter.wizard.steps.includes(node.children[0].value)
      ) {
        const parent = ancestors[ancestors.length - 1]
        const childIdx = parent.children.findIndex(_ => _ === node)
        if (childIdx >= 0) {
          if (parent.children[childIdx - 1].type !== 'thematicBreak') {
            parent.children.splice(childIdx, 0, u('thematicBreak'))
          }
        }
      }
    })
  }
}

/** Scan and process the `layout` schema of the given `frontmatter` */
function extractSplitsAndSections(tree /*: Root */, frontmatter: KuiFrontmatter) {
  let sectionIdx = 1
  let currentSection // : { type: 'kui-split', value: string, children: [] }

  const defaultPosition = () => (frontmatter && frontmatter.layout ? frontmatter.layout['default'] : undefined)

  const newSection = (sectionIdx: number) => {
    const positionAsGiven =
      frontmatter.layout === 'wizard' ? 'wizard' : frontmatter.layout[sectionIdx] || defaultPosition()

    const position = isValidPosition(positionAsGiven)
      ? positionAsGiven
      : !isValidPositionObj(positionAsGiven)
      ? 'default'
      : positionAsGiven.position

    // text to place in empty sections
    const placeholder = isValidPositionObj(positionAsGiven) ? positionAsGiven.placeholder : undefined

    const maximized =
      isValidPositionObj(positionAsGiven) &&
      (positionAsGiven.maximized === true || positionAsGiven.maximized === 'true')

    const count = frontmatter.layoutCount[position] || 0
    frontmatter.layoutCount[position] = count + 1

    return u(
      'subtree',
      {
        data: {
          hProperties: {
            'data-kui-split': position,
            'data-kui-maximized': maximized.toString(),
            'data-kui-split-count': count,
            'data-kui-placeholder': placeholder
          }
        }
      },
      []
    )
  }

  if (frontmatter.layout) {
    frontmatter.layoutCount = {}
    currentSection = newSection(sectionIdx)
  }

  if (currentSection) {
    tree.children = tree.children.reduce((newChildren, node) => {
      if (currentSection) {
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

    tree.children.push(currentSection)
  }
}

/** Look for frontmatter and sections */
export function kuiFrontmatter(opts: { tab: Tab }) {
  return (tree: Root) => {
    const frontmatter = extractKuiFrontmatter(tree)

    if (frontmatter) {
      if (frontmatter.title && typeof frontmatter.title === 'string') {
        // don't do this synchronously. react complains about
        // any transitive calls to setState() called from a
        // render() method
        setTimeout(() => opts.tab.setTitle(frontmatter.title))
      }

      preprocessWizardSteps(tree, frontmatter)
      extractSplitsAndSections(tree, frontmatter)
    }
  }
}
