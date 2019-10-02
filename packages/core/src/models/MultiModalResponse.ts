/*
 * Copyright 2019 IBM Corporation
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

import { Tab } from '../webapp/cli'
import { Entity, MetadataBearing, isMetadataBearing } from './entity'
import { CustomSpec, isCustomSpec, showCustom, insertView } from '../webapp/views/sidecar'
import { DirectViewControllerFunction, SidecarMode } from '../webapp/bottom-stripe'
import { Table, MultiTable, isTable, isMultiTable } from '../webapp/models/table'
import { formatTable } from '../webapp/views/table'

type NonCustomTypes = string | HTMLElement | Table | MultiTable
type AllSupportedTypes = CustomSpec | NonCustomTypes

export interface MultiModalResponse extends MetadataBearing {
  modes: {
    mode: string
    label?: string
    content: AllSupportedTypes
    contentType?: 'text/markdown' | 'text/html'
    defaultMode?: boolean
  }[]
}

export function isMultiModalResponse(entity: Entity): entity is MultiModalResponse {
  const mmr = entity as MultiModalResponse
  return (
    isMetadataBearing(mmr) &&
    mmr.modes &&
    Array.isArray(mmr.modes) &&
    mmr.modes[0] &&
    mmr.modes[0].content !== undefined
  )
}

type Modes = SidecarMode<CustomSpec | DirectViewControllerFunction>[]

function formatContent(
  tab: Tab,
  mmr: MultiModalResponse,
  content: AllSupportedTypes,
  contentType: string
): CustomSpec | DirectViewControllerFunction {
  if (isCustomSpec(content)) {
    return content
  } else if (isTable(content) || isMultiTable(content)) {
    return () => {
      const dom1 = document.createElement('div')
      const dom2 = document.createElement('div')
      dom1.classList.add('scrollable', 'scrollable-auto')
      dom2.classList.add('result-as-table', 'repl-result')
      dom1.appendChild(dom2)
      formatTable(tab, content, dom2)
      insertView(tab)(dom1)
    }
  } else {
    return { kind: mmr.kind, metadata: mmr.metadata, type: 'custom', content, contentType }
  }
}

/**
 * Render a MultiModalResponse to the sidecar
 *
 */
export function show(tab: Tab, mmr: MultiModalResponse) {
  const modes: Modes = mmr.modes.map(_ => ({
    mode: _.mode,
    label: _.label,
    direct: isCustomSpec(_) ? _ : formatContent(tab, mmr, _.content, _.contentType),
    defaultMode: _.defaultMode,
    leaveBottomStripeAlone: true
  }))

  modes.forEach(_ => {
    if (typeof _.direct !== 'function') {
      _.direct.modes = modes
    }
  })

  if (!modes.find(_ => _.defaultMode)) {
    modes[0].defaultMode = true
  }

  const defaultMode = modes.find(_ => _.defaultMode) || modes[0]

  return showCustom(tab, defaultMode.direct as CustomSpec)
}
