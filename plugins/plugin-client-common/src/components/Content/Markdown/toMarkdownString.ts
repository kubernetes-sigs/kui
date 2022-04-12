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

import { u } from 'unist-builder'
import { Raw } from 'hast-util-raw'
import { Element, Parent } from 'hast'
import { toMdast } from 'hast-util-to-mdast'
import { Node } from 'hast-util-to-mdast/lib'
import { visit, CONTINUE, SKIP } from 'unist-util-visit'
import { toMarkdown } from 'mdast-util-to-markdown'

import { isTip } from './rehype-tip'
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

type Visitor = (node: Node, childIdx: number, parent: Parent) => void | typeof SKIP | typeof CONTINUE

function visitDFS(root: Node, type: string, visitors: { pre?: Visitor; post?: Visitor }) {
  const walk = (node: Node, childIdx: number, parent: Parent) => {
    let action: typeof SKIP | typeof CONTINUE = CONTINUE

    if (node.type === type) {
      if (visitors.pre) {
        action = visitors.pre(node, childIdx, parent) || CONTINUE
      }
    }

    if (action !== SKIP && isElementWithProperties(node) && Array.isArray(node.children)) {
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
  const pre = (node: Node) => {
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
        return SKIP
      } else if (isTip(node)) {
        const { className, title, open } = node.properties

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const tipContent = toMarkdownString(u('element', { tagName: 'p' }, node.children))
          .split(/\n/)
          .map(_ => indent(_))
          .join('\n')
        // ^^^ re: the <p> wrapper: otherwise, toMarkdown will oddly
        // render each child as if it were a div ¯\_(ツ)_/¯

        node['value'] = `
???${open ? '+' : ''} ${className} "${title}"

${tipContent}
`

        delete node.tagName
        delete node.children
        delete node.properties
        return SKIP
      }
    }
  }

  visitDFS(root, 'element', { pre })

  return root
}

/**
 * We need to back out some <span className="paragraph"> back to
 * <p>. We might have done this in other places to avoid nested <p>.
 */
function paragraphs(root: Node): Node {
  visit(root, 'element', node => {
    if (isElementWithProperties(node) && node.tagName === 'span' && node.properties.className === 'paragraph') {
      node.tagName = 'p'
      delete node.properties.className
    }
  })

  return root
}

/** This is the small bit of munging we need to do */
function munge(root: Node): Node {
  return paragraphs(stringifyTabs(pruneComments(pruneImports(root))))
}

/**
 * Turn a hast tree back into a markdown string. We need to do a small
 * bit of munging on the data structures to facilitate the operation.
 */
export default function toMarkdownString(root: Node): string {
  if (typeof root['value'] === 'string' && !Array.isArray(root['children'])) {
    return root['value']
  }

  return toMarkdown(toMdast(munge(JSON.parse(JSON.stringify(root)) as Node)))
    .replace(/(\\)+([=`-][=`-][=`-])/g, '$2')
    .replace(/(\\)+([[\]()*<>`])/g, '$2')
    .replace(/&#x20;/g, ' ')
}
