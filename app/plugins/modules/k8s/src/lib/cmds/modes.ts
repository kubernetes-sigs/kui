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

const debug = require('debug')('k8s/modes')

import { formatMultiListResult } from '@kui/webapp/views/table'
import repl = require('@kui/core/repl')
import { removeAllDomChildren } from '@kui/webapp/util/dom'
import { getSidecar } from '@kui/webapp/views/sidecar'

import { FinalState } from './states'

const makeButton = (overrides, fn?) => Object.assign({}, {
  direct: async ({ prettyType: kind = '-f', name, resourceName = name, namespace }) => {
    const response = await repl.pexec(`kubectl ${overrides.mode} ${kind} ${resourceName} ${namespace ? '-n ' + namespace : ''}`,
                                          { noStatus: !!fn })
    return fn ? fn(response) : response
  },
  echo: true,
  noHistory: false,
  replSilence: false,
  balloonLength: 'medium',
  actAsButton: true,
  flush: 'right'
}, overrides)

/**
 * Insert the given view
 *
 */
export const insertView = view => {
  debug('insertView', view)

  const sidecar = getSidecar()
  const activeView = sidecar.getAttribute('data-active-view')
  const container = sidecar.querySelector(`${activeView} .activation-content .activation-result`)
  debug('insertView.container', activeView, container)

  removeAllDomChildren(container)
  debug('insertView.container', container)
  container.appendChild(view)
}

/**
 * Render the multi-table status view. This just wraps some doms
 * around the formatMultiListResult() output.
 *
 */
export const renderStatus = async (command: string, resource: IResource, finalState: FinalState) => {
  debug('renderStatus', command, resource.filepathForDrilldown, resource.kind, resource.name, finalState)

    // TODO: helm status doesn't yet support watching; so no final-state for helm status
  const final = command === 'kubectl' ? `--final-state ${finalState.toString()}` : ''

  // kubectl status => k8s status
  const commandForRepl = command === 'kubectl' ? 'k8s' : command

  const fetchModels = `${commandForRepl} status ${repl.encodeComponent(resource.filepathForDrilldown || resource.kind)} ${repl.encodeComponent(resource.name)} ${final}`
  debug('issuing command', fetchModels)

  const models = await repl.qexec(fetchModels)
  // debug('renderStatus.models', models);

  const resultDomOuter = document.createElement('div')

  if (models.length > 0) {
    const resultDom = document.createElement('div')

    resultDomOuter.classList.add('result-vertical')
    resultDomOuter.classList.add('padding-content')
    resultDomOuter.classList.add('scrollable-auto')
    resultDomOuter.appendChild(resultDom)

    resultDom.classList.add('result-as-table')
    resultDom.classList.add('result-as-fixed-tables')
    resultDom.classList.add('repl-result')
    resultDom.classList.add('monospace')

    if (Array.isArray(models[0])) {
      formatMultiListResult(models, resultDom)
    } else {
      formatMultiListResult([ models ], resultDom)
            // formatListResult(models).forEach(row => resultDom.appendChild(row));
    }
  }

  return resultDomOuter
}

export interface IResource {
  filepathForDrilldown?: string
  kind?: string
  name?: string
}

/**
 * Render status table, and then place it in a DOM
 *
 */
export const renderAndViewStatus = (command: string, resource: IResource, finalState: FinalState) => {
  renderStatus(command, resource, finalState).then(insertView)
}

export const statusButton = (command: string, resource: IResource, finalState: FinalState, overrides?) => Object.assign({}, {
  mode: 'status',
  direct: () => renderAndViewStatus(command, resource, finalState)
}, overrides || {})

export const createResourceButton = (fn?) => makeButton({ mode: 'create',
  fontawesome: 'fas fa-plus-circle',
  balloon: 'Create this resource'
}, fn)

export const deleteResourceButton = (fn?) => makeButton({ mode: 'delete',
  fontawesome: 'fas fa-trash',
  balloon: 'Delete this resource'
}, fn)
