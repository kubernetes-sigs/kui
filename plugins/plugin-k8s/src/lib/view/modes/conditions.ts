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

import { Tab } from '@kui-shell/core/webapp/cli'
import { Cell, Row, Table } from '@kui-shell/core/webapp/models/table'
import { ModeRegistration } from '@kui-shell/core/webapp/views/registrar/modes'

import { Resource, KubeResource, KubeStatusCondition } from '../../model/resource'

import insertView from '../insert-view'
import { formatTable } from '../formatMultiTable'

import i18n from '@kui-shell/core/util/i18n'
const strings = i18n('plugin-k8s')

const debug = Debug('k8s/view/modes/conditions')

/**
 * Return a sidecar mode button model that shows a conditions table
 * for the given resource
 *
 */
export const conditionsButton = (command: string, resource: Resource, overrides?) =>
  Object.assign(
    {},
    {
      mode: 'conditions',
      label: strings('conditions'),
      direct: {
        plugin: 'k8s',
        module: 'lib/view/modes/conditions',
        operation: 'renderAndViewConditions',
        parameters: { command, resource }
      }
    },
    overrides || {}
  )

/**
 * Add a Conditions mode button to the given modes model, if called
 * for by the given resource.
 *
 */
export const conditionsMode: ModeRegistration<KubeResource> = {
  when: (resource: KubeResource) => {
    return !!(resource.status && resource.status.conditions)
  },
  mode: (command: string, resource: Resource) => {
    try {
      return conditionsButton(command, resource)
    } catch (err) {
      debug('error rendering conditions button')
      console.error(err)
    }
  }
}

/**
 * Format a timestamp field from the status.conditions model; these might be null
 *
 */
const formatTimestamp = (timestamp: string): string => {
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
export const renderConditions = async (tab: Tab, command: string, resource: Resource) => {
  debug('renderConditions', command, resource)

  const anyProbeTimes = resource.resource.status.conditions.some(_ => !!_.lastProbeTime)
  const probeHeader: Cell[] = anyProbeTimes
    ? [{ value: 'LAST PROBE', outerCSS: 'header-cell min-width-date-like' }]
    : []
  const probeBody = (condition: KubeStatusCondition): Cell[] => {
    if (anyProbeTimes) {
      return [
        {
          key: 'lastProbeTime',
          value: formatTimestamp(condition.lastProbeTime),
          outerCSS: 'min-width-date-like smaller-text'
        }
      ]
    } else {
      return []
    }
  }

  const anyMessages = resource.resource.status.conditions.some(_ => !!_.message)
  const messageHeader: Cell[] = anyMessages ? [{ value: 'MESSAGE' }] : []
  const messageBody = (condition: KubeStatusCondition): Cell[] => {
    if (anyMessages) {
      return [
        {
          key: 'message',
          value: condition.message,
          css: 'pre-wrap'
        }
      ]
    } else {
      return []
    }
  }

  const standardHeaderCells: Cell[] = [
    { value: 'TRANSITION TIME' },
    { value: 'STATUS', outerCSS: 'very-narrow text-center' }
  ]

  const headerModel: Row = {
    type: 'condition',
    name: 'CONDITION',
    outerCSS: 'header-cell',
    attributes: probeHeader.concat(standardHeaderCells).concat(messageHeader)
  }

  // sort from most recent to least recent
  resource.resource.status.conditions.sort((a, b) => {
    if (!a.lastTransitionTime && b.lastTransitionTime) {
      return 1
    } else if (!b.lastTransitionTime && a.lastTransitionTime) {
      return -1
    } else if (!a.lastTransitionTime && !b.lastTransitionTime) {
      return 0
    } else {
      return new Date(b.lastTransitionTime).getTime() - new Date(a.lastTransitionTime).getTime()
    }
  })

  const bodyModel: Row[] = resource.resource.status.conditions.map(condition => {
    const success = condition.status === 'True' || /Succeed/i.test(condition.reason)
    const failure = condition.status === 'False' || /Failed/i.test(condition.reason)

    const standardBodyCells: Cell[] = [
      {
        key: 'lastTransitionTime',
        value: formatTimestamp(condition.lastTransitionTime),
        outerCSS: 'min-width-date-like smaller-text'
      },
      {
        key: 'status',
        value: (condition.status || condition.reason).toString(),
        outerCSS: 'text-center',
        fontawesome: success ? 'fas fa-check-circle' : failure ? 'fas fa-times-circle' : 'fas fa-question-circle',
        css: 'larger-text ' + (success ? 'green-text' : failure ? 'red-text' : 'yellow-text')
      }
    ]

    return {
      type: 'condition',
      name: condition.type || condition.reason,
      outerCSS: 'entity-name-group-narrow',
      onclick: false,
      attributes: probeBody(condition)
        .concat(standardBodyCells)
        .concat(messageBody(condition))
    }
  })

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
interface Parameters {
  command: string
  resource: Resource
}
export const renderAndViewConditions = (tab: Tab, parameters: Parameters) => {
  renderConditions(tab, parameters.command, parameters.resource).then(insertView(tab))
}
