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

import { KubeResource, KubeStatusCondition, KubeStatus } from '@kui-shell/plugin-kubectl'

/** this is the api version matcher; TODO refactor */
const tektonAPI = /tekton.dev/

export type TaskName = string

/**
 * Meet point for all top-level tekton-oriented kubernetes resources
 *
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TektonKubeResource extends KubeResource {
  // intentionally empty
}

export interface TaskRun extends KubeResource {
  pipelineTaskName: string
  status: KubeStatus & {
    podName: string
    startTime: string
    completionTime?: string
    conditions: KubeStatusCondition[]
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

export interface TaskRuns {
  [key: string]: TaskRun
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

interface Resource {
  name: string
  type: string
  targetPath?: string
}

export interface Task extends TektonKubeResource {
  kind: 'Task'
  visitedIdx?: number
  spec: {
    inputs: {
      resources: Resource[]
      params: { name: string; description: string; default: string }[]
    }
    steps: Step[]
  }
}

export function isTask(resource: KubeResource): resource is Task {
  return resource && tektonAPI.test(resource.apiVersion) && resource.kind === 'Task'
}

export interface Pipeline extends TektonKubeResource {
  kind: 'Pipeline'
  spec: {
    resources?: Resource[]
    tasks: TaskRef[]
  }
}
export function isPipeline(resource: KubeResource): resource is Pipeline {
  const run = resource as Pipeline
  return (
    run &&
    tektonAPI.test(run.apiVersion) &&
    run.spec !== undefined &&
    run.kind === 'Pipeline' &&
    run.spec.tasks !== undefined
  )
}

export interface PipelineRun extends TektonKubeResource {
  kind: 'PipelineRun'
  spec: {
    serviceAccount: string
    params: { name: string; value: string }[]
    resources: { name: string; resourceRef: { name: string } }[]
    pipelineRef: { name: string }
    trigger: { type: 'manual' }
  }
  status: KubeStatus & {
    taskRuns: TaskRuns
  }
}
export function isPipelineRun(resource: KubeResource): resource is PipelineRun {
  const run = resource as PipelineRun

  return (
    tektonAPI.test(run.apiVersion) &&
    run.spec !== undefined &&
    run.kind === 'PipelineRun' &&
    run.spec.serviceAccount !== undefined &&
    run.spec.pipelineRef !== undefined
  )
}
