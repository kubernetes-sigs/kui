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
import { doHelp, doExecWithPty, getNamespaceForArgv, KubeOptions } from '@kui-shell/plugin-kubectl'

import isUsage from './usage'
import doExecWithStdout from './exec'

const name = /^NAME:\s+([\w-]+)/

async function doInstall(args: Arguments<KubeOptions>) {
  if (isUsage(args, 'install')) {
    return doHelp('helm', args)
  } else if (/[\n;&]/.test(args.command)) {
    return doExecWithPty(args, undefined, 'helm')
  }

  try {
    const response = await doExecWithStdout(args)

    const releaseName = response.match(name)[1]
    return args.REPL.qexec(`helm status ${args.REPL.encodeComponent(releaseName)} ${getNamespaceForArgv(args)}`).catch(
      err => {
        // oops, we tried to be clever and failed; return the original response
        console.error('error in helm get for helm install', err)
        return response
      }
    )
  } catch (err) {
    if (/still in use/.test(err.message)) {
      err['code'] = 409
      err['statusCode'] = 409
    }
    throw err
  }
}

export default (registrar: Registrar) => {
  registrar.listen('/helm/install', doInstall)
}
