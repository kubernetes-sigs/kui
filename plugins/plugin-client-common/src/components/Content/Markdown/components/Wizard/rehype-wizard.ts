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
import { visitParents } from 'unist-util-visit-parents'

import { PositionProps } from '../../frontmatter'

interface Primordial {
  title: string
  description: string
  steps: any[]
}

interface Title {
  'data-kui-title': string
}

interface Description {
  'data-kui-description'?: string
}

export type WizardProps = Title & {
  children: {
    props: Title & Description & { containedCodeBlocks?: string; children?: React.ReactNode[] }
  }[]
}

/**
 * This rehype plugin transforms wizard step headers.
 */
function transformer(ast) {
  /** Treat headings that parents of nodes marked as Wizards as wizard steps */
  function headingVisitor(node, ancestors) {
    if (ancestors.length > 0) {
      const parent = ancestors[ancestors.length - 1]
      if (
        parent.tagName === 'div' &&
        parent.properties['data-kui-split'] === 'wizard' &&
        node.children.length > 0 &&
        node.children[0].type === 'text'
      ) {
        const idx = parent.children.findIndex(_ => _ === node)
        if (idx === 0) {
          const [title, description] = node.children[0].value.split(/\s*:\s*/)
          parent.properties['data-kui-title'] = title
          parent.properties['data-kui-description'] = description

          // remove it from the AST, since we've folded it in as a step title
          parent.children.splice(idx, 1)
        }
      }
    }
  }

  const wizard: Primordial = {
    title: '',
    description: '',
    steps: []
  }

  function stepsVisitor(node, ancestors) {
    if (node.tagName === 'div' && node.properties['data-kui-split'] === 'wizard' && ancestors.length > 0) {
      delete node.properties['data-kui-split']

      if (wizard.steps.length === 0 && !wizard.title) {
        wizard.title = node.properties['data-kui-title']

        // Ugh, work around nested <p>. The div comes from us, so that
        // part is safe (sections in the markdown become this div; and
        // this is the first section). We also have to avoid having
        // <div> under <p>. The offending parent <p> comes from
        // PatternFly's Wizard header description :(
        node.tagName = 'span' // top-most div -> span
        node.children = node.children.map(child =>
          child.tagName !== 'p'
            ? child
            : Object.assign({}, child, { tagName: 'span', properties: { className: 'paragraph' } })
        )
        wizard.description = node
      } else {
        node.properties.containedCodeBlocks = []
        wizard.steps.push(node)
      }

      const parent = ancestors[ancestors.length - 1]
      const idx = parent.children.findIndex(_ => _ === node)
      if (idx >= 0) {
        parent.children.splice(idx, 1)
      }
    }
  }

  visitParents(ast, 'element', headingVisitor)
  visitParents(ast, 'element', stepsVisitor)

  if (wizard.steps.length > 0) {
    ast.children.push(
      u(
        'element',
        {
          tagName: 'div',
          properties: {
            'data-kui-split': 'wizard',
            'data-kui-title': wizard.title
          }
        },
        [wizard.description, ...wizard.steps]
      )
    )
  }
}

export function isWizard(props: Partial<PositionProps> | WizardProps): props is WizardProps {
  return props['data-kui-split'] === 'wizard'
}

export default function wizard() {
  return transformer
}
