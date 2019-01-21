/*
 * Copyright 2018 IBM Corporation
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
import * as Debug from 'debug'
const debug = Debug('plugins/wskflow/util')

import * as sidecar from '@kui/core/webapp/views/sidecar'
import * as repl from '@kui/core/core/repl'
import { optionsToString } from '@kui/core/core/utility'

import * as astUtil from '@kui/plugin-apache-composer/src/lib/utility/ast'
import * as badges from '@kui/plugin-apache-composer/src/lib/utility/badges'

/**
 * Return some line-oriented statistics about the given code.
 *
 * @param code some source code
 * @return { nLines, maxLineLength } for the given code
 *
 */
interface ITextualProperties {
  nLines: number
  maxLineLength: number
}

export const textualPropertiesOfCode = (code: string): ITextualProperties => {
  const lines = code.split(/[\n\r]/)
  const nLines = lines.length
  const maxLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0)

  return { nLines, maxLineLength }
}

/**
 * Entity view mode if we have javascript source
 *
 */
export const codeViewMode = {
  mode: 'source',
  label: 'code',
  direct: entity => {
    entity.type = 'actions'
    return sidecar.showEntity(entity, { show: 'source' })
  }
}

/**
 * Entity view modes
 *
 */
export const vizAndfsmViewModes = (visualize, commandPrefix, defaultMode = 'visualization', options) => [
  { mode: 'visualization',
    defaultMode: defaultMode === 'visualization',
    direct: entity => {
      return repl.qexec(`${commandPrefix} "${entity.input}" ${optionsToString(options)}`)
    } },
  { mode: 'ast',
    label: 'JSON',
    defaultMode: defaultMode === 'ast',
    direct: entity => {
      entity.type = 'actions'
      sidecar.showEntity(entity, { show: 'ast' })
    } }
]
/**
 * Amend the result of an `action get`, to make the entity appear more
 * like an app
 *
 */
export const decorateAsApp = async ({ action, viewName = 'composition', commandPrefix = 'app get', doVisualize, options }) => {
  debug('decorateAsApp', options)
  action.prettyType = badges.app

  if (astUtil.hasAst(action)) {
    action.ast = astUtil.astAnnotation(action).value
  }

  if (action.exec) {
    action.exec.prettyKind = 'composition'
  }

  if (doVisualize) {
    // pass through cli options for the wskflow renderer
    const viewOptions: { [propName: string]: any } = {}
    if (options.functions) {
      // note we must be careful not to pass false; only undefined
      viewOptions.renderFunctionsInView = options.functions // render all inline functions directly in the view?
    }
    if (options.noHeader) {
      viewOptions.noHeader = true
    }

    const visualize = require('./visualize').default
    const { view, controller } = await wskflow(visualize, viewName, Object.assign({}, action, { viewOptions }))

    const sourceAnnotation = action.annotations.find(({ key }) => key === 'source')
    if (sourceAnnotation) {
      action.source = sourceAnnotation.value
    }

    action.modes = (action.modes || []).filter(_ => _.mode !== 'code')
      .concat(vizAndfsmViewModes(visualize, commandPrefix, undefined, options.originalOptions || options))
      .concat(sourceAnnotation ? [ codeViewMode ] : [])
      .concat(zoomToFitButtons(controller))
    debug('action', action)
    return view || action
  } else {
    return action
  }
}

/**
 * Render the wskflow visualization for the given fsm.
 *
 * `container` is optional; wskflow will render in the default way in
 * the sidecar if we don't pass a container in
 *
 * @return { view, controller } where controller is the API exported by graph2doms
 */
export const wskflow = async (visualize, viewName, { ast, input, name, packageName, namespace, viewOptions, container }) => {
  debug('wskflow', viewOptions)

  const isPartOfRule = await repl.qexec('wsk rule list')
    .then(rules => rules.find(({ action: ruleAction }) => {
      return ruleAction.name === name &&
        ruleAction.path === namespace
    }))
    .catch(() => [])

  const result = await visualize(ast, container, undefined, undefined, undefined, viewOptions, isPartOfRule)

  if (!viewOptions || !viewOptions.noHeader) {
    const onclick = undefined
    sidecar.addNameToSidecarHeader(undefined, name, packageName, onclick, viewName,
      'This is a preview of your app, it is not yet deployed')
  }

  return result
}

/**
 * Zoom to fit buttons
 *
 */
export const zoomToFitButtons = controller => {
  if (controller && controller.register) {
    const events = require('events')
    const zoom1to1Bus = new events.EventEmitter()
    const zoomToFitBus = new events.EventEmitter()

    const listener = event => {
      zoom1to1Bus.emit('change', event.applyAutoScale === false && !event.customZoom)
      zoomToFitBus.emit('change', event.applyAutoScale === true && !event.customZoom)
    }

    controller.register(listener)

    return [
      { label: '1:1',
        actAsButton: true,
        flush: 'right',
        balloon: 'Use a fixed-size canvas',
        selected: controller.is1to1(),
        selectionController: zoom1to1Bus,
        visibleWhen: 'visualization',
        direct: () => {
          controller.zoom1to1()
        }
      },
      { fontawesome: 'fas fa-expand',
        actAsButton: true,
        flush: 'right',
        balloon: 'Use a zoom to fit canvas',
        selected: !controller.is1to1(),
        selectionController: zoomToFitBus,
        visibleWhen: 'visualization',
        direct: () => {
          controller.zoomToFit()
        }
      }
    ]
  } else {
    // probably some error initializing wskflow; try to safeguard against that
    return []
  }
}
