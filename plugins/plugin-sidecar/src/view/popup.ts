/*
 * Copyright 2017-19 IBM Corporation
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

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Badge,
  Presentation,
  Mode as ModeOrButton,
  MultiModalMode,
  Button,
  isHTML,
  isTable,
  MultiModalResponse,
  isMultiModalResponse,
  isScalarContent,
  ResourceByReference,
  ExecOptions,
  isButton,
  empty as removeAllDomChildren,
  getCurrentTab,
  Tab,
  REPL,
  KResponse
} from '@kui-shell/core'

import viewId from './viewId'
import loadSidecar from './load'
import Sidecar from '../model/sidecar'

/**
 * Render popup content in the given container
 *
 */
const renderPopupContent = async (
  command: string,
  container: Element,
  sidecar: Sidecar,
  entity: MultiModalResponse,
  repl: REPL,
  presentation = Presentation.SidecarFullscreenForPopups
) => {
  const { modes = [] } = entity
  const { prettyPrintTime } = await import('@kui-shell/core')

  // Last updated... text
  const subtext = document.createElement('div')
  subtext.appendChild(document.createTextNode('Last updated '))
  const date = document.createElement('strong')
  const now = new Date()
  date.appendChild(prettyPrintTime(now))
  subtext.appendChild(date)

  const millisPerDay = 24 * 60 * 60 * 1000
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const millisSinceMidnight = now.getTime() - midnight.getTime()
  const millisTillMidnight = millisPerDay - millisSinceMidnight

  /** re-pretty-print the "now" timestamp with every changing day */
  const updateLastUpdateDate = () => {
    removeAllDomChildren(date)
    date.appendChild(prettyPrintTime(now))
  }

  /** re-pretty-print the "now" timestamp after the first change of day */
  const updateLastUpdateDateFirstTime = () => {
    updateLastUpdateDate()
    setInterval(updateLastUpdateDate, millisPerDay) // schedule daily updates
  }
  setTimeout(updateLastUpdateDateFirstTime, millisTillMidnight)

  if (container) {
    /* if ((container.parentNode as HTMLElement).classList.contains('result-as-multi-table')) {
      ;(container.parentNode.parentNode as HTMLElement).classList.add('overflow-auto')
    } */

    const custom: MultiModalResponse = {
      metadata: {
        name: command
      },
      // isREPL: true,
      presentation,
      // prettyType,
      toolbarText: {
        type: 'info',
        text: subtext
      },
      modes
      // badges
      // controlHeaders
    }

    const { default: show } = await import('./mmr/show')
    show(getCurrentTab(), Object.assign({}, custom, entity), sidecar, repl)
  }
}

/**
 * Create a popup content container
 *
 */
export const createPopupContentContainer = (css: string[] = []): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('padding-content')

  const scrollRegion = document.createElement('div')
  scrollRegion.classList.add('repl-block')
  css.forEach(_ => scrollRegion.classList.add(_))
  container.appendChild(scrollRegion)

  const resultDom = document.createElement('div')
  resultDom.classList.add('repl-result')
  scrollRegion.appendChild(resultDom)

  return resultDom
}

export default async function renderForPopup(response: KResponse, tab: Tab, repl: REPL, command?: string) {
  if (isMultiModalResponse(response)) {
    return import('./mmr').then(_ => _.default(response, tab, repl))
  } else {
    const { content, sidecar } = loadSidecar()

    const kind =
      (isTable(response) && response.title) ||
      (isTable(response) &&
        response.body[0] &&
        (response.body[0].prettyType ||
          response.body[0].prettyKind ||
          response.body[0].type ||
          response.body[0].kind)) ||
      undefined

    const presentation = Presentation.FixedSize
    const container = createPopupContentContainer(['valid-response'])
    content.appendChild(container)

    const { wrapTable } = await import('./mmr/show')

    const resource: MultiModalResponse = {
      kind,
      metadata: {
        name: command
      },
      modes: []
    }

    const mode: MultiModalMode = {
      mode: 'view',
      content:
        isHTML(response) || typeof response === 'string'
          ? response
          : typeof response === 'number' || typeof response === 'boolean'
          ? response.toString()
          : isTable(response)
          ? await wrapTable(tab, response)
          : response.toString()
    }
    resource.modes.push(mode)

    renderPopupContent('', container, sidecar, resource, repl)

    return {
      apiVersion: 'kui-shell/component/v1' as const,
      frame: {
        position: 'TabColumn' as const,
        presentation,
        kind,
        metadata: {
          namespace: undefined
        }
      },
      spec: {
        viewId,
        content,
        singleton: true as const
      }
    }
  }
}
