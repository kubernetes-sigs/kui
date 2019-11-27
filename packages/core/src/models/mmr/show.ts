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
import { CustomSpec } from '../../webapp/views/sidecar-core'
import { isCustomSpec } from '../../webapp/views/custom-content'
import { SidecarMode, addModeButtons } from '../../webapp/bottom-stripe'
import { isTable, isMultiTable, Table, MultiTable } from '../../webapp/models/table'

import { MultiModalResponse, isButton } from './types'
import {
  Content,
  hasContent,
  ScalarResource,
  ScalarContent,
  isScalarContent,
  isCommandStringContent,
  isStringWithOptionalContentType,
  isFunctionContent
} from './content-types'

import { formatButtons } from './button'

type Viewable = CustomSpec | HTMLElement | Table | MultiTable

/**
 * Turn a Resource into a Viewable
 *
 */
export async function format<T extends MetadataBearing>(
  tab: Tab,
  mmr: T,
  resource: ScalarResource | Content<T>
): Promise<Viewable> {
  if (!hasContent(resource)) {
    // then we have a plain resource. the rest of this function
    // assumes a Content structure, so wrap it up as such
    return format(tab, mmr, { content: resource })
  } else if (isFunctionContent(resource)) {
    // then resource.content is a function that will provide the information
    return format(tab, mmr, await resource.content(tab, mmr))
  } else if (isCommandStringContent(resource)) {
    const content = await tab.REPL.qexec<ScalarResource | ScalarContent>(resource.contentFrom)
    if (resource.contentType && typeof content === 'string') {
      return format(tab, mmr, {
        content,
        contentType: resource.contentType
      })
    } else {
      return format(tab, mmr, content)
    }
  } else if (isCustomSpec(resource.content)) {
    return resource.content
  } else if (isTable(resource.content) || isMultiTable(resource.content)) {
    return resource.content
  } else {
    // otherwise, we have string or HTMLElement content
    return Object.assign(
      { resource: mmr, toolbarText: mmr.toolbarText, kind: mmr.kind, metadata: mmr.metadata, type: 'custom' as const },
      resource
    )
  }
}

async function wrapTable(tab: Tab, table: Table | MultiTable): Promise<HTMLElement> {
  const dom1 = document.createElement('div')
  const dom2 = document.createElement('div')
  dom1.classList.add('scrollable', 'scrollable-auto')
  dom2.classList.add('result-as-table', 'repl-result')
  dom1.appendChild(dom2)

  const { formatTable } = await import('../../webapp/views/table')
  formatTable(tab, table, dom2)

  return dom1
}

async function renderContent<T extends MetadataBearing>(
  tab: Tab,
  bearer: T,
  content: Content<T> | MetadataBearing | SidecarMode
): Promise<ScalarContent> {
  if (isStringWithOptionalContentType(content)) {
    return content
  } else if (isFunctionContent(content)) {
    const actualContent = (await content.content(tab, bearer)) as ScalarResource | ScalarContent
    if (!isScalarContent(actualContent)) {
      if (isTable(actualContent) || isMultiTable(actualContent)) {
        return {
          content: await wrapTable(tab, actualContent)
        }
      } else {
        return {
          content: actualContent
        }
      }
    } else {
      return actualContent
    }
  } else if (isScalarContent(content)) {
    return content
  } else if (isTable(content) || isMultiTable(content)) {
    return {
      content: await wrapTable(tab, content)
    }
  }
}

/**
 * Render a MultiModalResponse to the sidecar
 *
 */
export async function show(tab: Tab, mmr: MultiModalResponse) {
  const modes: SidecarMode[] = await Promise.all(
    mmr.modes.map(async _ => ({
      mode: _.mode,
      label: _.label || _.mode,
      direct: (tab: Tab) => {
        if (isCustomSpec(_)) {
          return _
        } else {
          return format(tab, mmr, _)
        }
      },
      defaultMode: _.defaultMode,
      toolbarText: mmr.toolbarText,
      leaveBottomStripeAlone: true
    }))
  )

  if (!modes.find(_ => _.defaultMode) && modes.length > 0) {
    modes[0].defaultMode = true
  }

  const buttons = mmr.buttons ? formatButtons(tab, mmr, mmr.buttons) : ([] as SidecarMode[])
  const ourModesWithButtons = modes.concat(buttons)

  const modesWithButtons = addModeButtons(tab, ourModesWithButtons, mmr, {
    preserveBackButton: true,
    show: mmr.defaultMode
  })
  const defaultMode = modesWithButtons.find(_ => _.defaultMode) || modesWithButtons[0]

  if (isButton(defaultMode)) {
    console.error('default mode is a button', defaultMode, mmr)
    throw new Error('Internal Error')
  }

  const content = hasContent(defaultMode)
    ? defaultMode
    : typeof defaultMode.direct === 'function'
    ? await defaultMode.direct(tab, mmr)
    : undefined // defaultMode.direct

  if (content) {
    if (isCustomSpec(content)) {
      const { showCustom } = await import('../../webapp/views/sidecar')
      return showCustom(tab, Object.assign({ modes: modesWithButtons, toolbarText: mmr.toolbarText }, content), {
        leaveBottomStripeAlone: true
      })
    } else {
      const custom: CustomSpec = Object.assign(
        {
          type: 'custom' as const,
          resource: mmr,
          modes: modesWithButtons,
          toolbarText: mmr.toolbarText,
          prettyName: mmr.prettyName,
          nameHash: mmr.nameHash
        },
        await renderContent(tab, mmr, content)
      )

      const { showCustom } = await import('../../webapp/views/sidecar')
      return showCustom(tab, custom, { leaveBottomStripeAlone: true })
    }
  } else {
    console.error('empty content')
  }
}
