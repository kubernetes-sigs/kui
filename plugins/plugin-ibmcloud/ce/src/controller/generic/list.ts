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

import { Arguments, Table, MixedResponse } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'
import { KubeOptions, watchRequestFrom, withNamespaceBreadcrumb, isUsage } from '@kui-shell/plugin-kubectl'

import getConfig from '../config'

export interface ListOptions extends KubeOptions {
  limit?: number
}

const defaultLimit = 200

export default async function(
  this: string | ((names: string[]) => string),
  args: Arguments<ListOptions>,
  { names, watch = false }: { names?: string[]; watch?: boolean } = {}
) {
  if (isUsage(args)) {
    return doExecWithStdoutViaPty(args)
  }

  const jobNames = names || args.argvNoOptions.slice(args.argvNoOptions.indexOf('list') + 1)

  const { currentConfigFile, projectName } = await getConfig(args)

  // this is the kubectl command line equivalent
  const baseCmdline = typeof this === 'string' ? this : this(jobNames)
  const cmdline = `${baseCmdline} --kubeconfig "${currentConfigFile}" ${watchRequestFrom(args, watch)}`

  const limit = args.parsedOptions.limit || defaultLimit
  return withNamespaceBreadcrumb(
    projectName,
    await args.REPL.qexec<Table | MixedResponse>(
      cmdline,
      undefined,
      undefined,
      Object.assign({}, args.execOptions, { data: { limit } })
    )
  )
}
