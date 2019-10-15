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

import { Tab } from '@kui-shell/core/api/ui-lite'
import { ModeRegistration, Mode } from '@kui-shell/core/api/registrars'
import { Row } from '@kui-shell/core/api/table-models'
import { i18n } from '@kui-shell/core/api/i18n'
import { encodeComponent } from '@kui-shell/core/api/repl-util'

import { Resource, KubeResource } from '../../model/resource'
import { TrafficLight } from '../../model/states'

const strings = i18n('plugin-k8s')
const debug = Debug('k8s/view/modes/containers')

/**
 * Return a sidecar mode button model that shows a containers table
 * for the given resource
 *
 */
export const containersButton = (command: string, resource: Resource, overrides?): Mode =>
  Object.assign(
    {},
    {
      mode: 'containers',
      label: strings('containers'),
      direct: {
        plugin: 'k8s/dist/index',
        operation: 'renderAndViewContainers',
        parameters: { command, resource }
      }
    },
    overrides || {}
  )

/**
 * Add a Containers mode button to the given modes model, if called
 * for by the given resource.
 *
 */
export const containersMode: ModeRegistration<KubeResource> = {
  when: (resource: KubeResource) => {
    return resource.spec && resource.spec.containers
  },
  mode: (command: string, resource: Resource): Mode => {
    try {
      return containersButton(command, resource)
    } catch (err) {
      debug('error rendering containers button')
      console.error(err)
    }
  }
}

/**
 * Return a drilldown function that shows container logs
 *
 */
const showLogs = (tab: Tab, { pod, container }) => {
  const podName = encodeComponent(pod.metadata.name)
  const containerName = encodeComponent(container.name)
  const ns = encodeComponent(pod.metadata.namespace)

  return `kubectl logs ${podName} ${containerName} -n ${ns}`
}

/**
 * Render the table header model
 *
 */
const headerModel = (resource: Resource): Row => {
  const statuses = resource.resource.status && resource.resource.status.containerStatuses

  const specAttrs = [{ value: 'PORTS', outerCSS: 'header-cell pretty-narrow' }]

  const statusAttrs = !statuses
    ? []
    : [
        { value: 'RESTARTS', outerCSS: 'header-cell very-narrow' },
        { value: 'READY', outerCSS: 'header-cell very-narrow' },
        { value: 'STATE', outerCSS: 'header-cell pretty-narrow' },
        { value: 'MESSAGE', outerCSS: 'header-cell' }
      ]

  return {
    type: 'container',
    name: 'IMAGE',
    outerCSS: 'header-cell not-too-wide',
    attributes: specAttrs.concat(statusAttrs)
  }
}

/**
 * Render the table body model
 *
 */
const bodyModel = (tab: Tab, resource: Resource): Row[] => {
  const pod = resource.resource
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
              outerCSS: 'smaller-text not-too-wide',
              value: stateBody.startedAt || stateBody.reason
            }
          ]

      const portsAttr = {
        key: 'ports',
        outerCSS: 'not-too-wide',
        value: (container.ports || []).map(({ containerPort, protocol }) => `${containerPort}/${protocol}`).join(' ')
      }

      const specAttrs = [portsAttr]

      return {
        type: 'container',
        name: container.name,
        onclick: showLogs(tab, { pod, container }),
        usePip: true,
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
export const renderContainers = async (tab: Tab, command: string, resource: Resource) => {
  debug('renderContainers', command, resource)

  const fetchPod = `kubectl get pod ${encodeComponent(resource.resource.metadata.name)} -n "${
    resource.resource.metadata.namespace
  }" -o json`
  debug('issuing command', fetchPod)

  try {
    const podResource = await tab.REPL.qexec<Resource>(fetchPod)
    debug('renderContainers.response', podResource)

    return {
      header: headerModel(podResource),
      body: bodyModel(tab, podResource),
      noSort: true,
      title: 'Containers'
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
 * Render a containers table and show it in the sidecar
 *
 */
interface Parameters {
  command: string
  resource: Resource
}
export const renderAndViewContainers = (tab: Tab, parameters: Parameters) => {
  return renderContainers(tab, parameters.command, parameters.resource)
}
