/*
 * Copyright 2018 IBM Corporation
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

const debug = require('debug')('seed/logs')

import UsageError from '../../../../../../build/core/usage-error'
import repl = require('../../../../../../build/core/repl')

import { flatten } from './util'
import { NAMESPACE } from './constants'

const usage = {
  command: 'inspect',
  strict: 'inspect',
  docs: 'Inspect the seed service broker logs',
  optional: [
    { name: 'container', docs: 'Show the logs of a given seed container', positional: true }
  ]
}

/**
 * Register the command
 *
 */
export default (commandTree, prequire) => {
  commandTree.listen('/seed/inspect', async ({ argvNoOptions }) => {
    const containerName = argvNoOptions[argvNoOptions.indexOf('inspect') + 1]

    const pods = await repl.qexec(`kubectl get pod -l app=seed -n ${repl.encodeComponent(NAMESPACE)} -o json`,
                                  undefined, undefined, { raw: true })
    debug('pods', pods)

    if (pods.length === 0) {
      throw new Error('seed does not seem to be deployed')
    }

    const containers = flatten(pods.map(pod => pod.spec.containers.map(container => ({ pod, container }))))
    debug('containers', containers)

    // drilldown to container logs
    const showLogs = ({ pod, container }, exec = 'pexec') => {
      return () => repl[exec](`kubectl logs ${repl.encodeComponent(pod.metadata.name)} ${repl.encodeComponent(container.name)} -n ${repl.encodeComponent(pod.metadata.namespace)}`)
    }

    if (containerName) {
      // user asked to inspect a specific container
      const findIt = containers.find(({ container }) => container.name === containerName)

      if (!findIt) {
        throw new UsageError({ message: `Container ${containerName} not found`, code: 404, usage })
      } else {
        return showLogs(findIt, 'qexec')()
      }
    } else {
      // user wasn't specific, so list them
      const headerRow: Array<any> = [{
        name: 'CONTAINER',
        type: 'component',
        outerCSS: 'header-cell',
        attributes: [
          { key: 'pod', value: 'POD', outerCSS: 'header-cell entity-name-group entity-name-group-narrow' }
        ]
      }]

      return containers.length === 0 ? true : headerRow.concat(containers.map(({ pod, container }) => ({
        type: 'container',
        name: container.name, // `${pod.metadata.name} ${container.name}`,
        onclick: showLogs({ pod, container }),
        attributes: [
          { key: 'pod',
            value: pod.metadata.name,
            css: 'deemphasize',
            outerCSS: 'entity-name-group',
            onclick: () => repl.pexec(`kubectl get pod ${repl.encodeComponent(pod.metadata.name)} -n ${repl.encodeComponent(pod.metadata.namespace)} -o yaml`)
          }
        ]

        /* onclick: () => repl.pexec(`kubectl get pod ${repl.encodeComponent(pod.metadata.name)} -n ${repl.encodeComponent(pod.metadata.namespace)} -o yaml`),
           attributes: pod.spec.containers.map(container => ({
           key: 'container',
           value: `${container.name} logs`,
           onclick: () => repl.pexec(`kubectl logs ${repl.encodeComponent(pod.metadata.name)} ${repl.encodeComponent(container.name)} -n ${repl.encodeComponent(pod.metadata.namespace)}`)
           })) */
      })))
    }
  }, { usage })
}
