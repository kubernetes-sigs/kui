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
const debug = Debug('k8s/view/modes/status')

import repl = require('@kui-shell/core/core/repl')

import { FinalState } from '../../model/states'
import IResource from '../../model/resource'

import insertView from '../insert-view'
import { formatTable } from '../formatMultiTable'

/**
 * Return a sidecar mode button model that shows a status table for
 * the given resource
 *
 */
export const statusButton = (command: string, resource: IResource, finalState: FinalState, overrides?) => Object.assign({}, {
  mode: 'status',
  direct: {
    plugin: 'k8s',
    module: 'lib/view/modes/status',
    operation: 'renderAndViewStatus',
    parameters: { command, resource, finalState }
  }
}, overrides || {})

/**
 * Render the multi-table status view. This just wraps some doms
 * around the formatMultiListResult() output.
 *
 */
export const renderStatus = async (command: string, resource: IResource, finalState: FinalState) => {
  debug('renderStatus', command, resource.filepathForDrilldown, resource.kind, resource.name, finalState, resource.yaml)

    // TODO: helm status doesn't yet support watching; so no final-state for helm status
  const final = command === 'kubectl' ? `--final-state ${finalState.toString()}` : ''

  // kubectl status => k8s status
  const commandForRepl = command === 'kubectl' ? 'k8s' : command

  const fetchModels = `${commandForRepl} status ${repl.encodeComponent(resource.filepathForDrilldown || resource.kind || resource.yaml.kind)} ${repl.encodeComponent(resource.name)} ${final} -n "${resource.yaml.metadata.namespace}"`
  debug('issuing command', fetchModels)

  const model = await repl.qexec(fetchModels)
  debug('renderStatus.models', model)

  const view = formatTable(model)

  return view
}

/**
 * Render status table, and then place it in a DOM
 *
 */
interface IParameters {
  command: string
  resource: IResource
  finalState: FinalState
}
export const renderAndViewStatus = (parameters: IParameters) => {
  const { command, resource, finalState } = parameters
  renderStatus(command, resource, finalState).then(insertView)
}
