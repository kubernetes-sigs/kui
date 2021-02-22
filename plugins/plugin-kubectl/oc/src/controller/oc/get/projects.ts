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

import { Registrar } from '@kui-shell/core'
import {
  defaultFlags,
  commandPrefix,
  doGet,
  doExecWithStdout,
  emitKubectlConfigChangeEvent
} from '@kui-shell/plugin-kubectl'

// we use the fetcher from 'kubectl get', and the viewTransformer from 'kubectl get namespaces'
export default function registerOcProjectGet(registrar: Registrar) {
  registrar.listen(`/${commandPrefix}/oc/project`, async args => {
    const response = await doExecWithStdout(args, undefined, 'oc')

    const newNamespace = args.argvNoOptions[args.argvNoOptions.indexOf('project') + 1]
    if (newNamespace) {
      emitKubectlConfigChangeEvent('SetNamespaceOrContext', newNamespace)
    }

    return response
  })

  registrar.listen(
    `/${commandPrefix}/oc/projects`,
    args => args.REPL.qexec('oc get projects', undefined, undefined, args.execOptions),
    defaultFlags
  )

  const aliases = ['project', 'projects', 'ns', 'namespace', 'namespaces']
  aliases.forEach(ns => {
    registrar.listen(`/${commandPrefix}/oc/get/${ns}`, doGet('oc'), defaultFlags)
  })
}
