/*
 * Copyright 2020 IBM Corporation
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

import { Arguments, Registrar, Tab, Table } from '@kui-shell/core'

import { getCurrentContext } from './contexts'
import commandPrefix from '../command-prefix'
import { getFlags as flags } from './get'
import { KubeOptions } from './options'

/**
 * Summarize the resources in the namespace indicated by the last
 * positional argument into a table, where resources are histogrammed
 * by kind.
 *
 */
export async function doSummarizeNamedNamespace(tab: Tab, ns: string): Promise<Table> {
  // otherwise, summarize resource count by kind in a table
  const response = await tab.REPL.qexec<Table>(`kubectl get all -n ${ns} -o custom-columns=KIND:.kind`)

  const resources = response.body
  const histogram = resources.reduce((M, { name: kind }) => {
    M[kind] = (M[kind] || 0) + 1
    return M
  }, {} as Record<string, number>)

  const header = {
    name: 'KIND',
    attributes: [{ key: 'COUNT', value: 'COUNT' }]
  }

  const body = Object.keys(histogram)
    .map(kind => ({
      name: kind,
      onclick: `kubectl get ${kind} -n ${ns}`,
      attributes: [
        {
          key: 'COUNT',
          value: histogram[kind].toLocaleString()
        }
      ]
    }))
    .sort((a, b) => histogram[b.name] - histogram[a.name]) // sort be decreasing count

  return {
    header,
    body
  }
}

/**
 * Summarize the resources in the namespace indicated by the last
 * positional argument into a table, where resources are histogrammed
 * by kind.
 *
 */
function doSummarizeNamespace(args: Arguments<KubeOptions>): Promise<Table> {
  // summarize this namespace
  const ns = args.argvNoOptions[args.argvNoOptions.length - 1]
  return doSummarizeNamedNamespace(args.tab, ns)
}

/**
 * @return the currently active namespace in the currently selected context
 *
 */
async function doGetCurrentNamespace({ tab }: Arguments<KubeOptions>) {
  return (await getCurrentContext(tab)).metadata.namespace
}

export default (commandTree: Registrar) => {
  commandTree.listen(`/${commandPrefix}/namespace/current`, doGetCurrentNamespace, flags)
  commandTree.listen(`/${commandPrefix}/namespace/summarize`, doSummarizeNamespace, flags)
}
