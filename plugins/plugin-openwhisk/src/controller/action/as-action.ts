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

import * as a from 'indefinite'
import { ActionDesc, Action as RawAction } from 'openwhisk'

import { encodeComponent, Tab, Table, MultiModalResponse } from '@kui-shell/core'

import asTable from '../as-table'
import { packageName } from '../fqn'
import { apiVersion, Action } from '../../models/resource'

export function asAction(raw: RawAction): Action {
  const nameHash = packageName(raw)

  return {
    apiVersion,
    kind: 'Action',
    metadata: {
      name: raw.name,
      namespace: raw.namespace
    },
    onclick: {
      nameHash: nameHash && `wsk package get ${encodeComponent(nameHash)}`,
      namespace: `wsk action list ${encodeComponent('/' + raw.namespace)}`
    },
    nameHash,
    exec: raw.exec,
    annotations: raw.annotations,
    parameters: raw.parameters,
    limits: raw.limits,
    version: raw.version,
    data: JSON.stringify(raw, undefined, 2)
  }
}

export function asActionTable(tab: Tab, raw: ActionDesc[]): Promise<Table> {
  return asTable(tab, raw.map(asAction))
}

/**
 * Default respondWith function. This creates a response that will
 * present as a multi-modal view.
 *
 */
export default function asActionResponse(raw: RawAction, defaultMode?: string): MultiModalResponse<Action> {
  return Object.assign(asAction(raw), {
    modes: [],
    defaultMode,
    toolbarText: {
      type: 'info',
      text: `This is ${a(raw.exec.kind)} action`
    }
  })
}
