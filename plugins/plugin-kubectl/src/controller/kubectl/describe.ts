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

import flags from './flags'
import { exec } from './exec'
import commandPrefix from '../command-prefix'

import { doGetAsEntity } from './get'

import { KubeResource } from '../../lib/model/resource'
import { KubeOptions } from './options'

/**
 * describe -> get
 *
 */
function prepareArgsForDescribe(args: Arguments<KubeOptions>) {
  return `${args.command.replace(/(k|kubectl)(\s+)describe(\s+)/, '$1$2get$3')} -o yaml`
}

export const doDescribe = (command = 'kubectl') =>
  async function(args: Arguments<KubeOptions>): Promise<KubeResource> {
    // first, we do the raw exec of the given command
    const response = await exec(args, prepareArgsForDescribe, command)

    return doGetAsEntity(args, response)
  }

export default (registrar: Registrar) => {
  const handler = doDescribe()
  registrar.listen(`/${commandPrefix}/kubectl/describe`, handler, flags)
  registrar.listen(`/${commandPrefix}/k/describe`, handler, flags)
}
