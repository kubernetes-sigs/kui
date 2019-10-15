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
import { Table } from '@kui-shell/core/api/table-models'

import { selectorToString } from '../../util/selectors'
import { Resource, KubeResource } from '../../model/resource'

const debug = Debug('k8s/view/modes/pods')

/**
 * Return a sidecar mode button model that shows a pods table for the
 * given resource
 *
 */
const podsButton = (command: string, resource: Resource, overrides?): Mode =>
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
export const podMode: ModeRegistration<KubeResource> = {
  when: (resource: KubeResource) => {
    // let's see if the resource refers to a pod in some fashion
    return resource.kind === 'Deployment' || (resource.status !== undefined && resource.status.podName !== undefined) // e.g. tekton TaskRun or PipelineRun
  },
  mode: (command: string, resource: Resource): Mode => {
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

export const renderAndViewPods = async (tab: Tab, parameters: Parameters): Promise<Table> => {
  const { command, resource } = parameters
  debug('renderAndViewPods', command, resource)

  const { selector } = resource.resource.spec

  const getPods = selector
    ? `kubectl get pods ${selectorToString(selector)} -n "${resource.resource.metadata.namespace}"`
    : `kubectl get pods ${resource.resource.status.podName} -n "${resource.resource.metadata.namespace}"`
  debug('getPods', getPods)

  const tableModel = tab.REPL.qexec<Table>(getPods)
  return tableModel
}
