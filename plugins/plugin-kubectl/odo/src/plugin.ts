/*
 * Copyright 2019 The Kubernetes Authors
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

import { Arguments, KResponse, Registrar } from '@kui-shell/core'

import { isUsage, doHelp, commandPrefix, defaultFlags, KubeOptions } from '@kui-shell/plugin-kubectl'

import raw from './controller/raw'

import { projectList, projectListView } from './controller/odo/project/list'
import catalogListComponents from './controller/odo/catalog/list/components'
import catalogListServices from './controller/odo/catalog/list/services'

function withHelp(handler: (args: Arguments<KubeOptions>) => Promise<KResponse>) {
  return (args: Arguments<KubeOptions>) => {
    if (isUsage(args)) {
      // special case: get --help/-h
      return doHelp('odo', args)
    }

    return handler(args)
  }
}

export default (registrar: Registrar) => {
  raw(registrar)

  registrar.listen(
    `/${commandPrefix}/odo/project/list`,
    withHelp(projectList),
    Object.assign({}, defaultFlags, { viewTransformer: projectListView })
  )

  registrar.listen(`/${commandPrefix}/odo/catalog/list/components`, withHelp(catalogListComponents), defaultFlags)
  registrar.listen(`/${commandPrefix}/odo/catalog/list/services`, withHelp(catalogListServices), defaultFlags)
}
