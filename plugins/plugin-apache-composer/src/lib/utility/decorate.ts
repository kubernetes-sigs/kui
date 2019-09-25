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

import { UI } from '@kui-shell/core'
import { optionsToString } from '@kui-shell/core/core/utility'

import { hasAst, astAnnotation } from './ast'
import { app as appBadge } from './badges'

const debug = Debug('plugins/apache-composer/decorate')

/**
 * Entity view mode if we have javascript source
 *
 */
export const codeViewMode = (source: string, contentType = 'javascript') => ({
  mode: 'source',
  label: 'code',
  leaveBottomStripeAlone: true,
  direct: {
    type: 'custom',
    isEntity: true,
    contentType,
    contentTypeProjection: 'source',
    content: {
      source
    }
  }
  /*  direct: entity => {
    entity.type = 'actions'
    return sidecar.showEntity(entity, { show: 'source' })
  } */
})

/**
 * Entity view modes
 *
 */
export const vizAndfsmViewModes = (
  visualize,
  commandPrefix: string,
  defaultMode = 'visualization',
  input: string,
  ast: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  options
) => {
  const modes = [
    {
      mode: 'visualization',
      defaultMode: defaultMode === 'visualization',
      direct: `${commandPrefix} "${input}" ${optionsToString(options)}`
    },
    {
      mode: 'ast',
      label: 'JSON',
      defaultMode: defaultMode === 'ast',
      leaveBottomStripeAlone: true,
      direct: {
        type: 'custom',
        isEntity: true,
        contentType: 'json',
        content: ast
      }
    }
  ]

  return modes
}

/**
 * Amend the result of an `action get`, to make the entity appear more
 * like an app
 *
 */
export const decorateAsApp = async (
  tab: UI.Tab,
  { action, input, commandPrefix = 'app get', doVisualize, options }
) => {
  debug('decorateAsApp', options)
  action.prettyType = appBadge

  if (hasAst(action)) {
    action.ast = astAnnotation(action).value
  }

  if (action.exec) {
    action.exec.prettyKind = 'composition'
  }

  if (doVisualize) {
    // pass through cli options for the wskflow renderer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viewOptions: { [propName: string]: any } = {}
    if (options.functions) {
      // note we must be careful not to pass false; only undefined
      viewOptions.renderFunctionsInView = options.functions // render all inline functions directly in the view?
    }
    if (options.noHeader) {
      viewOptions.noHeader = true
    }

    const { visualize, wskflow, zoomToFitButtons } = await import('@kui-shell/plugin-wskflow')
    const { view, controller } = await wskflow(tab, visualize, Object.assign({}, action, { viewOptions }))

    const sourceAnnotation = action.annotations.find(({ key }) => key === 'source')
    if (sourceAnnotation) {
      action.source = sourceAnnotation.value
    }

    action.modes = (action.modes || [])
      .filter(_ => _.mode !== 'code')
      .concat(
        vizAndfsmViewModes(visualize, commandPrefix, undefined, input, action.ast, options.originalOptions || options)
      )
      .concat(sourceAnnotation ? [codeViewMode(action.source)] : [])
      .concat(zoomToFitButtons(controller))
    debug('action', action)
    return view || action
  } else {
    return action
  }
}
