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

import { Row, Table, Mode, Tab, flatten, i18n } from '@kui-shell/core'
import { KubeItems, Pod } from '@kui-shell/plugin-kubectl'
import { PipelineRun, TaskRun } from '../resource'

const strings = i18n('plugin-kubectl', 'tekton')

/**
 * The sidecar mode for the tekton logs of a PipelineRun
 *
 */
const mode: Mode = {
  mode: 'Logs',
  label: strings('logs'),
  content: async (tab: Tab, run: PipelineRun) => {
    const [{ items: taskRuns }, { items: pods }] = await Promise.all([
      tab.REPL.qexec<KubeItems<TaskRun>>(`kubectl get taskrun -l tekton.dev/pipelineRun=${run.metadata.name} -o json`),
      tab.REPL.qexec<KubeItems<Pod>>(
        `kubectl get pods -n ${run.metadata.namespace} -l tekton.dev/pipelineRun=${run.metadata.name} -o json`
      )
    ])

    const containers: Row[] = flatten(
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
                tag: 'badge'
                // css: cssForValue[status]
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

    const table: Table = {
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
