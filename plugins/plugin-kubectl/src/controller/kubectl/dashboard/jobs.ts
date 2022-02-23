/*
 * Copyright 2022 IBM Corporation
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

import Debug from 'debug'
import { KResponse, Registrar, Table } from '@kui-shell/core'

import { ResourceRef } from '../fqn'
import variantsOf from '../../variantsOf'
import KubeOptions, { withKubeconfigFrom } from '../options'

const kind = 'job'
const kindReg = new RegExp(kind, 'i')

const version = 'v1'
const versionReg = new RegExp(version, 'i')

const group = 'batch'
const groupReg = new RegExp(group, 'i')

const debug = Debug('plugin-kubectl/controller/kubectl/dashboard/jobs')

export function isDashboardableJob(ref: ResourceRef) {
  return kindReg.test(ref.kind) && versionReg.test(ref.version) && groupReg.test(ref.group)
}

export default function registerJobsDashboardControllers(registrar: Registrar, kubectl: string, db: string) {
  variantsOf('job', version, group).forEach(jobs => {
    registrar.listen<KResponse, KubeOptions>(
      `/${kubectl}/${db}/${jobs}`,
      async args => {
        const { argvNoOptions, REPL, parsedOptions } = args

        const dashW = parsedOptions.watch ? '-w' : ''
        const labelSelectors = Array.isArray(parsedOptions.selector)
          ? parsedOptions.selector
          : (parsedOptions.selector || '').split(/,/).filter(Boolean)

        const runs = argvNoOptions.slice(argvNoOptions.indexOf(jobs) + 1)

        const whichRuns = parsedOptions.all
          ? 'all'
          : typeof parsedOptions.limit === 'number'
          ? parsedOptions.limit
          : runs.length === 0 || parsedOptions.last
          ? 'last'
          : runs

        if (whichRuns === 'last' || typeof whichRuns === 'number') {
          // we were asked to show the pods for the last (or last N) super
          // run. First, issue a query to get us the name of the last
          // super run.
          if (labelSelectors.length === 0) {
            labelSelectors.push('job-name')
          }
          const cmdline = withKubeconfigFrom(
            args,
            `kubectl get pods -l ${labelSelectors} --sort-by=.metadata.creationTimestamp`
          )
          debug('list cmdline', cmdline)
          const table = await REPL.qexec<Table>(cmdline)

          if (table.body.length === 0) {
            // oops, no recent super runs; TODO this won't be watchable
            return { body: [] }
          } else {
            const N = parsedOptions.runs === 'last' ? 1 : parsedOptions.runs
            const lastNSuperRuns = table.body.slice(-N).map(_ => _.object.metadata.labels['job-name'])

            if (N === 1) {
              labelSelectors.push(`job-name=${lastNSuperRuns[0]}`)
            } else {
              labelSelectors.push(`job-name in (${lastNSuperRuns.join(',')})`)
            }
          }
        } else if (Array.isArray(whichRuns) && whichRuns.length > 0) {
          // fetch a specified list of jobs
          labelSelectors.push(
            'job-name' + (whichRuns.length === 1 ? `=${whichRuns[0]}` : `in (${whichRuns.join(',')})`)
          )
        } else if (labelSelectors.length === 0) {
          labelSelectors.push('job-name')
        }

        const dashL = `-l '${labelSelectors.join(',')}'`

        // const cmdline = `kubectl get pods ${dashL} ${dashW} --sort-by=.metadata.creationTimestamp -o custom-columns=JOB:.metadata.labels.job-name,NAME:.metadata.name,STATUS:.status.phase,START:.status.startTime,START2:.status.containerStatuses[0].state.terminated.startedAt,END:.status.containerStatuses[0].state.terminated.finishedAt,SUPERSTART:.metadata.annotations['supe.run/startTime']`

        const cmdline = withKubeconfigFrom(
          args,
          `kubectl get pods ${dashL} ${dashW} ` +
            ' --sort-by=.metadata.creationTimestamp' +
            ' -o custom-columns=' +
            'JOB:.metadata.labels.job-name' +
            ',NAME:.metadata.name' +
            ',STATUS:.status.phase' +
            // + `,START:.metadata.annotations['supe.run/startTime']`
            ',START:.metadata.creationTimestamp' +
            `,START2:.status.startTime` +
            ',START3:.status.containerStatuses[0].state.terminated.startedAt' +
            ',END:.status.containerStatuses[0].state.terminated.finishedAt'
        )
        debug('kubectl dashboard cmdline', cmdline)

        const table = await REPL.qexec<Table>(cmdline)

        table.colorBy = 'status'
        table.nFooterMessages = 2
        table.defaultPresentation = whichRuns !== 'all' ? 'sequence-diagram' : 'grid'
        table.title = whichRuns === 'last' ? 'Latest Run' : 'Recent Runs'

        return table
      },
      { flags: { alias: { watch: ['w'], selector: ['l'] } } }
    )
  })
}
