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

import Debug from 'debug'
import colors from 'colors/safe'
import { Arguments } from '@kui-shell/core'
import Checker, { CheckerArgs, CheckResult } from './Checker'

const debug = Debug('plugin-core-support/up')

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

  // e.g. "Cloud: something something" => "cyan(Cloud:) something something"
  return labelText.replace(/^([^:]+:)/, (_, p1) => colors.cyan(p1))
}

export default async function checkAndEmit<T extends CheckResult>(
  args: CheckerArgs,
  stdout: Arguments['execOptions']['stdout'],
  { check, label, optional }: Checker<T>
) {
  try {
    const checkResult = await check(args)

    const ok = typeof checkResult === 'string' || checkResult === true
    const okMessage = `${ok ? success() : failure(optional ? 'yellow' : 'red')}`

    return {
      ok,
      message: `${okMessage} ${formatLabel(label, checkResult)}`
    }
  } catch (err) {
    debug('Error in checker', label, err)
    return {
      ok: false,
      message: err.message
    }
  }
}
