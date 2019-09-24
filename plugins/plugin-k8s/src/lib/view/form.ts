/*
 * Copyright 2018-19 IBM Corporation
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

import * as Debug from 'debug'
import { safeDump } from 'js-yaml'

import { i18n, Tab } from '@kui-shell/core'
import { updateSidecarHeader } from '@kui-shell/core/webapp/views/sidecar'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'

import * as Resources from '../model/resource'

const strings = i18n('plugin-k8s')
const debug = Debug('plugin-k8s/view/form')

interface FormElement {
  parent: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  path: string[]
  key: string
  value: string | boolean | number
  placeholder?: string
  optional?: boolean
}

interface FormGroup {
  title: string
  choices: FormElement[]
}

/**
 * Update the given path in the given yaml to have the given value
 *
 */
const update = (
  parent: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  path: string[],
  value: string | number | boolean
) => {
  const key = path[path.length - 1]
  debug('update', key, parent)
  if (parent) {
    parent[key] = value
  }
}

interface FormAmendments extends HTMLElement {
  value: string
  __kuiPath: string[]
  __kuiParent: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

type ChoiceInput = HTMLInputElement & FormAmendments
type ChoiceTextArea = HTMLTextAreaElement & FormAmendments

/**
 * Save the current form choices
 *
 */
const doSave = (
  tab: Tab,
  form: HTMLFormElement,
  yaml: Resources.KubeResource,
  filepath: string,
  onSave: (rawText: string) => any, // eslint-disable-line @typescript-eslint/no-explicit-any
  button?: HTMLButtonElement
) => () => {
  if (button) {
    button.classList.add('yellow-background')
    button.classList.add('repeating-pulse')
  }

  setTimeout(async () => {
    const inputs = form.querySelectorAll('.bx--text-input')
    for (let idx = 0; idx < inputs.length; idx++) {
      const input = inputs[idx] as FormAmendments
      const path = input.__kuiPath
      const parent = input.__kuiParent
      update(parent, path, input.value)

      const label = input.getAttribute('data-form-label')
      if (label === 'name') {
        updateSidecarHeader(tab, { name: input.value })
      }
    }

    debug('doSave done extracting values', yaml)
    const { writeFile } = await import('fs-extra')
    await writeFile(filepath, safeDump(yaml))
    debug('doSave done writing file', filepath)

    if (button) {
      button.classList.remove('yellow-background')
      button.classList.remove('repeating-pulse')
    }

    onSave(safeDump(yaml))
  }, 0)
}

/**
 * Generate form groups from a given kube resource
 *
 */
const formGroups = (yaml: Resources.KubeResource): FormGroup[] => {
  const groups: FormGroup[] = []

  const push = (
    group: string,
    key: string | number,
    {
      parent = yaml,
      path = [key.toString()],
      skip = {}
    }: {
      parent?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
      path?: string[]
      skip?: Record<string, boolean>
    } = {}
  ) => {
    const formGroup = groups.find(({ title }) => title === group) || {
      title: group,
      choices: [] as FormElement[]
    }

    const { choices } = formGroup

    if (choices.length === 0) {
      // then we just created a new group
      groups.push(formGroup)
    }

    //
    // for each element of the structure, either render a leaf
    // choice or recurse into a subtree
    //
    const struct = parent[key]

    for (const key in struct) {
      if (!skip[key]) {
        const value = struct[key]
        const next = path.concat([key]) // path to this leaf or subtree

        if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
          // leaf node
          choices.push({ key, value, path: next, parent: struct })
        } else if (Array.isArray(value)) {
          // not sure what to do with arrays, yet
          if (value.length > 0) {
            if (typeof value[0] === 'string' || typeof value[0] === 'number' || typeof value[0] === 'boolean') {
              // array of strings
              choices.push({
                key,
                value: value.join(','),
                path: next,
                parent: struct
              })
            } else {
              // array of structs
            }
          }
        } else {
          // subtree: descend recursively
          // note how we intentionally flatten, for now
          push(key, key, { parent: struct, path: next })
        }
      }
    }
  }

  //
  // for now, we pick which subtrees we want to offer as choices:
  // metadata, spec, and data; note that we place metadata and spec
  // in the same group: 'Resource Definition'
  //
  push('Resource Definition', 'metadata')
  push('Resource Definition', 'spec', { skip: { service: true } })
  push('Data Values', 'data')

  // params
  if (yaml.spec && yaml.spec.params) {
    yaml.spec.params.forEach((param, idx) => {
      push(`Parameter #${idx + 1}`, idx, { parent: yaml.spec.params })
    })
  }

  // Role
  if (Resources.isRole(yaml)) {
    yaml.rules.forEach((rule, idx) => {
      push('Rules', idx, { parent: yaml.rules })
    })
  }

  // RoleBinding
  if (Resources.isRoleBinding(yaml)) {
    push('Role Reference', 'roleRef')

    yaml.subjects.forEach((subject, idx) => {
      push('Subjects', idx, { parent: yaml.subjects })
    })
  }

  // ServiceAccount
  if (Resources.isServiceAccount(yaml)) {
    yaml.secrets.forEach((secrets, idx) => {
      push('Secret', idx, { parent: yaml.secrets })
    })
  }

  return groups
}

