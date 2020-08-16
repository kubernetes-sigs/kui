/*
 * Copyright 2020 IBM Corporation
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

import { Arguments, isTable } from '@kui-shell/core'
import { doGet, KubeOptions, isTableRequest, computeDurations } from '@kui-shell/plugin-kubectl'

import JobRun from '../../lib/kinds/JobRun'

const get = doGet('kubectl')

/**
 * This serves only to add a `Duration` column to table requests for
 * Jobs. If it is added to the base CRD, we can eliminate this code.
 *
 */
export default async function KubectlGetJob(args: Arguments<KubeOptions>) {
  if (isTableRequest(args)) {
    // get-watch uses the stripped option; we need to unstrip it :(
    args.command = args.command.replace(/([^\\])\\([^\\])/g, '$1\\\\$2')

    const table = await args.REPL.qexec(
      `ibmcloud ce kubectl get pod --sort-by={.status.startTime} -o custom-columns=JOB:.metadata.labels.jobrun,POD:.metadata.name,STATUS:.status.phase,START:.status.startTime,START2:.status.containerStatuses[0].state.terminated.startedAt,END:.status.containerStatuses[0].state.terminated.finishedAt ${
        args.parsedOptions.limit ? `--limit ${args.parsedOptions.limit}` : ''
      }`,
      undefined,
      undefined,
      args.execOptions
    )

    if (isTable(table)) {
      // in case we want to limit the numbre of jobs displayed
      /* const jobIndices = table.body.reduce((indices, job, idx) => {
        if (idx === 0 || table.body[idx - 1].name !== job.name) {
          indices.push(idx)
        }
        return indices
        }, [] as number[]) */
      table.title = 'Job'
      const hide = [2, 3]
      const hideWithSidecar = [1]
      hide.forEach(idx => (table.header.attributes[idx].outerCSS = 'hide'))
      hideWithSidecar.forEach(idx => (table.header.attributes[idx].outerCSS = 'hide-with-sidecar'))
      table.body.forEach(_ => {
        hide.forEach(idx => (_.attributes[idx].outerCSS = 'hide'))
        hideWithSidecar.forEach(idx => (_.attributes[idx].outerCSS = 'hide-with-sidecar'))
        _.onclick = `ibmcloud ce kubectl get pod ${_.attributes[0].value} -o yaml`
      })
    }
    return computeDurations(table)
  } else {
    const job = (await get(args)) as JobRun
    job.spec._podName = `${job.metadata.name}-0-0` // TODO
    return job
  }
}
