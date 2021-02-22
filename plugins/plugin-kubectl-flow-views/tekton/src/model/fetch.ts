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

import { CodedError, Tab } from '@kui-shell/core'
import { KubeItems } from '@kui-shell/plugin-kubectl'
import { PipelineRun, Pipeline, Task } from './resource'

/**
 * Get the Pipeline referenced by a PipelineRun
 *
 */
export function getPipelineFromRef(tab: Tab, run: PipelineRun): Promise<Pipeline> {
  // want: Pipeline.tekton.dev rather than Pipeline, but that is much
  // slower for some reason
  return tab.REPL.qexec<Pipeline>(`kubectl get Pipeline ${run.spec.pipelineRef.name} -o json`).catch(
    (err: CodedError) => {
      if (err.code === 404) {
        return undefined
      } else {
        throw err
      }
    }
  )
}

/**
 * Retrieve all Tasks
 *
 */
export async function getTasks(tab: Tab): Promise<Task[]> {
  // want Task.tekton.dev rather than Tas, but that is much slower for
  // some reason
  const list = await tab.REPL.qexec<KubeItems<Task>>('kubectl get Task -o json')
  return list.items
}
