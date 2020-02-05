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

import { Tab } from '../tab'
import { KuiComponent, isSingleton } from './component'
// import { isKuiDocumentFragment } from './content'

export default class KuiFrame {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility,no-useless-constructor
  constructor(private readonly component: KuiComponent, tab: Tab) {
    const container =
      component.spec.position === 'TabColumn' ? tab.querySelector('tabcolumn') : tab.querySelector('tabrow')

    if (isSingleton(component)) {
      const { viewId } = component.spec
      const existing = container.querySelector(`[data-view-id=${viewId}]`)
      if (existing) {
        existing.remove()
      }
    }

    // const sidecar = document.createElement('sidecar')
    // const frame = document.createElement('iframe')
    // frame.sandbox.add('allow-scripts', 'allow-same-origin')
    // sidecar.appendChild(frame)

    const sidecar = component.spec.content
    container.appendChild(sidecar)
    // sidecar.classList.add('visible')

    /* const blob = new Blob([component.spec.css], { type: 'text/css' })
    const css = URL.createObjectURL(blob)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = css
    frame.contentDocument.head.appendChild(link) */

    // frame.contentDocument.body.appendChild(component.spec.content)
    // sidecar.appendChild(component.spec.content)
  }
}
