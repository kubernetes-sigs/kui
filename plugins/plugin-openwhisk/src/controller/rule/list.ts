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

import { fqnOfDesc } from '../fqn'
import asTable from '../as-table'
import { standardListUsage } from '../usage'
import { getClient } from '../../client/get'
import { Rule } from '../../models/resource'
import { synonyms } from '../../models/synonyms'
import { copy, nameForList, ListOptions } from '../options'

export default (registrar: Registrar) => {
  synonyms('rules').forEach(syn => {
    registrar.listen(`/wsk/${syn}/count`, ({ REPL }) => REPL.qexec<number>(`wsk rule list --count`))
    ;['list', 'ls'].forEach(list => {
      registrar.listen(
        `/wsk/${syn}/${list}`,
        async ({ tab, argvNoOptions, parsedOptions, execOptions, REPL }: Arguments<ListOptions>) => {
          const name = argvNoOptions[argvNoOptions.indexOf(list) + 1]
          const args = copy(parsedOptions, nameForList(name))

          const raw = await getClient(execOptions).rules.list(args)

          if (parsedOptions.count) {
            return ((raw as any) as { rules: number }).rules
          } else {
            const rulesFull = await Promise.all(raw.map(_ => REPL.qexec<Rule>(`wsk rule get "${fqnOfDesc(_)}"`)))
            return asTable(tab, rulesFull)
          }
        },
        standardListUsage(syn)
      )
    })
  })
}
