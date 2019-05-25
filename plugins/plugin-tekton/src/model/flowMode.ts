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

import { ISidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { rexec as $ } from '@kui-shell/core/core/repl'

import { IKubeResource } from '@kui-shell/plugin-k8s/lib/model/resource'

interface IResponseObject {
  isFromFlowCommand?: boolean
  resource: IKubeResource
}

/**
 * The sidecar mode for the tekton flow visualization
 *
 */
const flowMode: ISidecarMode = {
  mode: 'flow',
  direct: async (_: IResponseObject) => {
    if (_.isFromFlowCommand) {
      // then _ is already the response we need
      return _
    } else {
      const resource = _.resource
      const { respondWith } = await import('../lib/tekton2graph')
      if (resource.kind === 'Pipeline') {
        // fetch any accompanying Tasks
        const tasks: IKubeResource[] = await $('kubectl get Task.tekton.dev')
        return respondWith([resource].concat(tasks))
      } else {
        return respondWith([resource])
      }
    }
  },
  defaultMode: true,
  leaveBottomStripeAlone: true
}

export default flowMode
