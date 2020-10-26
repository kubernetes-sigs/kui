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

import { Registrar } from '@kui-shell/core'

import { synonyms } from '../../models/synonyms'
import { kvOptions } from '../key-value'
import asPackage from './as-package'
import { asMetadata } from '../fqn'
import { clientOptions, getClient } from '../../client/get'
import { paramsAndAnnotations, deployedPackage, aPackage, withStandardOptions } from '../usage'

const usage = withStandardOptions({
  command: 'bind',
  strict: 'bind',
  docs: 'bind parameters to a package',
  example: 'wsk package bind <package> <bindName>',
  required: deployedPackage.concat(aPackage),
  optional: paramsAndAnnotations
})

export default (registrar: Registrar) => {
  synonyms('packages').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/bind`,
      async ({ argv, execOptions }) => {
        const { kv, argvNoOptions, nameIdx } = kvOptions(argv, 'bind')
        const src = argvNoOptions[nameIdx]
        const dst = argvNoOptions[nameIdx + 1]

        const client = getClient(execOptions)

        // first, create the binding
        const { name } = await client.packages.update(
          Object.assign(
            {
              name: dst,
              package: {
                name: dst,
                binding: asMetadata(src, '_'),
                annotations: kv.annotations,
                parameters: kv.parameters
              }
            },
            clientOptions
          )
        )

        // then, we need to refetch the package in order to get a
        // consistent view of the combined annotations and parameters
        return asPackage(await client.packages.get(Object.assign({ name }, clientOptions)))
      },
      usage
    )
  })
}
