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

import Debug from 'debug'
import { i18n, Tab } from '@kui-shell/core'
import { Action, ComponentArrayBearing } from '@kui-shell/plugin-wskflow'

import { isAnonymousLet } from '../controller/action/let/let-core'
import { Action as OWAction, Sequence, isSequence } from '../models/resource'

const strings = i18n('plugin-openwhisk')
const debug = Debug('openwhisk/modes/sequence')

/**
 * A small shim on top of the wskflow renderer
 *
 */
const wskflow = async (tab: Tab, ast: ComponentArrayBearing<Action>, rule?): Promise<HTMLElement> => {
  debug('wskflow', ast, rule)
  const { visualize } = await import('@kui-shell/plugin-wskflow')

  const container = document.createElement('div')
  const { view } = await visualize(tab, ast, undefined, undefined, undefined, undefined, undefined, rule)
  container.appendChild(view)

  return container
}

async function content(tab: Tab, entity: Sequence): Promise<HTMLElement> {
  debug('visualizing sequence')

  // form a fake AST, so we can use the wskflow visualization
  // wskflw now use the IR, so we have to fake a IR instead of a AST
  // const key = idx => `action_${idx}`
  const actions: Action[] = await Promise.all(
    entity.exec.components.map(
      (actionName: string): Promise<Action> =>
        tab.REPL.qexec<OWAction>(`wsk action get "${actionName}"`)
          .then(action => {
            debug('got sequence component', action)
            const anonymousCode = isAnonymousLet(action)
            if (anonymousCode) {
              return anonymousCode.replace(/\s/g, '')
            } else {
              return action.metadata.name
            }
            // on 404:
          })
          .catch(() => {
            debug('did not get sequence component', actionName)
            return actionName
          })
          .then(name => {
            debug('processing sequence component', name)
            const node: Action = {
              type: 'action',
              name: actionName.indexOf('/') === -1 ? `/_/${actionName}` : actionName,
              displayLabel: name
            }
            return node
          })
    )
  )

  const ast: ComponentArrayBearing<Action> = { type: 'sequence', components: actions }
  const container = await wskflow(tab, ast)

  if (entity.exec.components.length) {
    container.classList.add('small-node-count-canvas')
  }

  container.style.flex = '1'
  container.style.display = 'flex'
  return container
}

/**
 * Render the sequence as a flow view
 *
 */
export default {
  when: isSequence,
  mode: {
    mode: 'sequence',
    label: strings('Sequence'),
    content
  }
}
