/*
 * Copyright 2018 The Kubernetes Authors
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

import { Tab, Mode } from '@kui-shell/core'

const debug = Debug('plugins/wskflow/util')

const strings = {
  '1:1': 'Zoom 1:1',
  Fit: 'Zoom to Fit'
}

/**
 * Return some line-oriented statistics about the given code.
 *
 * @param code some source code
 * @return { nLines, maxLineLength } for the given code
 *
 */
interface TextualProperties {
  nLines: number
  maxLineLength: number
}

export const textualPropertiesOfCode = (code: string): TextualProperties => {
  const lines = code.split(/[\n\r]/)
  const nLines = lines.length
  const maxLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0)

  return { nLines, maxLineLength }
}

/**
 * Render the wskflow visualization for the given fsm.
 *
 * `container` is optional; wskflow will render in the default way in
 * the sidecar if we don't pass a container in
 *
 * @return { view, controller } where controller is the API exported by graph2doms
 */
export const wskflow = async (tab: Tab, visualize, { ast, viewOptions, container }) => {
  debug('wskflow', viewOptions)

  const isPartOfRule = false
  /* const isPartOfRule = await tab.REPL.qexec<{ action: { name: string; path: string } }[]>('wsk rule list')
    .then(rules =>
      rules.find(({ action: ruleAction }) => {
        return ruleAction.name === name && ruleAction.path === namespace
      })
    )
    .catch(() => []) */

  return visualize(tab, ast, container, undefined, undefined, undefined, viewOptions, isPartOfRule)
}

/**
 * Zoom to fit buttons
 *
 * @param controller an output of graph2doms()
 * @param visibleWhenShowing only show the zoom buttons when the given mode is active
 *
 */
export const zoomToFitButtons = (controller, { visibleWhenShowing = 'visualization' } = {}): Mode[] => {
  if (controller && controller.register) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const events = require('events')
    const zoom1to1Bus = new events.EventEmitter()
    const zoomToFitBus = new events.EventEmitter()

    const listener = event => {
      zoom1to1Bus.emit('change', event.applyAutoScale === false && !event.customZoom)
      zoomToFitBus.emit('change', event.applyAutoScale === true && !event.customZoom)
    }

    controller.register(listener)

    return [
      {
        mode: 'zoom-one-to-one',
        label: strings['1:1'],
        balloon: 'Use a fixed-size canvas',
        selected: controller.is1to1(),
        // selectionController: zoom1to1Bus,
        visibleWhen: visibleWhenShowing,
        kind: 'view',
        command: () => {
          controller.zoom1to1()
        }
      },
      {
        mode: 'zoom-to-fit',
        label: strings['Fit'],
        balloon: 'Use a zoom to fit canvas',
        selected: !controller.is1to1(),
        // selectionController: zoomToFitBus,
        visibleWhen: visibleWhenShowing,
        kind: 'view',
        command: () => {
          controller.zoomToFit()
        }
      }
    ]
  } else {
    // probably some error initializing wskflow; try to safeguard against that
    return []
  }
}
