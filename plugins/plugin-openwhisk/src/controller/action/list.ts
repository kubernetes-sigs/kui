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

import { standardListUsage } from '../usage'
import { asActionTable } from './as-action'
import { getClient } from '../../client/get'
import { synonyms } from '../../models/synonyms'
import { copy, nameForList, ListOptions } from '../options'

export default (registrar: Registrar) => {
  synonyms('actions').forEach(syn => {
    registrar.listen(`/wsk/${syn}/count`, ({ REPL }) => REPL.qexec<number>(`wsk action list --count`))
    ;['list', 'ls'].forEach(list => {
      registrar.listen(
        `/wsk/${syn}/${list}`,
        async ({ tab, argvNoOptions, parsedOptions, execOptions }: Arguments<ListOptions>) => {
          const name = argvNoOptions[argvNoOptions.indexOf(list) + 1]
          const args = copy(parsedOptions, nameForList(name))

          const raw = await getClient(execOptions).actions.list(args)
          if (parsedOptions.count) {
            return ((raw as any) as { actions: number }).actions
          } else {
            return asActionTable(tab, raw)
          }
        },
        standardListUsage(syn)
      )
    })
  })
}
