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

import { Arguments, Registrar } from '@kui-shell/core'
import { isUsage, doHelp, KubeOptions } from '@kui-shell/plugin-kubectl'

import doExecWithStdout from './exec'
import commandPrefix from '../command-prefix'

const name = /^NAME:\s+([\w-]+)/

async function doInstall(args: Arguments<KubeOptions>) {
  if (isUsage(args)) {
    return doHelp('helm', args)
  }

  const response = await doExecWithStdout(args)

  const releaseName = response.match(name)[1]
  return args.REPL.qexec(`helm get ${args.REPL.encodeComponent(releaseName)}`).catch(err => {
    // oops, we tried to be clever and failed; return the original response
    console.error('error in helm get for helm install', err)
    return response
  })
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/helm/install`, doInstall)
}
