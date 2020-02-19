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

import { Tab, REPL, MultiModalResponse, NavResponse, isNavResponse, KuiComponent } from '@kui-shell/core'

import { Renderer, doReact } from './react'
import renderTopNavSidecar from './components/TopNavSidecar'
import renderLeftNavSidecar from './components/LeftNavSidecar'

/**
 * The job of this function is to adapt a ReactElement to the KuiComponent world
 *
 */
function render(response: NavResponse | MultiModalResponse, tab: Tab, repl: REPL, renderer: Renderer): KuiComponent {
  const entity = isNavResponse(response) ? response[Object.keys(response)[0]] : response
  if (entity) {
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
        content: doReact(tab, repl, response, renderer), // <-- here is the ReactElement
        onclick: {
          namespace: entity.onclick ? entity.onclick.namespace : undefined
        }
      }
    }
  }
}

/** thin veneer for leftnav rendering */
export function leftnav(entity: NavResponse, tab: Tab, repl: REPL): KuiComponent {
  return render(entity, tab, repl, renderLeftNavSidecar)
}

/** thin veneer for topnav rendering */
export function topnav(entity: MultiModalResponse, tab: Tab, repl: REPL): KuiComponent {
  return render(entity, tab, repl, renderTopNavSidecar)
}
