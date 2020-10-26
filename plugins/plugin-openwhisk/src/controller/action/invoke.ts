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

import { Dict } from 'openwhisk'
import { CodedError, Arguments, ParsedOptions, Registrar, MultiModalResponse } from '@kui-shell/core'

import { fqn } from '../fqn'
import toDict from '../dict'
import { kvOptions } from '../key-value'
import { synonyms } from '../../models/synonyms'
import respondWith from '../activation/as-activation'
import { Activation } from '../../models/resource'
import { clientOptions, getClient } from '../../client/get'
import { currentSelection } from '../../models/selection'
import { actionImplicitOK, params, timeout, withStandardOptions } from '../usage'

interface Options extends ParsedOptions {
  blocking?: boolean
  result?: boolean
}

export const usage = withStandardOptions({
  command: 'invoke',
  docs: 'invoke a given action',
  strict: 'invoke',
  example: 'wsk action invoke <action>',
  required: actionImplicitOK,
  optional: params.concat(
    [
      {
        name: '--blocking',
        alias: '-b',
        boolean: true,
        docs: 'blocking invocation'
      },
      {
        name: '--result',
        alias: '-r',
        boolean: true,
        docs: 'return only the activation result'
      }
    ].concat(timeout)
  )
})

/**
 * Invoke an action
 *
 */
async function invokeAction<T extends Dict>({
  tab,
  argv,
  parsedOptions,
  execOptions
}: Arguments<Options>): Promise<true | T | MultiModalResponse<Activation<T>>> {
  const { kv, argvNoOptions, nameIdx } = kvOptions(argv, 'invoke')
  const name = argvNoOptions[nameIdx] || fqn(currentSelection(tab))

  if (parsedOptions.result) {
    return getClient(execOptions).actions.invoke<Dict, T>(
      Object.assign(
        {
          name,
          params: toDict(kv.parameters),
          blocking: true,
          result: true
        },
        clientOptions
      )
    )
  } else if (parsedOptions.q) {
    return true
  } else {
    return respondWith(
      await getClient(execOptions)
        .actions.invoke<Dict, T>(
          Object.assign(
            {
              name,
              params: toDict(kv.parameters),
              blocking: parsedOptions.blocking || true
            },
            clientOptions
          )
        )
        .catch((err: CodedError<number>) => {
          if (err.statusCode === 502) {
            return err['error']
          } else {
            throw err
          }
        })
    )
  }
}

export default (registrar: Registrar) => {
  synonyms('actions').forEach(syn => {
    registrar.listen(`/wsk/${syn}/invoke`, invokeAction, usage)
  })
}
