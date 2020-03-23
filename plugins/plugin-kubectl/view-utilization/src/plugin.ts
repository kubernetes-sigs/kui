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

import { Arguments, Registrar, Table } from '@kui-shell/core'
import { KubeOptions, defaultFlags, commandPrefix } from '@kui-shell/plugin-kubectl'

import { topContainer, topPod } from './controller/get-pod-data'
import { NodeOptions, topNode } from './controller/get-node-data'

export default async (commandTree: Registrar) => {
  // works around a defect in the core's `override` function; if the
  // plugin-kubectl is loaded before us, our override is ignored
  const top = (await commandTree.find(`/${commandPrefix}/kubectl/top/node`, 'plugin-kubectl')).$ as (
    args: Arguments<KubeOptions>
  ) => Promise<Table>
  commandTree.listen(
    `/${commandPrefix}/kubectl/top/node-summary`,
    async (args: Arguments<NodeOptions>) => {
      args.command = args.command.replace(/node-summary/, 'node --summary')
      args.parsedOptions.summary = true
      return topNode(args, top)
    },
    defaultFlags
  )

  commandTree.override(`/${commandPrefix}/kubectl/top/node`, 'plugin-kubectl', topNode, defaultFlags)
  commandTree.override(`/${commandPrefix}/k/top/node`, 'plugin-kubectl', topNode, defaultFlags)

  commandTree.override(`/${commandPrefix}/kubectl/top/pod`, 'plugin-kubectl', topPod, defaultFlags)
  commandTree.override(`/${commandPrefix}/k/top/pod`, 'plugin-kubectl', topPod, defaultFlags)

  commandTree.listen(`/${commandPrefix}/kubectl/top/container`, topContainer, defaultFlags)
  commandTree.listen(`/${commandPrefix}/k/top/container`, topContainer, defaultFlags)
}
