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
const debug = Debug('k8s/controller/describe')

import { safeDump } from 'js-yaml'

import { isPopup } from '@kui-shell/core/webapp/cli'
import { prettyPrintTime } from '@kui-shell/core/webapp/util/time'
import drilldown from '@kui-shell/core/webapp/picture-in-picture'
import { rexec as $, qexec as $$ } from '@kui-shell/core/core/repl'

import createdOn from '../util/created-on'

import { FinalState } from '../model/states'
import { IKubeStatus, DefaultKubeStatus, IKubeMetadata, DefaultKubeMetadata, IKubeResource, IResource } from '../model/resource'

import { addConditions } from '../view/modes/conditions'
import { addPods } from '../view/modes/pods'
import { addContainers } from '../view/modes/containers'
import { statusButton } from '../view/modes/status'
import { deleteResourceButton } from '../view/modes/crud'

const usage = command => ({
  title: command,
  command,
  strict: command,
  onlyEnforceOptions: [ '-f' ],
  noHelp: true, // kubectl and helm both provide their own -h output
  docs: 'Show details of a specific resource or group of resources',
  optional: [
    { name: '-f', file: true, docs: 'Filename, directory, or URL to files to use to create the resource' }
  ]
})

/** conditionally add a field, if it exists */
function addField (label: string, value: any) {
  if (value || value === 0) {
    if (!Array.isArray(value) || value.length > 0) {
      this[label] = value
    }
  }
}

/**
 * kubectl describe
 *
 */
const describe = async ({ command, parsedOptions, execOptions }) => {
  const noDelegationPlease = Object.assign({}, execOptions)
  delete noDelegationPlease.delegationOk

  // in case of failure, we fall back to executing the original command
  const fallback = () => $$(command, undefined, undefined, noDelegationPlease)

  try {
    const getCmd = command
      .replace(/describe/, 'get')
      .replace(/(-o|--output)[= ](yaml|json)/, '')

    const describeCmd = command
      .replace(/get/, 'describe')
    debug('getCmd', getCmd)

    const resource: IKubeResource = await $(`${getCmd} -o json`, noDelegationPlease)

    const response = await renderDescribe(command, getCmd, describeCmd, resource, parsedOptions)
    if (!response || !response.content || response.content === '{}' || Object.keys(response.content).length === 0) {
      debug('the describe summary is empty, falling back to base view')
      return fallback()
    } else {
      return response
    }
  } catch (err) {
    // failsafe in case we got too clever
    console.error('error trying to be clever with describe', err)
    return fallback()
  }
}

/**
 * Render a describe summary
 *
 */
const renderDescribe = async (command: string, getCmd: string, describeCmd: string, resource: IKubeResource, parsedOptions) => {
  debug('renderDescribe', command, resource)

  const { spec = {} } = resource
  const metadata: IKubeMetadata = resource.metadata || new DefaultKubeMetadata()
  const status: IKubeStatus = resource.status || new DefaultKubeStatus()

  const output = parsedOptions.o || parsedOptions.output || 'yaml'
  const name = metadata.name
  const ns = metadata.namespace

  const summary = {}
  const add = addField.bind(summary)

  if (isPopup()) {
    // popup mode may not display name and namespace in header
    add('Name', name)
    add('Namespace', ns)
  }

  add('Kind', resource.kind)
  add('Priority', spec.priority)
  add('Node', spec.nodeName && spec.hostIP && `${spec.nodeName}/${spec.hostIP}`)
  add('Start Time', status.startTime)
  add('Labels', metadata.labels)
  add('Selectors', spec.selector)
  add('Type', spec.type)
  add('Annotations', metadata.annotations)
  add('Status', status.phase)
  add('Controlled By', metadata.ownerReferences && metadata.ownerReferences.length === 1 && `${metadata.ownerReferences[0].kind}/${metadata.ownerReferences[0].name}`)

  // configmaps
  add('Data', resource.data)

  // services
  add('IP', spec.clusterIP)

  // deployments
  add('Replicas', status.replicas && {
    desired: status.replicas || 0,
    available: status.availableReplicas || 0,
    ready: status.readyReplicas || 0,
    updated: status.updatedReplicas || 0,
    unavailable: status.unavailableReplicas || 0
  })
  add('StrategyType', spec.strategy && spec.strategy.type)
  // pods
  add('IP', status.podIP)
  // 'Init Containers': spec.initContainers,
  // Containers: spec.containers,
  // Conditions: status.conditions,
  // Volumes: spec.volumes,
  add('QoS Class', status.qosClass)
  add('Tolerations', (spec.tolerations || []).map(({ key, value, effect, tolerationSeconds }) => {
    if (!effect) {
      return { key, value }
    } else {
      return { tolerate: key, effect, for: `${tolerationSeconds}s` }
    }
  }))

  const modes: Array<any> = [
    {
      mode: 'summary',
      defaultMode: true,
      direct: describeCmd,
      leaveBottomStripeAlone: true
    }
  ]
  const yaml = resource
  {
    const command = 'kubectl'
    const resource: IResource = { kind: yaml.kind, name: yaml.metadata.name, yaml }
    modes.push(statusButton(command, resource, FinalState.NotPendingLike))
    addConditions(modes, command, resource)
    addPods(modes, command, resource)
    addContainers(modes, command, resource)
  }
  modes.push({
    mode: 'raw',
    direct: `${getCmd} -o ${output}`,
    leaveBottomStripeAlone: true
  })
  modes.push(deleteResourceButton())

  const badges = []
  badges.push(metadata && metadata.generation && `Generation ${metadata.generation}`)
  badges.push(metadata && metadata.labels && metadata.labels.app)

  if (Object.keys(summary).length === 0) {
    debug('oops, we created an empty summary')

    // smash in the entire resource
    Object.assign(summary, resource)

    // remove the "raw" mode, as it will be equivalent to the default "summary" mode
    modes.splice(modes.findIndex(_ => _.mode === 'raw'), 1)
  }

  const description = {
    type: 'custom',
    isEntity: true,
    name,
    packageName: ns,
    version: resource && metadata && metadata.labels && metadata.labels.version,
    badges: badges.filter(x => x),
    contentType: output,
    prettyType: resource.kind,
    subtext: createdOn(resource),
    modes,
    content: output === 'json' ? summary : safeDump(summary).trim()
  }
  debug('description', description, resource)

  return description
}

export default describe
