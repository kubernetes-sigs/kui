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

import defaultFlags from './flags'
import { doExecWithStatus } from './exec'
import { KubeOptions } from './options'

import { FinalState } from '../../lib/model/states'
import { isUsage, doHelp } from '../../lib/util/help'
import getServerVersion, { KubernetesVersion } from '../../lib/util/version'

/**
 * To get the status of a `run`, we look for the corresponding `deployment`
 *
 */
async function prepareArgsForStatus(this: Promise<KubernetesVersion>, cmd: string, args: Arguments<KubeOptions>) {
  // before 1.16, kubectl run created a deployment; after, it creates a pod
  const { major, minor } = await this
  const kind = major === 1 && minor < 16 ? 'deployment' : 'pod'

  const name = args.argvNoOptions[args.argvNoOptions.indexOf(cmd) + 1]
  return [kind, name]
}

export const doRun =
  (command = 'kubectl') =>
  (args: Arguments<KubeOptions>): Promise<KResponse> => {
    if (isUsage(args)) {
      return doHelp(command, args)
    } else {
      // this is intentionally async; we'll await it in prepareArgsForStatus
      const serverVersion = getServerVersion(args)
      const prepare = prepareArgsForStatus.bind(serverVersion)

      return doExecWithStatus('run', FinalState.OnlineLike, command, undefined, prepare)(args)
    }
  }

export default (registrar: Registrar) => {
  const handler = doRun()
  registrar.listen('/kubectl/run', handler, defaultFlags)
  registrar.listen('/k/run', handler, defaultFlags)
}
