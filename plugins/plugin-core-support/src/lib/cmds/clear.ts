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

import * as Debug from 'debug'

import { isHeadless } from '@kui-shell/core/core/capabilities'
import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'
import { removeAllDomChildren } from '@kui-shell/core/webapp/util/dom'
import { resetCount } from '@kui-shell/core/webapp/cli'
import { TabState } from '../new-tab'
const debug = Debug('plugins/core-support/clear')

const usage = {
  command: 'clear',
  strict: 'clear',
  example: 'clear',
  docs: 'Clear the console',
  optional: [{ name: '--keep-current-active', alias: '-k', boolean: true, hidden: true }]
}

const clear = ({ parsedOptions, tab }: EvaluatorArgs) => {
  if (!isHeadless()) {
    if (!parsedOptions.k) {
      // don't keep the current active prompt
      debug('clearing everything, the repl loop will set up the next prompt for us')
      removeAllDomChildren(tab.querySelector('.repl-inner'))

      // abort the jobs for the current tab
      const tabState: TabState = tab['state']
      tabState.abortAllJobs()
    } else {
      // keep the current active prompt
      debug('preserving the current active prompt')
      const selector = '.repl-inner .repl-block:not(.repl-active):not(.processing)'

      const blocks = tab.querySelectorAll(selector)
      for (let idx = 0; idx < blocks.length; idx++) {
        blocks[idx].parentNode.removeChild(blocks[idx])
      }

      const remainingBlock = tab.querySelector('.repl-block') as HTMLElement
      resetCount(remainingBlock)

      // return the current processing block, if there is one
      const processing = '.repl-inner .repl-block.processing'
      return tab.querySelector(processing) || true
    }
  }

  // tell the repl we're all good
  return true
}

/**
 * This plugin introduces the /clear command, which clear the consoles
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/clear', clear, {
    usage,
    noAuthOk: true,
    inBrowserOk: true
  })
}
