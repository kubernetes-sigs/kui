/*
 * Copyright 2018 IBM Corporation
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

const debug = require('debug')('k8s/form-renderer')

import { safeDump } from 'js-yaml'

import { ITab } from '@kui-shell/core/webapp/cli'
import { updateSidecarHeader } from '@kui-shell/core/webapp/views/sidecar'

import { IKubeResource } from '../model/resource'

export interface IFormGroup {
  title: string
  choices: Array<IFormElement>
}

export interface IFormElement {
  path: Array<string>
  key: string
  value: string | boolean | number
  placeholder?: string
  optional?: boolean
}

/**
 * Traverse the given yaml
 *
 */
const findParent = (yaml, path: Array<string>) => {
  if (!yaml || path.length === 1) {
    throw new Error('Cannot find path')
  } else {
    const desiredKey = path[0]
    for (let key in yaml) {
      if (key === desiredKey) {
        if (path.length === 2) {
          return yaml[key]
        } else {
          return findParent(yaml[key], path.slice(1))
        }
      }
    }
  }
}

/**
 * Update the given path in the given yaml to have the given value
 *
 */
const update = (yaml, path: Array<string>, value: string | number | boolean) => {
  const key = path[path.length - 1]
  const parent = findParent(yaml, path)
  if (parent) {
    parent[key] = value
  }
}

/**
 * Save the current form choices
 *
 */
const doSave = (tab: ITab, form: HTMLFormElement, yaml: object, filepath: string, onSave: (rawText: string) => any, button?: HTMLButtonElement) => () => {
  if (button) {
    button.classList.add('yellow-background')
    button.classList.add('repeating-pulse')
  }

  setTimeout(async () => {
    const inputs = form.querySelectorAll('input')
    for (let idx = 0; idx < inputs.length; idx++) {
      const input = inputs[idx] as HTMLInputElement
      const path = input['__path']
      update(yaml, path, input.value)

      const label = input.getAttribute('data-form-label')
      if (label === 'name') {
        updateSidecarHeader(tab, { name: input.value })
      }
    }

    debug('doSave done extracting values', yaml)
    const { safeDump } = require('js-yaml')
    const { writeFile } = require('fs-extra')
    await writeFile(filepath, safeDump(yaml))
    debug('doSave done writing file')

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
const formGroups = (yaml: IKubeResource): Array<IFormGroup> => {
  const groups: Array<IFormGroup> = []

  const push = (group: string, key: string, { parent = yaml, path = [key], skip = {} } = {}) => {
    const formGroup = groups.find(({ title }) => title === group)
      || { title: group, choices: [] }

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
    for (let key in struct) {
      if (!skip[key]) {
        const value = struct[key]
        const next = path.concat([key]) // path to this leaf or subtree

        if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
          // leaf node
          choices.push({ key, value, path: next })
        } else if (!Array.isArray(value)) { // not sure what to do with arrays, yet
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

  return groups
}

/**
 * Present a form view over a resource
 *
 */
export const generateForm = (tab: ITab) => (yaml: IKubeResource, filepath: string, name: string, kind: string, onSave: (rawText) => any) => {
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

    const itemTitle = document.createElement('div')
    itemTitle.className = 'config-item-title'
    itemTitle.innerText = element.title
    itemRight.appendChild(itemTitle)

    /*if (instructions) {
      const dom = document.createElement('div');
      dom.className = 'configSourceIns';
      dom.innerHTML = marked(instructions);
      itemRight.appendChild(dom);
      }*/

    /*const links = document.createElement('div');
      links.className = 'project-config-links';
      itemRight.appendChild(links);

      // API Documentation
      if (source) {
      links.appendChild(createLink('Home Page', source));
      }

      // Registration page
      if (registration) {
      links.appendChild(createLink('Registration Page', registration));
      }*/

    const form = document.createElement('div')
    form.className = 'form'
    itemRight.appendChild(form)

    const formatChoice = (extraCSS?: string) => element => {
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
      const inputPart = document.createElement('input')
      inputPart.className = 'bx--text-input'
      inputPart.setAttribute('type', inputType === 'string' ? 'text' : inputType)
      inputPart.setAttribute('value', element.value) // note: not .value=, as that doesn't work with form.reset()
      inputPart.setAttribute('placeholder', element.placeholder || element.key)
      inputPart.setAttribute('data-typeof', inputType) // facilitate number- or boolean-specific rendering
      inputPart.setAttribute('data-form-label', element.key)
      inputPart['__path'] = element.path
      row.appendChild(inputPart)
    }

    // here, we shunt long/wide fields to the end, so that the
    // shorter ones can pack more densely onto lines
    const isLongPattern = /(description|ur[il])/i
    const longChoices = element.choices.filter(_ => _.key.match(isLongPattern))
    const shortChoices = element.choices.filter(_ => !_.key.match(isLongPattern))

    shortChoices.forEach(formatChoice())
    longChoices.forEach(formatChoice('bx--form-item-wide'))

    if (form.children.length > 0) {
      list.appendChild(item)
    }
  })

  const modes = [
    { mode: 'save', flush: 'right', actAsButton: true, direct: doSave(tab, form, yaml, filepath, onSave) },
    { mode: 'revert', flush: 'right', actAsButton: true, direct: () => form.reset() }
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
    modes
  }
}
