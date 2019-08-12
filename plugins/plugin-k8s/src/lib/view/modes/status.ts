/*
 * Copyright 2018-19 IBM Corporation
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
import { Tab } from '@kui-shell/core/webapp/cli'

import { FinalState } from '../../model/states'
import Resource from '../../model/resource'

import insertView from '../insert-view'
import { formatTable } from '../formatMultiTable'

import repl = require('@kui-shell/core/core/repl')
import { CodedError } from '@kui-shell/core/models/errors'
import { Table, MultiTable } from '@kui-shell/core/webapp/models/table'

import i18n from '@kui-shell/core/util/i18n'
const strings = i18n('plugin-k8s')

const debug = Debug('k8s/view/modes/status')

/**
 * Return a sidecar mode button model that shows a status table for
 * the given resource
 *
 */
export const statusButton = (command: string, resource: Resource, finalState: FinalState, overrides?) =>
  Object.assign(
    {},
    {
      mode: 'status',
      label: strings('status'),
      direct: {
        plugin: 'k8s',
        module: 'lib/view/modes/status',
        operation: 'renderAndViewStatus',
        parameters: { command, resource, finalState }
      }
    },
    overrides || {}
  )

/**
 * Render the multi-table status view. This just wraps some doms
 * around the formatMultiListResult() output.
 *
 */
export const renderStatus = async (tab: Tab, command: string, resource: Resource, finalState: FinalState) => {
  debug(
    'renderStatus',
    command,
    resource.filepathForDrilldown,
    resource.kind,
    resource.name,
    finalState,
    resource.resource
  )

  // TODO: helm status doesn't yet support watching; so no final-state for helm status
  const final = command === 'kubectl' ? `--final-state ${finalState.toString()}` : ''

  // kubectl status => k8s status
  const commandForRepl = command === 'kubectl' ? 'k8s' : command

  const fetchModels = `${commandForRepl} status ${repl.encodeComponent(
    resource.filepathForDrilldown || resource.kind || resource.resource.kind
  )} ${repl.encodeComponent(resource.name)} ${final} -n "${resource.resource.metadata.namespace}"`
  debug('issuing command', fetchModels)

  try {
    const model: Table | MultiTable = await repl.qexec(fetchModels)
    debug('renderStatus.models', model)

    return formatTable(tab, model)
  } catch (error) {
    const err: CodedError = error
    if (err.code === 404) {
      return formatTable(tab, { body: [] })
    } else {
      throw err
    }
  }
}

/**
 * Render status table, and then place it in a DOM
 *
 */
interface Parameters {
  command: string
  resource: Resource
  finalState: FinalState
}
export const renderAndViewStatus = (tab: Tab, parameters: Parameters) => {
  const { command, resource, finalState } = parameters
  renderStatus(tab, command, resource, finalState).then(insertView(tab))
}
