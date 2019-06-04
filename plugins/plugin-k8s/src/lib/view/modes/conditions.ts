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

import * as Debug from 'debug'
const debug = Debug('k8s/view/modes/conditions')

import { ITab } from '@kui-shell/core/webapp/cli'
import { formatMultiListResult } from '@kui-shell/core/webapp/views/table'
import { ISidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { Row, Table } from '@kui-shell/core/webapp/models/table'

import { IResource, IKubeResource } from '../../model/resource'

import insertView from '../insert-view'
import { formatTable } from '../formatMultiTable'

import { ModeRegistration } from '@kui-shell/plugin-k8s/lib/view/modes/registrar'

/**
 * Add a Conditions mode button to the given modes model, if called
 * for by the given resource.
 *
 */
export const conditionsMode: ModeRegistration = {
  when: (resource: IKubeResource) => {
    return !!(resource.status && resource.status.conditions)
  },
  mode: (command: string, resource: IResource) => {
    try {
      return conditionsButton(command, resource)
    } catch (err) {
      debug('error rendering conditions button')
      console.error(err)
    }
  }
}

/**
 * Return a sidecar mode button model that shows a conditions table
 * for the given resource
 *
 */
export const conditionsButton = (command: string, resource: IResource, overrides?) => Object.assign({}, {
  mode: 'conditions',
  direct: {
    plugin: 'k8s',
    module: 'lib/view/modes/conditions',
    operation: 'renderAndViewConditions',
    parameters: { command, resource }
  }
}, overrides || {})

/**
 * Format a timestamp field from the status.conditions model; these might be null
 *
 */
const formatTimestamp = (timestamp: string): string => {
  debug('formatTimestamp', timestamp)

  if (!timestamp) {
    return ''
  } else {
    return new Date(timestamp).toLocaleString()
  }
}

/**
 * Render the tabular conditions view
 *
 */
export const renderConditions = async (tab: ITab, command: string, resource: IResource) => {
  debug('renderConditions', command, resource)

  const anyProbeTimes = resource.resource.status.conditions.some(_ => !!_.lastProbeTime)
  const probeHeader: any[] = anyProbeTimes ? [{ value: 'LAST PROBE', outerCSS: 'header-cell min-width-date-like' }] : []
  const probeBody = (condition): any[] => {
    if (anyProbeTimes) {
      return [{
        key: 'lastProbeTime',
        value: formatTimestamp(condition.lastProbeTime),
        outerCSS: 'min-width-date-like smaller-text'
      }]
    } else {
      return []
    }
  }

  const headerModel: Row = {
    type: 'condition',
    name: 'CONDITION',
    outerCSS: 'header-cell',
    attributes: probeHeader.concat([
      { value: 'TRANSITION TIME', outerCSS: 'header-cell min-width-date-like' },
      { value: 'STATUS', outerCSS: 'header-cell very-narrow text-center' }
    ])
  }

  resource.resource.status.conditions.sort((a, b) => {
    if (!a.lastTransitionTime && b.lastTransitionTime) {
      return 1
    } else if (!b.lastTransitionTime && a.lastTransitionTime) {
      return -1
    } else if (!a.lastTransitionTime && !b.lastTransitionTime) {
      return 0
    } else {
      return new Date(a.lastTransitionTime).getTime() - new Date(b.lastTransitionTime).getTime()
    }
  })

  const bodyModel: Row[] = resource.resource.status.conditions.map(condition => ({
    type: 'condition',
    name: condition.type,
    onclick: false,
    attributes: probeBody(condition).concat([
      { key: 'lastTransitionTime', value: formatTimestamp(condition.lastTransitionTime), outerCSS: 'min-width-date-like smaller-text' },
      {
        key: 'status',
        value: condition.status,
        outerCSS: 'text-center larger-text',
        fontawesome: condition.status === 'True' ? 'fas fa-check-circle'
          : condition.status === 'False' ? 'fas fa-times-circle' : 'fas fa-question-circle',
        css: condition.status === 'True' ? 'green-text' : condition.status === 'False' ? 'red-text' : 'yellow-text'
      }
    ])
  }))

  const tableModel: Table = {
    header: headerModel,
    body: bodyModel,
    noSort: true,
    title: 'Conditions'
  }

  debug('table model', tableModel)

  const view = formatTable(tab, tableModel)
  debug('table view', view)

  return view
}

/**
 * Render a conditions table and show it in the sidecar
 *
 */
interface IParameters {
  command: string
  resource: IResource
}
export const renderAndViewConditions = (tab: ITab, parameters: IParameters) => {
  renderConditions(tab, parameters.command, parameters.resource).then(insertView(tab))
}