/**
 * Present a form view over a resource
 *
 */
export const generateForm = (tab: Tab) => (
  yaml: Resources.KubeResource,
  filepath: string,
  name: string,
  kind: string,
  onSave: (rawText: string) => any // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  const formElements = formGroups(yaml)
  debug('generate form', formElements)

  const form = document.createElement('form')
  form.className = 'project-config-container padding-content overflow-auto'

  const list = document.createElement('ul')
  list.className = 'project-config-list'
  form.appendChild(list)

  const buttons = document.createElement('div')
  buttons.className = 'project-config-buttons'
  form.appendChild(buttons)

  // now we populate the form with the bits that require user input
  formElements.forEach(element => {
    debug('config element', element)

    const item = document.createElement('li')
    item.className = 'project-config-items'

    const itemRight = document.createElement('div')
    itemRight.className = 'project-config-items-right'
    item.appendChild(itemRight)

    const itemTitleOuter = document.createElement('div')
    const itemTitle = document.createElement('div')
    itemTitleOuter.className = 'result-table-title-outer'
    itemTitle.className = 'result-table-title'
    itemTitle.innerText = element.title
    itemTitleOuter.appendChild(itemTitle)
    itemRight.appendChild(itemTitleOuter)

    /* if (instructions) {
      const dom = document.createElement('div');
      dom.className = 'configSourceIns';
      dom.innerHTML = marked(instructions);
      itemRight.appendChild(dom);
      } */

    /* const links = document.createElement('div');
      links.className = 'project-config-links';
      itemRight.appendChild(links);

      // API Documentation
      if (source) {
      links.appendChild(createLink('Home Page', source));
      }

      // Registration page
      if (registration) {
      links.appendChild(createLink('Registration Page', registration));
      } */

    const form = document.createElement('div')
    form.className = 'form'
    itemRight.appendChild(form)

    const formatChoice = (extraCSS?: string) => (element: FormElement) => {
      const row = document.createElement('div')
      row.className = 'bx--form-item'
      if (extraCSS) row.classList.add(extraCSS)
      form.appendChild(row)

      const labelPart = document.createElement('label')
      labelPart.className = 'bx--label'
      labelPart.appendChild(document.createTextNode(element.key))
      row.appendChild(labelPart)

      if (element.optional) {
        const optionalPart = document.createElement('span')
        optionalPart.className = 'left-pad deemphasize'
        optionalPart.innerText = '(optional)'
        labelPart.appendChild(optionalPart)
      }

      const inputType = typeof element.value
      const inputPart =
        element.key === 'description'
          ? (document.createElement('textarea') as ChoiceTextArea)
          : (document.createElement('input') as ChoiceInput)
      inputPart.className = 'bx--text-input'
      inputPart.setAttribute('type', inputType === 'string' ? 'text' : inputType)
      inputPart.value = element.value.toString()
      inputPart.setAttribute('defaultValue', inputPart.value)
      inputPart.setAttribute('placeholder', element.placeholder || element.key)
      inputPart.setAttribute('data-typeof', inputType) // facilitate number- or boolean-specific rendering
      inputPart.setAttribute('data-form-label', element.key)
      inputPart.__kuiPath = element.path
      inputPart.__kuiParent = element.parent
      row.appendChild(inputPart)
    }

    // here, we shunt long/wide fields to the end, so that the
    // shorter ones can pack more densely onto lines
    const isLongPattern = /(description|ur[il])/i
    const isKeyLike = /key|name/i
    const { shortChoices, longChoices } =
      element.choices.length === 2 &&
      isKeyLike.test(element.choices[0].key) &&
      element.choices[1].key === 'value' &&
      isLongPattern.test(element.choices[0].value.toString())
        ? {
            shortChoices: [element.choices[0]],
            longChoices: [element.choices[1]]
          }
        : element.choices.reduce(
            (groups, choice) => {
              if (isLongPattern.test(choice.key)) {
                groups.longChoices.push(choice)
              } else {
                groups.shortChoices.push(choice)
              }
              return groups
            },
            {
              shortChoices: [] as FormElement[],
              longChoices: [] as FormElement[]
            }
          )

    shortChoices.forEach(formatChoice())
    longChoices.forEach(formatChoice('bx--form-item-wide'))

    if (form.children.length > 0) {
      list.appendChild(item)
    }
  })

  const modes: SidecarMode[] = [
    {
      mode: 'save',
      label: strings('save'),
      flush: 'right',
      actAsButton: true,
      direct: doSave(tab, form, yaml, filepath, onSave),
      visibleWhen: 'edit'
    },
    {
      mode: 'revert',
      label: strings('revert'),
      flush: 'right',
      actAsButton: true,
      direct: () => form.reset(),
      visibleWhen: 'edit'
    }
  ]

  const subtext = document.createElement('span')
  subtext.appendChild(document.createTextNode('The provider '))
  const strong = document.createElement('strong')
  strong.innerText = yaml.apiVersion
  subtext.appendChild(strong)
  subtext.appendChild(document.createTextNode(' offers configuration choices'))

  return {
    type: 'custom',
    prettyType: kind,
    isEntity: true,
    name,
    subtext,
    content: form,
    modes,
    resource: yaml
  }
}

export default generateForm
