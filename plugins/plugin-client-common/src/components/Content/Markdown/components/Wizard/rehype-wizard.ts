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

import { v4 } from 'uuid'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { Content, Element, Parent, Root } from 'hast'
import { visitParents } from 'unist-util-visit-parents'

import { isImports } from '../../remark-import'
import { WizardSteps, PositionProps } from '../../KuiFrontmatter'
import isElementWithProperties, { isElement } from '../../isElement'
import { GroupMember as CodeBlockGroupMember } from './CodeBlockProps'

type Primordial = Pick<CodeBlockGroupMember, 'group'> & {
  title: string
  description: Element
  steps: Element[]
  progress: Required<WizardSteps['wizard']['progress']>
  splitCount: number
  isOnAnImportChain: boolean
}

interface GroupMember {
  'data-kui-group': CodeBlockGroupMember['group']
  'data-kui-member': CodeBlockGroupMember['member']
}

interface Title {
  'data-kui-title': string
}

interface Description {
  'data-kui-description': string
}

export type WizardProps = Title &
  Partial<Description> & {
    children: {
      props: Title & Partial<Description> & { containedCodeBlocks?: string; children?: React.ReactNode[] }
    }[]
  }

type WizardStepProps = GroupMember &
  Title &
  Partial<Description> & {
    'data-kui-split-count': number
  }

export function getTitle(props: Partial<Title>) {
  return props['data-kui-title']
}

export function getDescription(props: Partial<Description>) {
  return props['data-kui-description']
}

export function getWizardGroup(props: WizardStepProps) {
  return props['data-kui-wizard-group']
}

export function getWizardStepMember(props: WizardStepProps) {
  return props['data-kui-wizard-member']
}

const REMOVED_HEADING_PLACEHOLDER_TEXT = '<!-- removed heading -->'

function removedHeading() {
  return u('raw', REMOVED_HEADING_PLACEHOLDER_TEXT)
}

export function isHeading(node: Content) {
  return isElementWithProperties(node) && /^h\d+$/.test(node.tagName)
}

export function isHeadingOrRemovedHeading(node: Content) {
  if (isHeading(node)) {
    // normal heading
    return true
  } else if (node.type === 'raw' && node.value === REMOVED_HEADING_PLACEHOLDER_TEXT) {
    // removed heading
    return true
  }
}

/**
 * This rehype plugin transforms wizard step headers.
 */
function transformer(ast: Root) {
  /** Treat headings that parents of nodes marked as Wizards as wizard steps */
  function extractStepTitlesFromHeadingsVisitor() {
    const node: Element = arguments[0] // eslint-disable-line prefer-rest-params
    const idx: number = arguments[1] // eslint-disable-line prefer-rest-params
    const parent: Element = arguments[2] // eslint-disable-line prefer-rest-params

    if (/^h\d+/.test(node.tagName) && parent) {
      if (
        parent.tagName === 'div' &&
        parent.properties['data-kui-split'] === 'wizard' &&
        node.children.length > 0 &&
        node.children[0].type === 'text'
      ) {
        const firstNonCommentIdx = parent.children.findIndex(_ => _.type !== 'raw')

        if (idx === firstNonCommentIdx) {
          const [title, description] = node.children[0].value.split(/\s*:\s*/)
          parent.properties['data-kui-title'] = title
          parent.properties['data-kui-description'] = description

          // remove it from the AST, since we've folded it in as a step title
          parent.children[idx] = removedHeading()

          // DO NOT DO THIS! the `visit` logic will skip over the next child :(
          // parent.children.splice(idx, 1)
        }
      }
    }
  }

  const wizard: Primordial = {
    group: v4(),
    splitCount: 0,
    title: '',
    description: undefined,
    progress: 'bar',
    steps: [],
    isOnAnImportChain: false
  }

  function extractStepsFromDivsVisitor(node: Element, ancestors: Parent[]) {
    // const node: Element = arguments[0] // eslint-disable-line prefer-rest-params
    // const idx: number = arguments[1] // eslint-disable-line prefer-rest-params
    // const parent: Element = arguments[2] // eslint-disable-line prefer-rest-params

    if (node.tagName === 'div' && node.properties['data-kui-split'] === 'wizard' && parent) {
      delete node.properties['data-kui-split']

      if (wizard.steps.length === 0) {
        if (ancestors.find(_ => isElementWithProperties(_) && isImports(_.properties))) {
          wizard.isOnAnImportChain = true
        }

        if (node.properties['data-kui-wizard-progress']) {
          wizard.progress = node.properties['data-kui-wizard-progress'].toString() as 'bar' | 'none'
        }

        const splitCount = node.properties['data-kui-split-count']
        if (!wizard.title && typeof splitCount !== 'undefined') {
          wizard.splitCount = typeof splitCount === 'number' ? splitCount : parseInt(splitCount.toString(), 10)
        }
      }

      if (!node.properties['data-kui-title']) {
        // spurious case, problem some blank newlines
        return
      } else if (wizard.steps.length === 0 && !wizard.title) {
        wizard.title =
          (node.properties['data-kui-title'] || ' ') +
          (node.properties['data-kui-description'] ? ': ' + node.properties['data-kui-description'] : '')

        // Ugh, work around nested <p>. The div comes from us, so that
        // part is safe (sections in the markdown become this div; and
        // this is the first section). We also have to avoid having
        // <div> under <p>. The offending parent <p> comes from
        // PatternFly's Wizard header description :(
        node.tagName = 'span' // top-most div -> span
        node.children = node.children.map(child =>
          !isElement(child) || child.tagName !== 'p'
            ? child
            : Object.assign({}, child, { tagName: 'span', properties: { className: 'paragraph' } })
        )

        wizard.description = node
      } else {
        node.properties.containedCodeBlocks = []
        node.properties['data-kui-wizard-group'] = wizard.group
        node.properties['data-kui-wizard-member'] = wizard.steps.length
        wizard.steps.push(node)
      }

      const parent = ancestors[ancestors.length - 1]
      if (parent) {
        const idx = parent.children.findIndex(child => child === node)
        if (idx >= 0) {
          parent.children[idx] = u('raw', '<!-- removed step source -->')

          // DO NOT DO THIS! the `visit` logic will skip over the next child :(
          // parent.children.splice(idx, 1)
        }
      }
    }
  }

  visit(ast, 'element', extractStepTitlesFromHeadingsVisitor)
  visitParents(ast, 'element', extractStepsFromDivsVisitor)

  if (wizard.steps.length > 0 || wizard.title.trim() || wizard.description) {
    ast.children.push(
      u(
        'element',
        {
          tagName: 'div',
          properties: {
            'data-kui-split': 'wizard',
            'data-kui-title': wizard.title,
            'data-kui-split-count': wizard.splitCount,
            'data-kui-wizard-progress': wizard.progress,
            'data-kui-is-from-import': wizard.isOnAnImportChain.toString(),
            'data-kui-code-blocks': [] // rehype-imports will populate this
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

export function isWizardStep(props: Partial<WizardStepProps>): props is WizardStepProps {
  const stepProps = props as WizardStepProps
  return typeof stepProps['data-kui-title'] === 'string' && typeof stepProps['data-kui-split-count'] === 'number'
}

export default function wizard() {
  return transformer
}
