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

import { Registrar } from '@kui-shell/core'
import { doExecWithPty, emitKubectlConfigChangeEvent } from '@kui-shell/plugin-kubectl'

export default function registerOcLogin(registrar: Registrar) {
  registrar.listen('/oc/login', async args => {
    const command = args.command.replace(/login/, '_login')
    const response = await args.REPL.qexec(command)
    emitKubectlConfigChangeEvent('SetNamespaceOrContext')
    return response
  })

  registrar.listen(
    '/oc/_login',
    async args => {
      args.command = args.command.replace(/_login/, 'login')
      args.argvNoOptions[1] = 'login'
      args.argv[1] = 'login'
      const response = await doExecWithPty(args, undefined, 'oc')
      emitKubectlConfigChangeEvent('SetNamespaceOrContext')
      return response
    },
    { requiresLocal: true }
  )
}
