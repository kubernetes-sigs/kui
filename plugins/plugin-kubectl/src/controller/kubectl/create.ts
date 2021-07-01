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

import Debug from 'debug'
import { Registrar, Arguments, is404or409 } from '@kui-shell/core'

import defaultFlags from './flags'
import { isDryRun, isEntityFormat, KubeOptions, formatOf } from './options'
import { doExecWithStatus, exec, reallyNeedsPty } from './exec'
import createDirect from '../client/direct/create'

import { FinalState } from '../../lib/model/states'
import { isUsage, doHelp } from '../../lib/util/help'
import { doGetAsEntity, viewTransformer } from './get'

const debug = Debug('plugin-kubectl/controller/kubectl/create')

/** The create-like verbs we will handle */
const verbs = ['create' as const, 'apply' as const]

export const doCreate = (verb: 'create' | 'apply', command = 'kubectl') => async (args: Arguments<KubeOptions>) => {
  if (isUsage(args)) {
    return doHelp(command, args)
  } else {
    if (isDryRun(args)) {
      const raw = await exec(args, undefined, command)
      if (isEntityFormat(formatOf(args)) && !reallyNeedsPty(args)) {
        const entity = await doGetAsEntity(args, raw)
        return entity
      } else {
        return raw.content.stdout
      }
    } else {
      try {
        const response = await createDirect(args, verb)
        if (response) {
          return response
        } else {
          debug('createDirect falling through to CLI impl')
        }
      } catch (err) {
        if (is404or409(err)) {
          throw err
        } else {
          console.error('Error in direct create. Falling back to CLI create.', err.code, err)
        }
      }

      // Note: the kuiSourceRef info will be added by `doStatus` in
      // ./status.ts, which is called by `doExecWithStatus`
      return doExecWithStatus(verb, FinalState.OnlineLike, command)(args)
    }
  }
}

export const applyFlag = Object.assign({}, defaultFlags, { viewTransformer })

export default (registrar: Registrar) => {
  verbs.forEach(verb => {
    const handler = doCreate(verb)
    registrar.listen(`/kubectl/${verb}`, handler, applyFlag)
    registrar.listen(`/k/${verb}`, handler, applyFlag)
  })
}
