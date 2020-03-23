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

import { Arguments, Registrar, KResponse } from '@kui-shell/core'

import flags from './flags'
import { doExecWithStatus } from './exec'
import commandPrefix from '../command-prefix'
import { KubeOptions } from './options'

import { FinalState } from '../../lib/model/states'
import { isUsage, doHelp } from '../../lib/util/help'

/**
 * To get the status of a `run`, we look for the corresponding `deployment`
 *
 */
function prepareArgsForStatus(cmd: string, args: Arguments<KubeOptions>) {
  const name = args.argvNoOptions[args.argvNoOptions.indexOf(cmd) + 1]
  return `deployment ${name}`
}

export const doRun = (command = 'kubectl') => (args: Arguments<KubeOptions>): Promise<KResponse> => {
  if (isUsage(args)) {
    return doHelp(command, args)
  } else {
    return doExecWithStatus('run', FinalState.OnlineLike, command, undefined, prepareArgsForStatus)(args)
  }
}

export default (registrar: Registrar) => {
  const handler = doRun()
  registrar.listen(`/${commandPrefix}/kubectl/run`, handler, flags)
  registrar.listen(`/${commandPrefix}/k/run`, handler, flags)
}
