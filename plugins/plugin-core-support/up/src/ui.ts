/*
 * Copyright 2021 The Kubernetes Authors
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

import { Listr } from 'listr2'
import colors from 'colors/safe'
import { Arguments } from '@kui-shell/core'
import { Observable, Observer } from 'rxjs'

import Group from './Group'
import Options from './options'
import checkers from './registrar'
import Checker, { CheckerArgs, CheckResult } from './Checker'

/** indicator of failure */
export function failure(color: 'red' | 'yellow' = 'red') {
  return `  ${colors[color]('\u2718')}`
}

/** indicator of success */
export function success() {
  return `  ${colors.green('\u2713')}`
}

export function formatLabel<T extends CheckResult>(label: Checker['label'], checkResult: T): string {
  const labelText = typeof label === 'string' ? label : label(checkResult)

  return labelText // .replace(/^([^:]+:)/, (_, p1) => colors.cyan(p1))
}

type Status = { ok: boolean; message: string }

export default async function checkAndEmit<T extends CheckResult>(
  args: CheckerArgs,
  obs: Observer<string>,
  stdout: Arguments['execOptions']['stdout'],
  { check, label }: Checker<T>
): Promise<Status> {
  const checkResult = await check(args, obs)

  return {
    ok: typeof checkResult === 'string' || checkResult === true,
    message: formatLabel(label, checkResult)
  }
}

function listrTaskForChecker(args: Arguments<Options>, stdout: Arguments['execOptions']['stdout'], gidx: number) {
  return (_: Checker, tidx: number) => {
    const idx = gidx + tidx
    const title = formatLabel(_.label, undefined)

    return {
      title,
      options: { persistentOutput: true },
      task: ctx =>
        new Observable(obs => {
          checkAndEmit(args, obs, stdout, _)
            .then(status => {
              ctx[idx] = status

              if (!status.ok) {
                obs.error(new Error('momo ' + status.message))
              } else if (status.message !== title) {
                obs.next(status.message)
                // task.output = status.message
              }
            })
            .catch(err => {
              ctx[idx] = { ok: false }
              obs.error(err)
            })
            .finally(() => obs.complete())
        })
    }
  }
}

export async function checkPrerequistes(
  args: Arguments<Options>,
  stdout: Arguments['execOptions']['stdout'],
  concurrent = true,
  exitOnError = false
): Promise<Pick<Status, 'ok'>[]> {
  const options = { concurrent, exitOnError, rendererOptions: { collapse: false, collapseErrors: false } }

  // top-level grouping
  const groups = Object.values(Group)
    .filter(_ => isNaN(Number(_)))
    .sort()
  const nGroups = groups.length

  const tasks = new Listr<Pick<Status, 'ok'>[]>(
    groups.map((group, gidx) => ({
      title: colors.cyan(group.toString()),
      task: (_, task) =>
        task.newListr(
          checkers(args)
            .filter(_ => _.group === Group[group])
            .sort((a, b) => formatLabel(a.label, undefined).localeCompare(formatLabel(b.label, undefined)))
            .map(listrTaskForChecker(args, stdout, gidx * nGroups)),
          options
        )
    })),
    options
  )

  const ctx = [] as Pick<Status, 'ok'>[]
  return tasks.run(ctx).catch(() => {
    return ctx
  })
}
