/*
 * Copyright 2019-2020 IBM Corporation
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

import { i18n, Table, TableStyle } from '@kui-shell/core'

import { fqn } from '../controller/fqn'
import { startupPenalty } from '../controller/activation/list'
import { Activation, SequenceActivation, isSequenceActivation } from '../models/resource'

const strings = i18n('plugin-openwhisk')

/** As SequenceDiagram-compatible table */
async function asSequenceTable(resource: SequenceActivation): Promise<Table> {
  const body = resource.componentActivations
    .reduce((A, activation, idx) => {
      // add a Scheduling Delay bar, if needed
      if (idx > 0 && activation.start - resource.componentActivations[idx - 1].end > 0) {
        const delay = Object.assign({}, activation, {
          end: activation.start,
          start: resource.componentActivations[idx - 1].end,
          response: undefined,
          annotations: activation.annotations.filter(_ => _.key !== 'waitTime' && _.key !== 'initTime'),
          metadata: Object.assign({}, activation.metadata, { name: strings('Scheduling Delay') })
        })
        A.push(delay)
      }

      // then add the activation
      A.push(activation)

      return A
    }, [] as Activation[])
    .map(_ => ({
      name: !_.response ? _.metadata.name : fqn(_, resource.currentNamespace),
      onclick: _.response ? `wsk activation get ${_.activationId}` : false,
      css: !_.response ? 'sub-text' : undefined,
      attributes: [
        { key: 'Status', value: !_.response ? 'Overhead' : _.response.success ? 'ok' : 'fail' },
        { key: 'Start', value: new Date(_.start).toISOString() },
        { key: 'End', value: new Date(_.end).toISOString() },
        { key: 'Startup Penalty', value: startupPenalty(_) }
      ]
    }))

  return {
    body,
    noSort: true,
    style: TableStyle.Light,
    defaultPresentation: 'sequence-diagram',
    allowedPresentations: ['sequence-diagram'],
    colorBy: 'status',
    statusColumnIdx: 0,
    startColumnIdx: 1,
    completeColumnIdx: 2,
    coldStartColumnIdx: 3
  }
}

function content(_, resource: SequenceActivation) {
  return asSequenceTable(resource)
}

/**
 * The Logs mode for activations
 *
 */
export default {
  when: isSequenceActivation,
  mode: {
    mode: 'logs',
    label: strings('Trace'),
    content
  }
}
