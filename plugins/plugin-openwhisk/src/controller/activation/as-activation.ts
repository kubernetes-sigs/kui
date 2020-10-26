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

import { Dict, ActivationDesc, Activation as RawActivation } from 'openwhisk'
import { encodeComponent, Tab, Table, MultiModalResponse } from '@kui-shell/core'

import asTable from '../as-table'
import { apiVersion, Activation } from '../../models/resource'

export function fqn(activation: Activation) {
  const pathAnnotation = activation.annotations.find(_ => _.key === 'path')
  return pathAnnotation && `/${pathAnnotation.value}`
}

export function asActivation<T extends Dict>(raw: RawActivation<T>): Activation<T> {
  const limitsAnnotation = raw.annotations && raw.annotations.find(_ => _.key === 'limits')
  const pathAnnotation = raw.annotations && raw.annotations.find(_ => _.key === 'path')

  return {
    apiVersion,
    kind: 'Activation',
    metadata: {
      name: raw.name,
      namespace: raw.namespace,
      creationTimestamp: new Date(raw.start).toLocaleString()
    },
    onclick: {
      namespace: `wsk action list ${encodeComponent('/' + raw.namespace)}`,
      name: pathAnnotation && `wsk action get ${encodeComponent('/' + pathAnnotation.value)}`
    },
    start: raw.start,
    end: raw.end,
    duration: raw.duration,
    activationId: raw.activationId,
    nameHash: raw.activationId,
    annotations: raw.annotations,
    limits: limitsAnnotation && limitsAnnotation.value,
    version: raw.version,
    logs: raw.logs,
    response: raw.response,
    statusCode: (raw as any).statusCode,
    data: JSON.stringify(raw, undefined, 2)
  }
}

export function asActivationTable<T extends Dict>(tab: Tab, raw: ActivationDesc[]): Promise<Table> {
  return asTable(tab, raw.map(asActivation))
}

export function asActivationResponse<T extends Dict>(activation: Activation<T>): MultiModalResponse<Activation<T>> {
  return Object.assign(activation, {
    createdOnString: 'Started on',
    modes: []
  })
}

/**
 * Default respondWith function. This creates a response that will
 * present as a multi-modal view.
 *
 */
export function respondWith<T extends Dict>(
  raw: RawActivation<T>,
  defaultMode?: string
): MultiModalResponse<Activation<T>> {
  return Object.assign(asActivation(raw), {
    createdOnString: 'Started on',
    modes: [],
    defaultMode
  })
}

export default respondWith
