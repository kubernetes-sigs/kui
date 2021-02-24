/*
 * Copyright 2017 The Kubernetes Authors
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

import { Tab } from '@kui-shell/core'

import { FlowNode } from './graph'
import ActivationLike from './activation'

const debug = Debug('plugins/wskflow/subtext')

/**
 * Render deployment status of graph nodes
 *
 */
export default async function(
  tab: Tab,
  actions: Record<string, string[]>,
  activations: ActivationLike[],
  graphData: FlowNode,
  options
): Promise<HTMLElement> {
  try {
    if (actions) {
      debug('actions', actions)
      const array = []
      const names = Object.keys(actions)
      names.forEach(name => {
        array.push(tab.REPL.qexec(`wsk action get "${name}"`))
      })

      const result = await Promise.all(array.map(p => p.catch(e => e)))

      const notDeployed = []

      const graphChildrenStatus = (childrens: FlowNode[], id: string, deployed: boolean) => {
        return childrens.forEach((children: FlowNode) => {
          if (children.id === id) children.deployed = deployed
          else if (children.children) return graphChildrenStatus(children.children, id, deployed)
        })
      }

      result.forEach((r, index) => {
        if (r.kind === 'Action' && r.metadata.name) {
          debug(`action ${r.metadata.name} is deployed`)
          actions[names[index]].forEach(id => {
            graphChildrenStatus(graphData.children, id, true)
          })
        } else {
          debug(`action ${names[index]} is not deployed`, r, names)
          if (actions[names[index]]) {
            notDeployed.push(names[index])
            actions[names[index]].forEach(id => {
              graphChildrenStatus(graphData.children, id, false)
            })
          }
        }
      })

      // warn user about not-deployed actions (but only if !activations, i.e. not for session flow)
      if (notDeployed.length > 0 && !activations) {
        if (!options || !options.noHeader) {
          // UI.empty(container)
          const css = {
            message: 'wskflow-undeployed-action-warning',
            text: 'wskflow-undeployed-action-warning-text',
            examples: 'wskflow-undeployed-action-warning-examples',
            examplesExtra: ['deemphasize', 'deemphasize-partial', 'left-pad']
          }

          const message = document.createElement('div')
          const warning = document.createElement('strong')

          const text = document.createElement('span')
          const examples = document.createElement('span')

          message.className = css.message
          text.className = css.text
          warning.className = 'red-text'
          examples.className = css.examples
          css.examplesExtra.forEach(_ => examples.classList.add(_))

          message.appendChild(warning)
          message.appendChild(text)
          message.appendChild(examples)
          // container.appendChild(message)

          warning.innerText = 'Warning: '

          const actionStr = notDeployed.length === 1 ? 'component' : 'components'
          text.innerText = `depends on ${notDeployed.length} undeployed ${actionStr}`

          /* const pre = notDeployed.length > 2 ? 'e.g. ' : ''
           const examplesOfNotDeployed = notDeployed.slice(0, 2).map(_ => _.substring(_.lastIndexOf('/') + 1)).join(', ')
           const post = notDeployed.length > 2 ? ', \u2026' : '' // horizontal ellipsis

           examples.innerText = `(${pre}${examplesOfNotDeployed}${post})` */
          return message
        }
      }
    }
  } catch (err) {
    debug('action get fetching error: ', err)
  }
}
