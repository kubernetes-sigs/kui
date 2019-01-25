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

declare var hljs

import { isHeadless } from '@kui-shell/core/core/capabilities'
import * as cli from '@kui-shell/core/webapp/cli'
import { currentSelection, getSidecar } from '@kui-shell/core/webapp/views/sidecar'

import { synonyms } from '../models/synonyms'

/**
 * A just for fun plugin: beautify the source code of the selected action
 *
 */
export default async (commandTree, wsk) => {
  synonyms('actions').forEach(syn => commandTree.listen(`/wsk/${syn}/beautify`, ({ block, nextBlock, execOptions }) => {
    if (isHeadless()) {
      throw new Error('beautify not supported in headless mode')
    }

    const selection = currentSelection()
    if (!selection) {
      cli.oops(block, nextBlock)({ error: 'You have not yet selected an entity' })
      return false
    } else if (!(selection && selection.exec && selection.exec.code)) {
      cli.oops(block, nextBlock)('no action code selected')
      return false
    } else {
      // beautify
      const beautify = require('js-beautify').js_beautify

      selection.exec.code = beautify(selection.exec.code)
      const code = getSidecar().querySelector('.action-content .action-source') as HTMLElement
      code.innerText = selection.exec.code

      // re-highlight
      setTimeout(() => hljs.highlightBlock(code), 0)

      // save
      return wsk.update(execOptions)(selection)
    }
  }, { docs: 'Reformat the source code of an action',
    requireSelection: true,
    filter: selection => selection.type === 'actions'
  }))
}
