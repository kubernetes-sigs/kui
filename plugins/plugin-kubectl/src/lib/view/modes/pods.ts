/*
 * Copyright 2019 The Kubernetes Authors
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

import { Arguments, Tab, ModeRegistration, Table } from '@kui-shell/core'

import kubectl from '../../../controller/cli'
import { getCommandFromArgs } from '../../util/util'
import { selectorToString } from '../../util/selectors'
import { KubeOptions } from '../../../controller/kubectl/options'
import { KubeResource, isKubeResource, isDeployment, isReplicaSet } from '../../model/resource'

export function getPodsCommand(resource: KubeResource, args?: Pick<Arguments, 'argvNoOptions'>) {
  const { selector } = resource.spec

  return selector
    ? `${!args ? kubectl : getCommandFromArgs(args)} get pods ${selectorToString(selector)} -n "${
        resource.metadata.namespace
      }"`
    : `${!args ? kubectl : getCommandFromArgs(args)} get pods ${resource.status.podName} -n "${
        resource.metadata.namespace
      }"`
}

/**
 * Render the tabular pods view
 *
 */
async function renderPods(tab: Tab, resource: KubeResource, args: Arguments<KubeOptions>): Promise<Table> {
  const tableModel = tab.REPL.qexec<Table>(getPodsCommand(resource, args))
  return tableModel
}

/**
 * Resource filter: if the resource refers to a pod in some fashion
 *
 */
function hasPods(resource: KubeResource) {
  return (
    isKubeResource(resource) &&
    (isDeployment(resource) ||
      isReplicaSet(resource) ||
      (resource.status !== undefined && resource.status.podName !== undefined))
  )
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
