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

import { Arguments, KResponse, isTable } from '@kui-shell/core'
import { doGet, KubeOptions, isTableRequest, computeDurations } from '@kui-shell/plugin-kubectl'

import JobRun from '../../lib/kinds/JobRun'

const get = doGet('kubectl')

/** Status 0/1 -> Fail/Success */
function fixupStatus(response: KResponse) {
  if (isTable(response)) {
    const statusIdx = response.header.attributes.findIndex(_ => /STATUS/i.test(_.key))
    if (statusIdx >= 0) {
      response.body.forEach(_ => {
        const { value } = _.attributes[statusIdx]
        _.attributes[statusIdx].value = /^1|Success$/.test(value)
          ? 'Success'
          : /^<none>|Pending$/.test(value)
          ? 'Pending'
          : 'Fail'
      })
    }
  }

  return response
}

/**
 * This serves only to add a `Duration` column to table requests for
 * Jobs. If it is added to the base CRD, we can eliminate this code.
 *
 */
export default async function KubectlGetJob(args: Arguments<KubeOptions>) {
  if (isTableRequest(args)) {
    // get-watch uses the stripped option; we need to unstrip it :(
    args.command = args.command.replace(/([^\\])\\([^\\])/g, '$1\\\\$2')

    return fixupStatus(computeDurations(await get(args)))
  } else {
    const job = (await get(args)) as JobRun
    job.spec._podName = `${job.metadata.name}-0-0` // TODO
    return job
  }
}
