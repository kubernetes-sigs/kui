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

import { Arguments, Registrar } from '@kui-shell/core'
import { isUsage, doHelp, preprocessTable, formatTable, KubeOptions } from '@kui-shell/plugin-kubectl'

import doExecWithStdout from './exec'

async function doList(args: Arguments<KubeOptions>) {
  if (isUsage(args)) {
    return doHelp('helm', args)
  }

  const response = await doExecWithStdout(args)

  const preTables = preprocessTable(response.split(/^(?=LAST SEEN|NAMESPACE|NAME\s+)/m))
  if (preTables[0].length === 0) {
    // nothing to list
    return true
  } else {
    return formatTable('helm', 'status', undefined, args, preTables[0])
  }
}

export default (registrar: Registrar) => {
  registrar.listen('/helm/ls', doList)
  registrar.listen('/helm/list', doList)
}
