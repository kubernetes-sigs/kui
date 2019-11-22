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

import Debug from 'debug'
const debug = Debug('webapp/popup')
debug('loading')

import { getCurrentTab } from './tab'
import { SidecarMode } from './bottom-stripe'

import { prettyPrintTime } from './util/time'
import { removeAllDomChildren } from './util/dom'
import { Badge } from './views/badge'
import Presentation from './views/presentation'
import Formattable from './views/formattable'
import presentAs from './views/sidecar-present'
import { CustomSpec } from './views/sidecar-core'

import { ExecOptions } from '../models/execOptions'

export interface PopupEntity {
  prettyType?: string
  modes?: SidecarMode[]
  badges?: Badge[]
  controlHeaders?: boolean | string[]
  presentation?: Presentation
  subtext?: Formattable
}

/**
 * Render popup content in the given container
 *
 */
export const renderPopupContent = async (
  command: string,
  container: Element,
  execOptions: ExecOptions,
  entity: PopupEntity = {}
) => {
  const {
    prettyType: _prettyType,
    modes = [],
    badges = [],
    controlHeaders = false,
    presentation = Presentation.SidecarFullscreenForPopups
  } = entity

  const prettyType =
    !_prettyType || _prettyType === 'custom' ? process.env.KUI_DEFAULT_PRETTY_TYPE || command : _prettyType
  debug('renderPopupContent', command, entity, prettyType)

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
    if ((container.parentNode as HTMLElement).classList.contains('result-as-multi-table')) {
      ;(container.parentNode.parentNode as HTMLElement).classList.add('overflow-auto')
    }

    const custom: CustomSpec = {
      type: 'custom',
      metadata: {
        name: command
      },
      isREPL: true,
      presentation,
      prettyType,
      subtext,
      modes,
      badges,
      controlHeaders,
      content: container.parentNode.parentNode // dom -> scrollRegion -> paddingContent
    }

    const { showCustom } = await import('./views/sidecar')
    showCustom(getCurrentTab(), Object.assign({}, custom, entity, { prettyType }), execOptions)
  }
}

/** create a popup content container */
export const createPopupContentContainer = (css: string[] = [], presentation?: Presentation): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('padding-content')

  const scrollRegion = document.createElement('div')
  scrollRegion.classList.add('repl-block')
  css.forEach(_ => scrollRegion.classList.add(_))
  container.appendChild(scrollRegion)

  if (presentation || presentation === 0) {
    presentAs(getCurrentTab(), presentation)
  }

  const resultDom = document.createElement('div')
  resultDom.classList.add('repl-result')
  scrollRegion.appendChild(resultDom)

  return resultDom
}
