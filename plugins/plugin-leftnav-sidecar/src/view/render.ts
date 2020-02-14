/*
 * Copyright 2020 IBM Corporation
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

import { render as ReactDomRender } from 'react-dom'
import { Tab, REPL, MultiModalResponse, KuiComponent } from '@kui-shell/core'

import renderLeftNavSidecar from './LeftNavSidecar'

/**
 * Hacks for tests, until we figure out:
 *  1) how to get a className or attribute on the SideNavMenu header part
 *  2) how to get data-mode on the clickable parts of the left nav
 */
function hackForTests(wrapper: HTMLElement) {
  // the first hack
  try {
    const name = wrapper.querySelector('.bx--side-nav__items button.bx--side-nav__submenu')
    if (name) {
      name.classList.add('entity-name')
    }

    // the second hack
    const modeButtons = wrapper.querySelectorAll('.kui--mode-placeholder')
    for (let idx = 0; idx < modeButtons.length; idx++) {
      modeButtons[idx].parentElement.parentElement.setAttribute('data-mode', modeButtons[idx].getAttribute('data-mode'))
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * Format the leftnav sidecar view
 *
 */
export function doReact(tab: Tab, repl: REPL, response: MultiModalResponse) {
  // render the view
  const view = renderLeftNavSidecar(tab, repl, response)

  // Note: the wrapper is needed to get React events to work; it seems
  // not to work with a DocumentFragment
  const wrapper = document.createElement('div') // <-- temporarily wrap for React
  ReactDomRender(view, wrapper)

  // hack for tests, until we figure out the title part
  hackForTests(wrapper)

  const content = document.createDocumentFragment()
  content.appendChild(wrapper.firstElementChild) // <-- then unwrap
  return content
}

/**
 * Render the table, then return a KuiComponent
 *
 */
export default function render(entity: MultiModalResponse, tab: Tab, repl: REPL): KuiComponent {
  return {
    apiVersion: 'kui-shell/component/v1' as const,
    frame: {
      viewId: 'kui-default-sidecar',
      singleton: true as const,
      position: 'TabColumn' as const,
      presentation: entity.presentation,
      kind: entity.kind,
      metadata: {
        namespace: entity.metadata.namespace
      }
    },
    spec: {
      content: doReact(tab, repl, entity)
    }
  }
}
