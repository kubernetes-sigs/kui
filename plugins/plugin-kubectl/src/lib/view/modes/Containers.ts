/*
 * Copyright 2023 The Kubernetes Authors
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

import type { ModeRegistration, Tab } from '@kui-shell/core'
import { KubeResource, KubeContainerStatus, Pod, isPod } from '@kui-shell/plugin-kubectl-core'

async function content(_: Tab, resource: Pod) {
  // this module is expensive to load, so we defer that expense
  const { dump } = await import('js-yaml')

  const { containers = [] } = resource.spec
  const { containerStatuses = [] } = resource.status

  // helps with unified just below
  const statuses = containerStatuses.reduce((M, _) => {
    const status = Object.assign({}, _)
    delete status.name // no need to say this twice, once for spec, once for status
    M[_.name] = status
    return M
  }, {} as Record<string, KubeContainerStatus>)

  // unify spec and status
  const unified = containers.reduce((M, _) => {
    const combo = Object.assign(
      {
        args: _.args,
        resources: _.resources,
        status: statuses[_.name] || 'missing status'
      },
      _
    )
    delete combo.name
    M[_.name] = combo
    return M
  }, {})

  return {
    contentType: 'yaml',
    content: dump(unified)
  }
}

function hasContainers(resource: KubeResource): resource is Pod {
  return isPod(resource) && resource.spec.containers && resource.spec.containers.length > 0
}

/**
 * The Summary mode applies to all KubeResources, and uses
 * `renderContent` to render the view.
 *
 */
const logsReg: ModeRegistration<Pod> = {
  when: hasContainers,
  mode: {
    mode: 'containers',
    label: 'Containers',
    content
  }
}

export default logsReg
