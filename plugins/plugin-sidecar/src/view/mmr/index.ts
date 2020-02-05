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

import { Tab, MultiModalResponse, Presentation, REPL } from '@kui-shell/core'

import show from './show'
import viewId from '../viewId'
import loadSidecar from '../load'

/**
 * Display the given `entity` in a sidecar view
 *
 */
export default async function render(entity: MultiModalResponse, tab: Tab, repl: REPL) {
  const { content, sidecar } = loadSidecar()

  // populate the DOM with the entity
  await show(tab, entity, sidecar, repl)

  // finally, our response:
  return {
    apiVersion: 'kui-shell/component/v1' as const,
    frame: {
      viewId,
      singleton: true as const,
      position: 'TabColumn' as const,
      presentation: entity.presentation || Presentation.Default,
      kind: entity.kind,
      metadata: {
        namespace: entity.metadata.namespace
      }
    },
    spec: {
      content,
      onclick: {
        namespace: entity.onclick ? entity.onclick.namespace : undefined
      }
    }
  }
}
