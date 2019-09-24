/*
 * Copyright 2017 IBM Corporation
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

import { getSidecar } from '@kui-shell/core/webapp/views/sidecar'
import { Capabilities, Commands } from '@kui-shell/core'

import { update } from './openwhisk-core'
import { synonyms } from '../models/synonyms'
import { currentSelection } from '../models/openwhisk-entity'

declare let hljs

/**
 * A just for fun plugin: beautify the source code of the selected action
 *
 */
export default async (commandTree: Commands.Registrar) => {
  synonyms('actions').forEach(syn =>
    commandTree.listen(
      `/wsk/${syn}/beautify`,
      ({ execOptions, tab }) => {
        if (Capabilities.isHeadless()) {
          throw new Error('beautify not supported in headless mode')
        }

        const selection = currentSelection(tab)
        if (!selection) {
          throw new Error('You have not yet selected an entity')
        } else if (!(selection && selection.exec && selection.exec.code)) {
          throw new Error('no action code selected')
        } else {
          // beautify
          const beautify = require('js-beautify').js_beautify

          selection.exec.code = beautify(selection.exec.code)
          const code = getSidecar(tab).querySelector('.action-content .action-source') as HTMLElement
          code.innerText = selection.exec.code

          // re-highlight
          setTimeout(() => hljs.highlightBlock(code), 0)

          // save
          return update(execOptions)(selection)
        }
      },
      {
        usage: {
          command: 'beautify',
          docs: 'Reformat the source code of an action'
        }
        // requireSelection: true,
        // filter: selection => selection.type === 'actions'
      }
    )
  )
}
