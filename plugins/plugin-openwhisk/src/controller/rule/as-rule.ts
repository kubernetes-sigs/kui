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

import { RuleDesc, Rule as RawRule } from 'openwhisk'
import { encodeComponent, Tab, Table, MultiModalResponse } from '@kui-shell/core'

import asTable from '../as-table'
import { apiVersion, Rule } from '../../models/resource'

export function asRule(raw: RawRule): Rule {
  return {
    apiVersion,
    kind: 'Rule',
    metadata: {
      name: raw.name,
      namespace: raw.namespace
    },
    onclick: {
      namespace: `wsk action list ${encodeComponent('/' + raw.namespace)}`
    },
    trigger: raw.trigger,
    action: raw.action,
    status: raw.status,
    version: raw.version,
    data: JSON.stringify(raw, undefined, 2)
  }
}

export function asRuleTable(tab: Tab, raw: RuleDesc[]): Promise<Table> {
  return asTable(tab, raw.map(asRule))
}

/**
 * Default respondWith function. This creates a response that will
 * present as a multi-modal view.
 *
 */
export default function asRuleResponse(raw: RawRule, defaultMode?: string): MultiModalResponse<Rule> {
  return Object.assign(asRule(raw), {
    modes: [],
    defaultMode,
    toolbarText: {
      type: 'info',
      text: `This rule is ${raw.status}`
    }
  })
}
