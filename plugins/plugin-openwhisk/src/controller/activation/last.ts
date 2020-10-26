/*
 * Copyright 2017-18 IBM Corporation
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

import { synonyms } from '../../models/synonyms'
import { Activation } from '../../models/resource'

/**
 * wsk activation last: find and display the (temporally) last activation
 *
 */
const last = ({ argv: fullArgv, REPL }: Arguments): Promise<Activation> => {
  const argv = fullArgv.slice(fullArgv.indexOf('last'))

  const limit = argv.length === 1 ? 1 : 200 // if no options, then we're showing just the last activation
  return REPL.rexec<Activation[]>(`wsk activation list --limit ${limit} ${argv.slice(1).join(' ')}`).then(response => {
    if (response.content.length === 0) {
      throw new Error(argv.length === 1 ? 'You have no activations' : 'No matching activations')
    } else {
      return REPL.qexec<Activation>(`wsk activation get ${response.content[0].activationId}`)
    }
  })
}

export default (commandTree: Registrar) => {
  synonyms('activations').forEach(syn => {
    commandTree.listen(`/wsk/${syn}/last`, last, {
      usage: {
        docs: 'Show the last activation. Hint: try passing --name xxx to filter results'
      }
    })
  })
}
