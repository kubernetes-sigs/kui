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

import { Namespace as RawNamespace } from 'openwhisk'
import { Arguments, Registrar, RawResponse, KResponse } from '@kui-shell/core'

import respondWith from './as-namespace'
import { getClient } from '../../client/get'
import { synonyms } from '../../models/synonyms'
import { withStandardOptions } from '../usage'

const verb = 'get'

export const usage = (syn: string) => ({
  strict: verb,
  command: verb,
  docs: 'get the details of a given namespace',
  example: `wsk ${syn} ${verb} <namespace>`,
  required: [{ name: 'namespace', docs: 'The name of a namespace' }]
})

async function doGet({ argvNoOptions, execOptions }: Arguments) {
  const name = argvNoOptions[argvNoOptions.indexOf('get') + 1]
  const raw = await getClient(execOptions).namespaces.get(name)

  if (execOptions.raw) {
    const response: KResponse<RawNamespace> = { mode: 'raw', content: raw } as RawResponse<RawNamespace>
    return response
  } else {
    return respondWith(name, raw)
  }
}

export default (registrar: Registrar) => {
  synonyms('namespaces').forEach(syn => {
    registrar.listen(`/wsk/${syn}/${verb}`, doGet, withStandardOptions(usage(syn)))
  })
}
