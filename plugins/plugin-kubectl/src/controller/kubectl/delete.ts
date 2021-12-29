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

import defaultFlags from './flags'
import { KubeOptions } from './options'
import { doExecWithStatus, doExecWithPty, reallyNeedsPty } from './exec'

import deleteDirect from '../client/direct/delete'
import { FinalState } from '../../lib/model/states'
import { isUsage, doHelp } from '../../lib/util/help'

/**
 * Prepare the command line for delete: by default, apparently,
 * kubernetes treats finalizers as synchronous, and --wait defaults to
 * true
 *
 */
function prepareArgsForDelete(args: Arguments<KubeOptions>) {
  if (!Object.prototype.hasOwnProperty.call(args.parsedOptions, 'wait')) {
    return args.command + ' --wait=false'
  } else {
    return args.command
  }
}

export const doDelete = (command = 'kubectl') => async (args: Arguments<KubeOptions>) => {
  if (isUsage(args)) {
    return doHelp(command, args, prepareArgsForDelete)
  } else {
    if (reallyNeedsPty(args)) {
      return doExecWithPty(args, prepareArgsForDelete)
    } else {
      try {
        const directResponse = await deleteDirect(args)
        if (directResponse) {
          return directResponse
        }
      } catch (err) {
        if (err.code === 404) {
          throw err
        } else {
          console.error('Error in direct delete. Falling back to CLI delete.', err.code, err)
        }
      }
    }

    return doExecWithStatus('delete', FinalState.OfflineLike, command, prepareArgsForDelete)(args)
  }
}

export default (registrar: Registrar) => {
  registrar.listen('/kubectl/delete', doDelete(), defaultFlags)
  registrar.listen('/k/delete', doDelete(), defaultFlags)
}
