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
const debug = Debug('tekton/model/modes/flow')

import { ISidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { rexec as $ } from '@kui-shell/core/core/repl'
import { ITab } from '@kui-shell/core/webapp/cli'
import { CodedError } from '@kui-shell/core/models/errors'

import { IKubeResource } from '@kui-shell/plugin-k8s/lib/model/resource'

import flowView from '../../view/flow'
import { isPipelineRun, IPipelineRun, IPipeline, isPipeline, Task } from '../resource'

export interface IResponseObject {
  isFromFlowCommand?: boolean
  model: IKubeResource[]
  resource: IKubeResource
}

/**
 * Get the Pipeline referenced by a PipelineRun
 *
 */
function getPipelineFromRef (run: IPipelineRun): Promise<IPipeline> {
  return $(`kubectl get Pipeline ${run.spec.pipelineRef.name}`) // want: Pipeline.tekton.dev, but that is much slower
    .catch((err: CodedError) => {
      if (err.code === 404) {
        return undefined
      } else {
        throw err
      }
    })
}

/**
 * Retrieve all Tasks
 *
 */
function getTasks (): Promise<Task[]> {
  return $('kubectl get Task') // want Task.tekton.dev, but that is much slower
}

/**
 * The sidecar mode for the tekton flow visualization
 *
 */
const flowMode: ISidecarMode = {
  mode: 'flow',
  direct: async (tab: ITab, _: IResponseObject) => {
    if (_.isFromFlowCommand) {
      // then _ is already the response we need
      return _
    } else {
      const resource = _.resource
      if (isPipelineRun(resource)) {
        const [ pipeline, tasks ] = await Promise.all([ getPipelineFromRef(resource), getTasks() ])
        return flowView(tab, [pipeline as IKubeResource].concat(tasks), resource)
      } else if (isPipeline(resource)) {
        // fetch any accompanying Tasks
        const tasks = await getTasks()
        return flowView(tab, [resource as IKubeResource].concat(tasks))
      } else {
        return flowView(tab, [resource])
      }
    }
  },
  defaultMode: true,
  leaveBottomStripeAlone: true
}

export default flowMode
