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

import * as repl from '@kui-shell/core/core/repl'
import { Tab } from '@kui-shell/core/webapp/cli'
import { isHeadless } from '@kui-shell/core/core/capabilities'

import { hasAst } from '../utility/ast'
import { decorateAsApp } from '../utility/decorate'

const debug = Debug('plugins/apache-composer/entity-view')

const defaultMode = 'visualization'

/**
 * Format the given activation record for display as a session
 *
 */
export const formatSessionResponse = activation => {
  activation.prettyType = 'sessions'

  const path = activation.annotations.find(({ key }) => key === 'path').value

  // entity onclick handler
  activation.onclick = () => repl.pexec(`wsk app get "/${path}"`)

  // add our visualization view mode
  if (!activation.modes) activation.modes = []
  activation.modes.find(({ mode }) => mode === 'logs').label = 'trace'

  activation.modes.push({
    mode: defaultMode,
    label: 'Session Flow',
    direct: `wsk session flow ${activation.activationId}`
  })

  debug('session response', activation)
  return activation
}

export const formatCompositionEntity = execOptions => response => {
  return isHeadless() ? response : repl.qfexec(`wsk app get "${response.name}"`, undefined, undefined, execOptions)
}

export const formatCompositionResult = (result, options) => {
  if (options.result || options.r) return result
  else return isHeadless() ? result.response.result : repl.qfexec(`wsk activation get ${result.activationId}`)
}

export const formatDeleteResult = response => {
  response.type = 'composition' // to distinguish composition with action in CLI
  return response
}

export const formatSessionGet = response => {
  debug('session get response', response)
  if (response && response.annotations && response.annotations.find(({ key, value }) => key === 'conductor' && value)) {
    debug('activation is session')
    return formatSessionResponse(response)
  } else {
    debug('activation is not session')
    return response
  }
}

export const visualizeComposition = async (tab: Tab, response, execOptions) => {
  debug('Visualizing Composition', response)

  const action = response.message || response
  // const execOptions = opts.execOptions

  debug('execOptions', execOptions)

  if (hasAst(action) && !isHeadless()) {
    const doVisualize = execOptions.override || !execOptions.nested
    const options = execOptions.originalOptions || {}
    // use require rather than import here to prevent from prequiring wskflow module in headless mode
    const input = `/${response.namespace}/${response.name}`
    const content = await decorateAsApp(tab, {
      action,
      input,
      doVisualize,
      options: Object.assign({}, execOptions, options)
    })

    if (doVisualize) {
      debug('visualze composition')

      return Object.assign(action, {
        type: 'custom',
        viewName: action.type,
        content,
        input,
        isEntity: true,
        controlHeaders: ['sidecar-header-secondary-content']
      })
    } else {
      return response
    }
  } else {
    return response
  }
}

// TODO format a list view?
export const formatSessionList = result => {
  return {
    sessionId: result.activationId,
    name: result.name,
    status: result.response.status,
    duration: result.duration
  }
}
