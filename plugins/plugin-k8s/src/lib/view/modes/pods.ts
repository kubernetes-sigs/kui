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

import { REPL, Tables, UI } from '@kui-shell/core'

import { selectorToString } from '../../util/selectors'
import { Resource, KubeResource } from '../../model/resource'
import insertView from '../insert-view'
import { formatTable } from '../formatMultiTable'

const debug = Debug('k8s/view/modes/pods')

/** for drilldown back button */
const viewName = 'Pods'

/**
 * Return a sidecar mode button model that shows a pods table for the
 * given resource
 *
 */
const podsButton = (command: string, resource: Resource, overrides?): UI.Mode =>
  Object.assign(
    {},
    {
      mode: 'pods',
      direct: {
        plugin: 'k8s/dist/index',
        operation: 'renderAndViewPods',
        parameters: { command, resource }
      }
    },
    overrides || {}
  )

/**
 * Add a Pods mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const podMode: UI.ModeRegistration<KubeResource> = {
  when: (resource: KubeResource) => {
    // let's see if the resource refers to a pod in some fashion
    return resource.kind === 'Deployment' || (resource.status !== undefined && resource.status.podName !== undefined) // e.g. tekton TaskRun or PipelineRun
  },
  mode: (command: string, resource: Resource): UI.Mode => {
    debug('addPods', resource)
    try {
      return podsButton(command, resource)
    } catch (err) {
      debug('error rendering pods button')
      console.error(err)
    }
  }
}

/**
 * Render the tabular pods view
 *
 */
interface Parameters {
  command: string
  resource: Resource
}

export const renderAndViewPods = async (tab: UI.Tab, parameters: Parameters) => {
  const { command, resource } = parameters
  debug('renderAndViewPods', command, resource)

  const { selector } = resource.resource.spec

  const getPods = selector
    ? `kubectl get pods ${selectorToString(selector)} -n "${resource.resource.metadata.namespace}"`
    : `kubectl get pods ${resource.resource.status.podName} -n "${resource.resource.metadata.namespace}"`
  debug('getPods', getPods)

  const tableModel: Tables.Table = await REPL.qexec(getPods)

  const tableView = formatTable(tab, tableModel, {
    usePip: false,
    viewName,
    execOptions: { delegationOk: true }
  })
  return insertView(tab)(tableView)
}
