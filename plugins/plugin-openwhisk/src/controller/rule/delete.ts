/*
 * Copyright 2019-2020 IBM Corporation
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

import { Registrar, KResponse } from '@kui-shell/core'

import { synonyms } from '../../models/synonyms'
import { clientOptions, getClient } from '../../client/get'
import { deployedRule, withStandardOptions } from '../usage'

const usage = withStandardOptions({
  command: 'delete',
  strict: 'delete',
  docs: 'delete a given rule',
  example: 'wsk rule delete <rule>',
  required: deployedRule
})

export default (registrar: Registrar) => {
  synonyms('rules').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/delete`,
      async ({ argvNoOptions, execOptions }): Promise<KResponse> => {
        const name = argvNoOptions[argvNoOptions.indexOf('delete') + 1]

        await getClient(execOptions).rules.delete(
          Object.assign(
            {
              name
            },
            clientOptions
          )
        )

        return true
      },
      usage
    )
  })
}
