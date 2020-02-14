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

import {
  isButton,
  ResourceByReferenceWithContent,
  MultiModalResponse,
  isTable,
  Table,
  Tab,
  REPL,
  ResourceWithMetadata as MetadataBearing,
  Mode as SidecarMode,
  Content,
  hasContent,
  ScalarResource,
  ScalarContent,
  isScalarContent,
  isCommandStringContent,
  StringContent,
  isStringWithOptionalContentType,
  isFunctionContent
} from '@kui-shell/core'

import { Sidecar } from '../../model/sidecar'
import { addModeButtons } from './bottom-stripe'

import '../../../web/css/static/sidecar-main.css'

type TabPresentableContent = ResourceByReferenceWithContent | HTMLElement | Table | ScalarResource

/**
 * Turn a Resource into content that can be presented in a sidecar tab
 *
 */
export async function formatForTab<T extends MetadataBearing>(
  tab: Tab,
  mmr: T,
  resource: ScalarResource | Content<T>
): Promise<TabPresentableContent> {
  if (!hasContent(resource)) {
    // then we have a plain resource. the rest of this function
    // assumes a Content structure, so wrap it up as such
    if (isScalarContent({ content: resource })) {
      return resource
    } else {
      return formatForTab(tab, mmr, { content: resource })
    }
  } else if (isFunctionContent(resource)) {
    // then resource.content is a function that will provide the information
    return formatForTab(tab, mmr, await resource.content(tab, mmr))
  } else if (isCommandStringContent(resource)) {
    const content = await tab.REPL.qexec<ScalarResource | ScalarContent>(resource.contentFrom)
    if (resource.contentType && typeof content === 'string') {
      return formatForTab(tab, mmr, {
        content,
        contentType: resource.contentType
      })
    } else {
      return formatForTab(tab, mmr, content)
    }
  } else if (isTable(resource.content)) {
    return resource.content
  } else {
    // otherwise, we have string or HTMLElement content
    return Object.assign(
      {
        presentation: mmr.presentation,
        resource: mmr,
        toolbarText: mmr.toolbarText,
        kind: mmr.kind,
        metadata: mmr.metadata
      },
      resource
    )
  }
}

export async function wrapTable(tab: Tab, table: Table): Promise<HTMLElement> {
  const dom1 = document.createElement('div')
  const dom2 = document.createElement('div')
  dom1.classList.add('scrollable', 'scrollable-auto')
  dom2.classList.add('result-as-table', 'repl-result')
  dom1.appendChild(dom2)

  const { findComponentProviders } = await import('@kui-shell/core')
  const providers = findComponentProviders(table)
  if (providers.length > 0) {
    const component = await providers[0].render(table, tab, tab.REPL)
    dom2.appendChild(component.spec.content)
  } else {
    console.error('No registered viewer for tables')
  }

  return dom1
}

export async function renderContent<T extends MetadataBearing>(
  tab: Tab,
  bearer: T,
  content: Content<T> | MetadataBearing | SidecarMode
): Promise<ScalarContent | StringContent> {
  if (isStringWithOptionalContentType(content)) {
    return content
  } else if (isFunctionContent(content)) {
    const actualContent = (await content.content(tab, bearer)) as ScalarResource | ScalarContent
    if (!isScalarContent(actualContent)) {
      if (isTable(actualContent)) {
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
    if (isTable(content.content)) {
      return {
        content: await wrapTable(tab, content.content)
      }
    } else {
      return content
    }
  } else if (isTable(content)) {
    return {
      content: await wrapTable(tab, content)
    }
  } else if (isCommandStringContent(content)) {
    return {
      content: await tab.REPL.qexec<ScalarResource>(content.contentFrom),
      contentType: content.contentType
    }
  }
}

/**
 * Render a MultiModalResponse to the sidecar
 *
 */
export default async function show<T extends MetadataBearing>(
  tab: Tab,
  mmr: MultiModalResponse<T>,
  sidecar: Sidecar,
  repl: REPL
) {
  const modes = mmr.modes as SidecarMode<T>[]

  // const buttons = mmr.buttons ? formatButtons(tab, mmr, mmr.buttons) : ([] as SidecarMode[])
  const ourModesWithButtons = modes.concat(mmr.buttons || [])

  // first, do a "modelOnly" pass, to get the full list of modes
  // see https://github.com/IBM/kui/issues/3589
  const modesWithButtons = addModeButtons(tab, repl, ourModesWithButtons, mmr, sidecar, {
    preserveBackButton: true,
    show: mmr.defaultMode,
    modelOnly: true
  })

  const defaultMode =
    modesWithButtons.find(_ => !isButton(_) && _.defaultMode) || modesWithButtons.find(_ => !isButton(_))

  if (isButton(defaultMode)) {
    console.error('default mode is a button', defaultMode.mode, modesWithButtons, mmr)
    throw new Error('default mode is a button')
  }

  const content = hasContent(defaultMode) ? await renderContent(tab, mmr, defaultMode) : undefined

  // now that we've rendered the initial/default content, do a pass
  // over the modes and add them to the UI; see
  // https://github.com/IBM/kui/issues/3589
  addModeButtons(tab, repl, ourModesWithButtons, mmr, sidecar, {
    preserveBackButton: true,
    show: mmr.defaultMode
  })

  if (content) {
    const custom: ResourceByReferenceWithContent = Object.assign(
      {
        resource: mmr,
        modes: modesWithButtons,
        toolbarText: mmr.toolbarText,
        prettyName: mmr.prettyName,
        nameHash: mmr.nameHash,
        presentation: mmr.presentation
      },
      content
    )

    const { showCustom } = await import('./populate-dom')
    return showCustom(tab, repl, custom, sidecar, { leaveBottomStripeAlone: true })
  } else {
    console.error('empty content')
  }
}
