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

import { ITab } from '@kui-shell/core/webapp/cli'
import { ISidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { rexec as $ } from '@kui-shell/core/core/repl'
import { Row, Table } from '@kui-shell/core/webapp/models/table'
import { cssForValue } from '@kui-shell/core/webapp/util/ascii-to-table'

import { IResponseObject } from './flow'
import { IPipelineRun, ITaskRun } from '../resource'

import { IPod } from '@kui-shell/plugin-k8s/lib/model/resource'

/**
 * The sidecar mode for the tekton logs of a PipelineRun
 *
 */
const mode: ISidecarMode = {
  mode: 'Logs',
  direct: async (tab: ITab, _: IResponseObject) => {
    const run = _.resource as IPipelineRun

    const [ taskRuns, pods ]: [ ITaskRun[], IPod[] ] = await Promise.all([
      $(`kubectl get taskrun -l tekton.dev/pipelineRun=${run.metadata.name}`),
      $(`kubectl get pods -n ${run.metadata.namespace} -l tekton.dev/pipelineRun=${run.metadata.name}`)
    ])

    const containers: Row[] = pods.flatMap(pod => {
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
