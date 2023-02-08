/*
 * Copyright 2020 The Kubernetes Authors
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

import { Arguments, Registrar, isTable } from '@kui-shell/core'
import { KubeOptions, TrafficLight } from '@kui-shell/plugin-kubectl-core'

import expound from '../../lib/util/expound'
import { doGet, getFlags as flags } from './get'
import { getCommandFromArgs } from '../../lib/util/util'
import { hideWithSidecar, showAlways } from '../../lib/view/formatTable'

/**
 * As with a normal get, but transform the Ready column to be a Status column
 *
 */
export async function doGetDeployment(args: Arguments<KubeOptions>) {
  const table = await doGet(getCommandFromArgs(args))(args)

  if (isTable(table) && table.header) {
    hideWithSidecar('up-to-date', table)

    const readyIdx = table.header.attributes.findIndex(_ => /Ready/i.test(_.key))

    if (readyIdx >= 0) {
      showAlways(readyIdx, table)
      table.statusColumnIdx = readyIdx

      table.body.forEach(row => {
        const attr = row.attributes[readyIdx]
        if (attr && attr.value) {
          const match = attr.value.match(/(\d+)\/(\d+)/)
          if (match && match.length === 3) {
            attr.tag = 'badge'
            const numerator = parseInt(match[1], 10)
            const denominator = parseInt(match[2], 10)
            attr.css =
              numerator === denominator ? TrafficLight.Green : numerator === 0 ? TrafficLight.Gray : TrafficLight.Yellow
            // ^^^ re: Gray, see #8976
          }
        }
      })
    }
  }

  return table
}

export default (commandTree: Registrar) => {
  expound('deployment', 'deploy', 'v1', 'apps').forEach(deployment => {
    ;['k', 'kubectl', 'oc'].forEach(kubectl => {
      commandTree.listen(`/${kubectl}/get/${deployment}`, doGetDeployment, flags)
    })
  })
}
