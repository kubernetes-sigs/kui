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

import { IKubeResource, IKubeStatusCondition, IKubeStatus } from '@kui-shell/plugin-k8s/lib/model/resource'

/** this is the api version matcher; TODO refactor */
const tektonAPI = /tekton.dev/

export type TaskName = string

/**
 * Meet point for all top-level tekton-oriented kubernetes resources
 *
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITektonKubeResource extends IKubeResource {
  // intentionally empty
}

export interface ITaskRun {
  pipelineTaskName: string
  status: {
    podName: string
    startTime: string
    completionTime?: string
    conditions: IKubeStatusCondition[]
    steps: {
      name: string
      terminated?: {
        containerID: string
        exitCode: number
        startedAt: string
        finishedAt: string
        reason: string
      }
    }[]
  }
}

export interface ITaskRuns {
  [key: string]: ITaskRun
}

export interface Port {
  name: string
  resource: string
  from?: TaskName[]
}

export interface TaskRef {
  name: TaskName
  taskRef?: {
    name: TaskName
  }
  runAfter?: TaskName[]
  resources?: {
    inputs?: Port[]
    outputs?: Port[]
  }
}

export interface Step {
  name: string
  image: string
  command: string
  args: string[]
  visitedIdx?: number
}

interface IResource {
  name: string
  type: string
  targetPath?: string
}

export interface Task extends ITektonKubeResource {
  kind: 'Task'
  visitedIdx?: number
  spec: {
    inputs: {
      resources: IResource[]
      params: { name: string; description: string; default: string }[]
    }
    steps: Step[]
  }
}

export function isTask (resource: IKubeResource): resource is Task {
  return resource && resource.kind === 'Task'
}

export interface IPipeline extends ITektonKubeResource {
  kind: 'Pipeline'
  spec: {
    resources?: IResource[]
    tasks: TaskRef[]
  }
}
export function isPipeline (resource: IKubeResource): resource is IPipeline {
  const run = resource as IPipeline
  return run.spec !== undefined &&
    run.kind === 'Pipeline' &&
    run.spec.tasks !== undefined
}

export interface IPipelineRun extends ITektonKubeResource {
  kind: 'PipelineRun'
  spec: {
    serviceAccount: string
    params: { name: string; value: string }[]
    resources: { name: string; resourceRef: { name: string } }[]
    pipelineRef: { name: string }
    trigger: { type: 'manual' }
  }
  status: IKubeStatus & {
    taskRuns: ITaskRuns
  }
}
export function isPipelineRun (resource: IKubeResource): resource is IPipelineRun {
  const run = resource as IPipelineRun

  return tektonAPI.test(run.apiVersion) &&
    run.spec !== undefined &&
    run.kind === 'PipelineRun' &&
    run.spec.serviceAccount !== undefined &&
    run.spec.pipelineRef !== undefined
}
