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

import { Arguments, Registrar, KResponse } from '@kui-shell/core'

import { exec } from './exec'

import { doGetAsEntity, getFlags as flags } from './get'
import { KubeOptions } from './options'
import { isUsage, doHelp } from '../../lib/util/help'
import { commandWithoutResource } from '../../lib/util/util'

/**
 * describe -> get
 *
 */
function prepareArgsForDescribe(args: Arguments<KubeOptions>) {
  return `${args.command.replace(/(k|kubectl|oc)(\s+)describe(\s+)/, '$1$2get$3')} -o yaml`
}

const doDescribe = (command: string) =>
  async function (args: Arguments<KubeOptions>): Promise<KResponse> {
    if (isUsage(args)) {
      return doHelp(command, args)
    } else if (commandWithoutResource(args)) {
      return exec(args, undefined, command)
    } else {
      // first, we do the raw exec of the given command
      const response = await exec(args, prepareArgsForDescribe, command)
      return doGetAsEntity(args, response)
    }
  }

/** Register a command listener */
export function describer(registrar: Registrar, command: string, cli = command) {
  registrar.listen(`/${command}/describe`, doDescribe(cli), flags)
}

export default (registrar: Registrar) => {
  describer(registrar, 'kubectl')
  describer(registrar, 'k', 'kubectl')
}
