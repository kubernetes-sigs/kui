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

import { Tab } from '@kui-shell/core'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'

import { KubeResource } from '@kui-shell/plugin-k8s'

import flowView from '../../view/flow'
import { getPipelineFromRef, getTasks } from '../fetch'
import { isPipelineRun, isPipeline } from '../resource'

export interface ResponseObject {
  isFromFlowCommand?: boolean
  model: KubeResource[]
  resource: KubeResource
}

/**
 * The sidecar mode for the tekton flow visualization
 *
 */
const flowMode: SidecarMode = {
  mode: 'flow',
  direct: async (tab: Tab, _: ResponseObject) => {
    if (_.isFromFlowCommand) {
      // then _ is already the response we need
      return _
    } else {
      const resource = _.resource
      if (isPipelineRun(resource)) {
        const [pipeline, tasks] = await Promise.all([getPipelineFromRef(resource), getTasks()])
        return flowView(tab, [pipeline as KubeResource].concat(tasks), resource)
      } else if (isPipeline(resource)) {
        // fetch any accompanying Tasks
        const tasks = await getTasks()
        return flowView(tab, [resource as KubeResource].concat(tasks))
      } else {
        return flowView(tab, [resource])
      }
    }
  },
  defaultMode: true,
  leaveBottomStripeAlone: true
}

export default flowMode
