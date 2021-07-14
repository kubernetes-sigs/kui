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
import { Observable, Observer } from 'rxjs'
import { Arguments, Streamable } from '@kui-shell/core'

import Group from './Group'
import Options from './options'
import checkers from './registrar'
import Checker, { CheckerArgs, CheckResult, Stdout } from './Checker'

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

async function toStatus({ label }: Checker, checkResultP: ReturnType<Checker['check']>): Promise<Status> {
  const checkResult = await checkResultP
  return {
    ok: typeof checkResult === 'string' || checkResult === true,
    message: formatLabel(label, checkResult)
  }
}

export default async function doCheck<T extends CheckResult>(
  args: CheckerArgs,
  obs: Observer<string>,
  checker: Checker<T>,
  stdout: Stdout // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<Status> {
  return toStatus(checker, checker.check(args, obs))
}

function toStream(stdout: Stdout): Arguments['execOptions']['onInit'] {
  return () => (str: Streamable) => {
    stdout.write(colors.yellow(str.toString()))
  }
}

/** Fix prerequisites for a given Checker */
async function doFix(args: Arguments<Options>, obs: Observer<string>, checker: Checker, stdout: Stdout) {
  const { check, fix, needsCloudLogin } = checker
  const checkResult = await Promise.resolve(check(args, obs)).catch(() => undefined)

  if (!checkResult && fix) {
    if (args.parsedOptions.login !== false || !needsCloudLogin) {
      if (typeof fix === 'string') {
        await args.REPL.qexec(fix)
      } else {
        await fix(args, toStream(stdout))
      }
    }

    // re-check
    return doCheck(args, obs, checker, stdout)
  } else {
    return toStatus(checker, checkResult)
  }
}

function listrTaskForChecker(
  args: Arguments<Options>,
  stdout: Arguments['execOptions']['stdout'],
  fixErrors: boolean,
  gidx: number
) {
  return (_: Checker, tidx: number) => {
    const idx = gidx + tidx
    const title = formatLabel(_.label, undefined)

    return {
      title,
      options: { persistentOutput: true },
      task: (ctx, task) =>
        new Observable(obs => {
          ;(fixErrors ? doFix : doCheck)(args, obs, _, task.stdout())
            .then(status => {
              ctx[idx] = status

              if (!status.ok) {
                obs.error(new Error(status.message))
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
  fixErrors = false,
  concurrent = !fixErrors,
  exitOnError = fixErrors
): Promise<Pick<Status, 'ok'>[]> {
  const options = {
    concurrent,
    exitOnError,
    rendererOptions: { collapse: false, collapseErrors: false },
    bottomBar: fixErrors ? Infinity : false
  }

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
            .map(listrTaskForChecker(args, stdout, fixErrors, gidx * nGroups)),
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
