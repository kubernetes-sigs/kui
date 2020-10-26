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

import { fqn } from '../fqn'
import respondWith from './as-trigger'
import standardOptions from '../aliases'
import { synonyms } from '../../models/synonyms'
import { clientOptions, getClient } from '../../client/get'
import { currentSelection } from '../../models/selection'
import { deployedTrigger, withStandardOptions } from '../usage'

const usage = {
  command: 'get',
  strict: 'get',
  docs: 'get the details of a trigger',
  example: 'wsk trigger get <trigger>',
  required: deployedTrigger
}

const doGet = (defaultMode?: string, verb = defaultMode) => async ({ tab, argvNoOptions, execOptions }: Arguments) => {
  const name = argvNoOptions[argvNoOptions.indexOf(verb || 'get') + 1] || fqn(currentSelection(tab, 'Trigger'))

  return respondWith(
    await getClient(execOptions).triggers.get(
      Object.assign(
        {
          name
        },
        clientOptions
      )
    ),
    defaultMode
  )
}

export default (registrar: Registrar) => {
  synonyms('triggers').forEach(syn => {
    registrar.listen(`/wsk/${syn}/get`, doGet(), withStandardOptions(usage))
    registrar.listen(`/wsk/${syn}/params`, doGet('parameters', 'params'), standardOptions)
    registrar.listen(`/wsk/${syn}/parameters`, doGet('parameters'), standardOptions)
    registrar.listen(`/wsk/${syn}/raw`, doGet('raw'), standardOptions)
  })
}
