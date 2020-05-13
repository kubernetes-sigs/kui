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

import { encodeComponent, i18n, Tab, Row, Cell, Table, ModeRegistration } from '@kui-shell/core'

import KubeResource from '../../model/resource'
import TrafficLight from '../../model/traffic-light'
import { getCommandFromArgs } from '../../util/util'

const strings = i18n('plugin-kubectl')
const debug = Debug('plugin-kubectl/view/modes/containers')

/**
 * Render the table header model
 *
 */
const headerModel = (pod: KubeResource): Row => {
  const statuses = pod.status && pod.status.containerStatuses

  const specAttrs: Cell[] = [{ value: 'PORTS', outerCSS: 'pretty-narrow' }]

  const statusAttrs: Cell[] = !statuses
    ? []
    : [
        { value: 'RESTARTS', outerCSS: 'very-narrow' },
        { value: 'READY', outerCSS: 'very-narrow' },
        { value: 'STATE', outerCSS: 'pretty-narrow' },
        { value: 'MESSAGE' }
      ]

  return {
    type: 'container',
    name: 'IMAGE',
    attributes: specAttrs.concat(statusAttrs)
  }
}

/**
 * Return a drilldown function that shows container logs
 *
 */
const showLogs = (tab: Tab, { pod, container }, args: { argvNoOptions: string[] }) => {
  const podName = encodeComponent(pod.metadata.name)
  const containerName = encodeComponent(container.name)
  const ns = encodeComponent(pod.metadata.namespace)

  return `${getCommandFromArgs(args)} logs ${podName} -c ${containerName} -n ${ns}`
}

/**
 * Render the table body model
 *
 */
const bodyModel = (tab: Tab, pod: KubeResource, args: { argvNoOptions: string[] }): Row[] => {
  const statuses = pod.status && pod.status.containerStatuses

  const bodyModel: Row[] = pod.spec.containers
    .map(container => {
      const status = statuses && statuses.find(_ => _.name === container.name)

      if (!status) {
        // sometimes there is a brief period with no containerStatuses
        // for a given container
        return
      }

      debug('container status', container.name, status.restartCount, status)

      const stateKey = Object.keys(status.state)[0]
      const stateBody = status.state[stateKey]

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const statusAttrs: any[] = !status
        ? []
        : [
            {
              key: 'restartCount',
              value: status.restartCount,
              outerCSS: 'very-narrow'
            },
            {
              key: 'ready',
              value: status.ready,
              fontawesome: status.ready ? 'fas fa-check-circle' : 'far fa-dot-circle',
              css: status.ready ? 'green-text' : 'yellow-text'
            },
            {
              key: 'state',
              value: stateKey,
              tag: 'badge',
              outerCSS: 'capitalize',
              css:
                stateKey === 'running'
                  ? TrafficLight.Green
                  : stateKey === 'terminated'
                  ? TrafficLight.Red
                  : TrafficLight.Yellow
            },
            {
              key: 'message',
              outerCSS: 'smaller-text',
              value: stateBody.startedAt || stateBody.reason
            }
          ]

      const portsAttr = {
        key: 'ports',
        value: (container.ports || []).map(({ containerPort, protocol }) => `${containerPort}/${protocol}`).join(' ')
      }

      const specAttrs = [portsAttr]

      return {
        type: 'container',
        name: container.name,
        onclick: showLogs(tab, { pod, container }, args),
        attributes: specAttrs.concat(statusAttrs)
      }
    })
    .filter(_ => _)
  debug('body model', bodyModel)

  return bodyModel
}

/**
 * Render the tabular containers view
 *
 */
async function renderContainers(tab: Tab, resource: KubeResource, args: { argvNoOptions: string[] }): Promise<Table> {
  const fetchPod = `${getCommandFromArgs(args)} get pod ${encodeComponent(resource.metadata.name)} -n "${
    resource.metadata.namespace
  }" -o json`
  debug('issuing command', fetchPod)

  try {
    const podResource = await tab.REPL.qexec<KubeResource>(fetchPod, undefined, undefined, { raw: true })
    debug('renderContainers.response', podResource)

    return {
      header: headerModel(podResource),
      body: bodyModel(tab, podResource, args),
      noSort: true
    }
  } catch (err) {
    if (err.code === 404) {
      return { body: [] }
    } else {
      throw err
    }
  }
}

/**
 * Resource filter: if the resource has containers in its spec
 *
 */
function hasContainers(resource: KubeResource) {
  return resource.spec && resource.spec.containers
}

/**
 * Add a Containers mode button to the given modes model, if called
 * for by the given resource.
 *
 */
export const containersMode: ModeRegistration<KubeResource> = {
  when: hasContainers,
  mode: {
    mode: 'containers',
    label: strings('containers'),
    content: renderContainers
  }
}

export default containersMode
