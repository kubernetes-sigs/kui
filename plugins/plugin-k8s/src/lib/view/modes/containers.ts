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

import * as Debug from 'debug'
const debug = Debug('k8s/view/modes/containers')

import repl = require('@kui-shell/core/core/repl')
import drilldown from '@kui-shell/core/webapp/picture-in-picture'
import { formatMultiListResult } from '@kui-shell/core/webapp/views/table'

import IResource from '../../model/resource'

import { TrafficLight } from '../../model/states'

import insertView from '../insert-view'
import { getActiveView, formatTable } from '../formatMultiTable'

/** for drilldown back button */
const viewName = 'Containers'

/**
 * Add a Containers mode button to the given modes model, if called
 * for by the given resource.
 *
 */
export const addContainers = (modes: Array<any>, command: string, resource: IResource) => {
  if (resource.yaml.spec && resource.yaml.spec.containers) {
    modes.push(containersButton(command, resource))
  }
}

/**
 * Return a sidecar mode button model that shows a containers table
 * for the given resource
 *
 */
export const containersButton = (command: string, resource: IResource, overrides?) => Object.assign({}, {
  mode: 'containers',
  direct: () => renderAndViewContainers(command, resource)
}, overrides || {})

/**
 * Format a timestamp field from the status.containers model; these might be null
 *
 */
const formatTimestamp = (timestamp: string): string => {
  debug('formatTimestamp', timestamp)

  if (!timestamp) {
    return ''
  } else {
    return new Date(timestamp).toLocaleString()
  }
}

/**
 * Render the tabular containers view
 *
 */
export const renderContainers = async (command: string, resource: IResource) => {
  debug('renderContainers', command, resource)

  return formatTable([headerModel(resource).concat(bodyModel(resource))])
}

/**
 * Render the table header model
 *
 */
const headerModel = (resource: IResource): Array<any> => {
  const statuses = resource.yaml.status && resource.yaml.status.containerStatuses

  const specAttrs = [
    { value: 'PORTS', outerCSS: 'header-cell pretty-narrow' }
  ]

  const statusAttrs = !statuses ? [] : [
    { value: 'RESTARTS', outerCSS: 'header-cell very-narrow' },
    { value: 'READY', outerCSS: 'header-cell very-narrow' },
    { value: 'STATE', outerCSS: 'header-cell very-narrow' },
    { value: 'MESSAGE', outerCSS: 'header-cell' }
  ]

  return [{
    type: 'container',
    name: 'IMAGE',
    outerCSS: 'header-cell not-too-wide',
    noSort: true,
    title: 'Containers',
    attributes: specAttrs.concat(statusAttrs)
  }]
}

/**
 * Render the table body model
 *
 */
const bodyModel = (resource: IResource): Array<any> => {
  const pod = resource.yaml
  const statuses = pod.status && pod.status.containerStatuses

  const podName = repl.encodeComponent(pod.metadata.name)
  const ns = repl.encodeComponent(pod.metadata.namespace)

  const bodyModel = pod.spec.containers.map(container => {
    const status = statuses && statuses.find(_ => _.name === container.name)
    debug('container status', container.name, status.restartCount, status)

    const stateKey = Object.keys(status.state)[0]
    const stateBody = status.state[stateKey]

    const statusAttrs: Array<any> = !status ? [] : [
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
        css: stateKey === 'running' ? TrafficLight.Green : stateKey === 'terminated' ? TrafficLight.Red : TrafficLight.Yellow,
        watch: async (idx: number) => {
          // { value, done = false, css, onclick, others = [], unchanged = false, outerCSS }
          const pod = await repl.qexec(`kubectl get pod ${podName} -n ${ns} -o json`, undefined, undefined, { raw: true })

          const statuses = pod.status && pod.status.containerStatuses
          const status = statuses && statuses.find(_ => _.name === container.name)
          const stateKey = Object.keys(status.state)[0]
          const stateBody = status.state[stateKey]
          debug('watch', status, stateKey, pod)

          const done = status.ready || stateKey === 'terminated'
          const value = stateKey
          const css = stateKey === 'running' ? TrafficLight.Green : stateKey === 'terminated' ? TrafficLight.Red : TrafficLight.Yellow
          const others = [
            {
              key: 'ready',
              value: status.ready,
              css: status.ready ? 'green-text' : 'yellow-text',
              fontawesome: status.ready ? 'fas fa-check-circle' : 'far fa-dot-circle'
            },
            {
              key: 'message',
              value: stateBody.startedAt || stateBody.reason
            }
          ]
          debug('watch update', done, value, css, others)

          return {
            done, value, css, others
          }
        }
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

    const specAttrs = [
      portsAttr
    ]

    return {
      type: 'container',
      name: container.name,
      onclick: showLogs({ pod, container }),
      attributes: specAttrs.concat(statusAttrs)
    }
  })
  debug('body model', bodyModel)

  return bodyModel
}

/**
 * Return a drilldown function that shows container logs
 *
 */
const showLogs = ({ pod, container }, exec = 'pexec') => {
  const podName = repl.encodeComponent(pod.metadata.name)
  const containerName = repl.encodeComponent(container.name)
  const ns = repl.encodeComponent(pod.metadata.namespace)

  // a bit convoluted, so we can delay the call to getActiveView
  return (evt: Event) => {
    return drilldown(`kubectl logs ${podName} ${containerName} -n ${ns}`,
                     undefined,
                     getActiveView(),
                     viewName,
                     { exec })(evt)
  }
}

/**
 * Render a containers table and show it in the sidecar
 *
 */
export const renderAndViewContainers = (command: string, resource: IResource) => {
  renderContainers(command, resource).then(insertView)
}
