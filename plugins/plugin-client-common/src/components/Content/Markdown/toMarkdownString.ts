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

import { Raw } from 'hast-util-raw'
import { Element, Parent } from 'hast'
import { visit } from 'unist-util-visit'
import { toMdast } from 'hast-util-to-mdast'
import { Node } from 'hast-util-to-mdast/lib'
import { toMarkdown } from 'mdast-util-to-markdown'

import { isImports } from './remark-import'
import indent, { indentAll } from './indent'
import isElementWithProperties from './isElement'
import { isTabs, getTabTitle, getTabsDepth } from './components/tabbed'

export { Node }

/**
 * remark-import smashes in a container directive import. This does
 * not need to survive the backport to a markdown string.
 */
function pruneImports(root: Node) {
  visit(root, 'element', (node: Element, childIdx: number, parent: Parent) => {
    if (isImports(node.properties)) {
      if (parent && Array.isArray(parent.children)) {
        parent.children.splice(childIdx, 1)
      }
    }
  })

  return root
}

/**
 * Something, I think either toMdast to toMarkdown seems to turn
 * comments into \<!-- and that leading backslash escape messes up re-parsing.
 */
const RE_COMMENT = /<!--.*-->/g
function pruneComments(root: Node) {
  visit(root, 'raw', (node: Raw) => {
    node.value = node.value.replace(RE_COMMENT, '')
  })

  return root
}

type Visitor = (node: Node, childIdx: number, parent: Parent) => void

function visitDFS(root: Node, type: string, visitors: { pre?: Visitor; post?: Visitor }) {
  const walk = (node: Node, childIdx: number, parent: Parent) => {
    if (node.type === type) {
      if (visitors.pre) {
        visitors.pre(node, childIdx, parent)
      }
    }

    if (isElementWithProperties(node) && Array.isArray(node.children)) {
      node.children.forEach((child, childIdx) => walk(child, childIdx, node))
    }

    if (node.type === type) {
      if (visitors.post) {
        visitors.post(node, childIdx, parent)
      }
    }
  }

  walk(root, -1, null)
}

function stringifyTabs(root: Node) {
  const post = (node: Node) => {
    if (isElementWithProperties(node)) {
      if (isTabs(node.properties)) {
        const tabStackDepth = getTabsDepth(node.properties)
        const indentation = ''.padStart(tabStackDepth, '    ')

        node['value'] = indentAll(
          node.children.map(tab => {
            const tabTitle = getTabTitle(tab)

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const tabContent = indent(toMarkdownString(tab))

            return `=== "${tabTitle}"

${tabContent}
`
          }),
          indentation
        )

        delete node.tagName
        delete node.children
        delete node.properties
      } else if (node.tagName === 'tip') {
        const { className, title, open } = node.properties

        const tipContent = node.children
          .map(toMarkdownString) // eslint-disable-line @typescript-eslint/no-use-before-define
          .map(_ => indent(_))
          .join('\n')

        node['value'] = `!!!${open ? '+' : ''} ${className} "${title}"

${tipContent}
`

        delete node.tagName
        delete node.children
        delete node.properties
      }
    }
  }

  visitDFS(root, 'element', { post })

  return root
}

/** This is the small bit of munging we need to do */
function munge(root: Node) {
  return stringifyTabs(pruneComments(pruneImports(root)))
}

/**
 * Turn a hast tree back into a markdown string. We need to do a small
 * bit of munging on the data structures to facilitate the operation.
 */
export default function toMarkdownString(root: Node) {
  if (typeof root['value'] === 'string' && !Array.isArray(root['children'])) {
    return root['value']
  }

  return toMarkdown(toMdast(munge(JSON.parse(JSON.stringify(root)) as Node)))
    .replace(/(\\)+([=`-][=`-][=`-])/g, '$2')
    .replace(/(\\)+([*<>`])/g, '$2')
    .replace(/&#x20;/g, ' ')
}
