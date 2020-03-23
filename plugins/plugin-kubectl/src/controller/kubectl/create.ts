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

import { Registrar, Arguments } from '@kui-shell/core'

import flags from './flags'
import { doExecWithStatus } from './exec'
import { KubeOptions } from './options'
import commandPrefix from '../command-prefix'

import { FinalState } from '../../lib/model/states'
import { isUsage, doHelp } from '../../lib/util/help'

const verbs = ['create', 'apply']

// export const doCreate = (verb: string, command = 'kubectl') => doExecWithStatus(verb, FinalState.OnlineLike, command)

export const doCreate = (verb: string, command = 'kubectl') => async (args: Arguments<KubeOptions>) => {
  if (isUsage(args)) {
    return doHelp(command, args)
  } else {
    return doExecWithStatus(verb, FinalState.OnlineLike, command)(args)
  }
}

export default (registrar: Registrar) => {
  verbs.forEach(verb => {
    const handler = doCreate(verb)
    registrar.listen(`/${commandPrefix}/kubectl/${verb}`, handler, flags)
    registrar.listen(`/${commandPrefix}/k/${verb}`, handler, flags)
  })
}
