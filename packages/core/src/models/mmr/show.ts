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

import { Tab } from '../../webapp/tab'
import { MetadataBearing } from '../entity'
import { CustomSpec, isCustomSpec, showCustom, insertView } from '../../webapp/views/sidecar'
import { DirectViewControllerFunction, SidecarMode } from '../../webapp/bottom-stripe'
import { isTable, isMultiTable } from '../../webapp/models/table'
import { formatTable } from '../../webapp/views/table'

import { MultiModalResponse, Button } from './types'
import {
  Content,
  hasContent,
  ScalarResource,
  ScalarContent,
  isCommandStringContent,
  isFunctionContent
} from './content-types'

type Viewable = CustomSpec | DirectViewControllerFunction<void | CustomSpec, HTMLElement | void>

function isCustom(spec: Viewable): spec is CustomSpec {
  return isCustomSpec(spec as CustomSpec)
}

/**
 * Turn a Resource into a Viewable
 *
 */
async function format<T extends MetadataBearing>(
  tab: Tab,
  mmr: MultiModalResponse<T>,
  resource: ScalarResource | Content<T>
): Promise<Viewable> {
  if (!hasContent(resource)) {
    // then we have a plain resource. the rest of this function
    // assumes a Content structure, so wrap it up as such
    return format(tab, mmr, { content: resource })
  } else if (isFunctionContent(resource)) {
    // then resource.content is a funciton that will provide the information
    return format(tab, mmr, resource.content(tab, mmr))
  } else if (isCommandStringContent(resource)) {
    const content = await tab.REPL.qexec<ScalarResource | ScalarContent>(resource.content)
    return format(tab, mmr, content)
  } else if (isCustomSpec(resource.content)) {
    return resource.content
  } else if (isTable(resource.content) || isMultiTable(resource.content)) {
    const content = resource.content
    return (tab, entity) => {
      const dom1 = document.createElement('div')
      const dom2 = document.createElement('div')
      dom1.classList.add('scrollable', 'scrollable-auto')
      dom2.classList.add('result-as-table', 'repl-result')
      dom1.appendChild(dom2)
      formatTable(tab, content, dom2)
      if (entity) {
        insertView(tab)(dom1)
      } else {
        return dom1
      }
    }
  } else {
    // otherwise, we have string or HTMLElement content
    return Object.assign({ kind: mmr.kind, metadata: mmr.metadata, version: mmr.version, type: 'custom' }, resource)
  }
}

function formatButtons(buttons: Button[]): SidecarMode[] {
  return buttons.map(({ mode, label, command, confirm }) => ({
    mode,
    label,
    flush: 'right',
    direct: confirm ? `confirm "${command}"` : command
  }))
}

/**
 * Render a MultiModalResponse to the sidecar
 *
 */
export async function show(tab: Tab, mmr: MultiModalResponse) {
  const modes: SidecarMode<Viewable>[] = await Promise.all(
    mmr.modes.map(async _ => ({
      mode: _.mode,
      label: _.label || _.mode,
      direct: isCustomSpec(_) ? _ : await format(tab, mmr, _),
      defaultMode: _.defaultMode,
      leaveBottomStripeAlone: true
    }))
  )

  const modesWithButtons: SidecarMode[] = mmr.buttons
    ? (modes as SidecarMode[]).concat(formatButtons(mmr.buttons))
    : (modes as SidecarMode[])

  modes.forEach(_ => {
    if (isCustom(_.direct)) {
      _.direct.modes = modesWithButtons
    }
  })

  if (!modes.find(_ => _.defaultMode)) {
    modes[0].defaultMode = true
  }

  const defaultMode = modes.find(_ => _.defaultMode) || modes[0]

  if (isCustom(defaultMode.direct)) {
    return showCustom(tab, defaultMode.direct)
  } else {
    const content = await defaultMode.direct(tab)
    if (content) {
      return showCustom(tab, {
        type: 'custom',
        kind: mmr.kind,
        metadata: mmr.metadata,
        toolbarText: mmr.toolbarText,
        version: mmr.version,
        modes: modesWithButtons,
        content
      })
    } else {
      console.error('empty content')
    }
  }
}
