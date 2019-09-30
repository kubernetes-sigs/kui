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

import { REPL, Tables, UI, Util } from '@kui-shell/core'
import { cssForValue } from '@kui-shell/core/webapp/util/ascii-to-table'

import { Pod } from '@kui-shell/plugin-k8s'

import { ResponseObject } from './flow'
import { PipelineRun, TaskRun } from '../resource'

/**
 * The sidecar mode for the tekton logs of a PipelineRun
 *
 */
const mode: UI.Mode = {
  mode: 'Logs',
  direct: async (tab: UI.Tab, _: ResponseObject) => {
    const run = _.resource as PipelineRun

    const [taskRuns, pods] = await Promise.all([
      REPL.rexec<TaskRun[]>(`kubectl get taskrun -l tekton.dev/pipelineRun=${run.metadata.name}`),
      REPL.rexec<Pod[]>(`kubectl get pods -n ${run.metadata.namespace} -l tekton.dev/pipelineRun=${run.metadata.name}`)
    ])

    const containers: Tables.Row[] = Util.flatten(
      pods.map(pod => {
        const taskName = pod.metadata.labels['tekton.dev/task']
        const taskRun = taskRuns.find(_ => _.metadata.labels['tekton.dev/task'] === taskName)

        return pod.spec.containers.map((container, idx) => {
          const { containerID } = pod.status.containerStatuses[idx]
          const stepRun = taskRun.status.steps.find(_ => _.terminated.containerID === containerID)
          const status = stepRun && stepRun.terminated.reason

          return {
            name: taskName,
            css: 'slightly-deemphasize',
            onclick: `kubectl get task ${taskName} -o yaml`,
            attributes: [
              {
                key: 'STEP',
                value: container.name
              },
              {
                key: 'STATUS',
                value: status,
                tag: 'badge',
                css: cssForValue[status]
              },
              {
                key: 'ACTIONS',
                value: 'View Logs',
                outerCSS: 'clickable clickable-color',
                onclick: `kubectl logs ${pod.metadata.name} ${container.name} -n ${pod.metadata.namespace}`
              }
            ]
          }
        })
      })
    )

    const table: Tables.Table = {
      title: 'Container Logs',
      body: containers,
      header: {
        name: 'TASK',
        attributes: [
          {
            key: 'STEP',
            value: 'STEP'
          },
          {
            key: 'STATUS',
            value: 'STATUS'
          },
          {
            key: 'ACTIONS',
            value: 'ACTIONS'
          }
        ]
      }
    }

    return table
  }
}

export default mode
