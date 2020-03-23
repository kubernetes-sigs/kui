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

import { Tab, ModeRegistration, Table } from '@kui-shell/core'

import { selectorToString } from '../../util/selectors'
import { KubeResource } from '../../model/resource'
import { getCommandFromArgs } from '../../util/util'

/**
 * Render the tabular pods view
 *
 */
async function renderPods(tab: Tab, resource: KubeResource, args): Promise<Table> {
  const { selector } = resource.spec

  const getPods = selector
    ? `${getCommandFromArgs(args)} get pods ${selectorToString(selector)} -n "${resource.metadata.namespace}"`
    : `${getCommandFromArgs(args)} get pods ${resource.status.podName} -n "${resource.metadata.namespace}"`

  const tableModel = tab.REPL.qexec<Table>(getPods)
  return tableModel
}

/**
 * Resource filter: if the resource refers to a pod in some fashion
 *
 */
function hasPods(resource: KubeResource) {
  return resource.kind === 'Deployment' || (resource.status !== undefined && resource.status.podName !== undefined)
}

/**
 * Add a Pods mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const podMode: ModeRegistration<KubeResource> = {
  when: hasPods,
  mode: {
    mode: 'pods',
    label: 'Pods',
    content: renderPods
  }
}

export default podMode
