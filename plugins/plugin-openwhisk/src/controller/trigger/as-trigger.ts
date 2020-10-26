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

import { TriggerDesc, Trigger as RawTrigger } from 'openwhisk'
import { Tab, Table, MultiModalResponse } from '@kui-shell/core'

import asTable from '../as-table'
import { apiVersion, Trigger } from '../../models/resource'

export function asTrigger(raw: RawTrigger): Trigger {
  const { version, name, namespace } = raw

  return {
    apiVersion,
    kind: 'Trigger',
    metadata: {
      name,
      namespace
    },

    limits: raw.limits,
    parameters: raw.parameters,
    annotations: raw.annotations,
    version,
    data: JSON.stringify(raw, undefined, 2)
  }
}

export function asTriggerTable(tab: Tab, raw: TriggerDesc[]): Promise<Table> {
  return asTable(tab, raw.map(asTrigger))
}

/**
 * Default respondWith function. This creates a response that will
 * present as a multi-modal view.
 *
 */
export default function asTriggerResponse(raw: RawTrigger, defaultMode?: string): MultiModalResponse<Trigger> {
  return Object.assign(asTrigger(raw), {
    modes: [],
    defaultMode
  })
}
