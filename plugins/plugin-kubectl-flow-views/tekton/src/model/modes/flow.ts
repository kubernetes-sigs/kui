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

import { ResourceWithMetadata, Mode, Tab, i18n } from '@kui-shell/core'
import { KubeResource, isKubeResource } from '@kui-shell/plugin-kubectl'

import flowView from '../../view/flow'
import { getPipelineFromRef, getTasks } from '../fetch'
import { isPipelineRun, isPipeline } from '../resource'

const strings = i18n('plugin-kubectl', 'tekton')

export type ResponseObject =
  | KubeResource
  | (ResourceWithMetadata & {
      isFromFlowCommand?: boolean
      model: KubeResource[]
      resource: KubeResource
    })

/**
 * The sidecar mode for the tekton flow visualization
 *
 */
const flowMode: Mode = {
  mode: 'flow',
  label: strings('flow'),
  content: async (tab: Tab, resource: ResponseObject) => {
    if (isKubeResource(resource)) {
      if (isPipelineRun(resource)) {
        const [pipeline, tasks] = await Promise.all([getPipelineFromRef(tab, resource), getTasks(tab)])
        return { content: (await flowView(tab, [pipeline as KubeResource].concat(tasks), resource)).content }
      } else if (isPipeline(resource)) {
        // fetch any accompanying Tasks
        const tasks = await getTasks(tab)
        const view = await flowView(tab, [resource as KubeResource].concat(tasks))
        return { content: view.content }
      } else {
        return { content: (await flowView(tab, [resource])).content }
      }
    } else {
      // then resource is already the response we need
      return { content: (resource.content as any) as HTMLElement }
    }
  },
  defaultMode: true
}

export default flowMode
