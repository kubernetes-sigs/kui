/*
 * Copyright 2020 The Kubernetes Authors
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

import { Registrar, isTable, Util } from '@kui-shell/core'

import { doGet, getFlags } from '../get'
import { capitalize } from '../../../lib/view/modes/table-to-map'
import { formatOf, watchRequestFrom, withKubeconfigFrom } from '../options'

const defaultLimit = 200

/**
 * Expound on the variant ways to express the given kind. For example,
 * singular versus plural, with or without the api group, etc.
 *
 */
function variantsOf(kind: string, version: string, group: string): string[] {
  return Util.flatten(
    Util.flatten([kind, `${kind}s`].map(kind => [kind, capitalize(kind)])).map(kind => [
      kind,
      `${kind}.${group}`,
      `${kind}.${version}.${group}`
    ])
  )
}

export default function(registrar: Registrar) {
  ;['kubectl', 'k'].forEach(kubectl => {
    const standardGet = doGet(kubectl)

    variantsOf('job', 'v1', 'batch').forEach(job => {
      registrar.listen(
        `/${kubectl}/get/${job}`,
        async args => {
          if (formatOf(args)) {
            // user asked for a specific output format, use the standard get handler
            return standardGet(args)
          }

          const listOfJobs = args.argvNoOptions.slice(args.argvNoOptions.indexOf(job) + 1)
          const labelSelector = listOfJobs.length === 0 ? 'job-name' : `'job-name in (${listOfJobs.join(',')})'`

          // 1) inherit kubeconfig from given args
          // 2) inherit watch request from given args
          // 3) sort by startTime
          // 4) use custom columns: JOB, PODNAME, STATUS, pod start time, container start time, pod end time
          const cmdline = withKubeconfigFrom(
            args,
            `kubectl get pod -l ${labelSelector} --sort-by={.status.startTime} -o custom-columns=JOB:.metadata.ownerReferences[0].name,NAME:.metadata.name,STATUS:.status.phase,START:.status.startTime,START2:.status.containerStatuses[0].state.terminated.startedAt,END:.status.containerStatuses[0].state.terminated.finishedAt ${watchRequestFrom(
              args
            )} ${args.parsedOptions.limit ? `--limit ${args.parsedOptions.limit}` : `--limit ${defaultLimit}`}`
          )

          const table = await args.REPL.qexec(cmdline, undefined, undefined, args.execOptions)

          if (isTable(table)) {
            // improve tables for Jobs
            table.title = 'Job'
            return table
          } else {
            return table
          }
        },
        getFlags
      )
    })
  })
}
