/*
 * Copyright 2021 The Kubernetes Authors
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

import { Arguments, Capabilities, Registrar } from '@kui-shell/core'
import {
  KubeOptions,
  doExecWithPty,
  emitKubectlConfigChangeEvent,
  getCurrentContextName,
  getCurrentDefaultNamespace
} from '@kui-shell/plugin-kubectl'

/**
 * There is no good way I can see to prase out the new context and
 * namespace from the command line response to `oc login`. Sigh, so we
 * need to re-fetch the data from disk.
 */
async function emitConfigChange(args: Arguments<KubeOptions>) {
  // re-fetch from disk
  const newContext = await getCurrentContextName(args)
  const newNamespace = await getCurrentDefaultNamespace(args, newContext, true)

  // then notify the views of the config change
  emitKubectlConfigChangeEvent('LoginToContext', newNamespace, newContext)
}

export default function registerOcLogin(registrar: Registrar) {
  registrar.listen('/oc/login', async args => {
    const command = args.command.replace(/login/, '_login')
    const response = await args.REPL.qexec(command)
    if (Capabilities.inBrowser()) {
      // we'll need to emit this event on the browser side, as well as
      // (below) on the proxy side
      emitConfigChange(args)
    }
    return response
  })

  registrar.listen(
    '/oc/_login',
    async args => {
      args.command = args.command.replace(/_login/, 'login')
      args.argvNoOptions[1] = 'login'
      args.argv[1] = 'login'
      const response = await doExecWithPty(args, undefined, 'oc')
      emitConfigChange(args)
      return response
    },
    { requiresLocal: true }
  )
}
