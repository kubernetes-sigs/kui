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

import type { Arguments, ParsedOptions } from '@kui-shell/core'

interface Options extends ParsedOptions {
  N: number
}

export default async function doPar(args: Arguments<Options>) {
  const { N = 10 } = args.parsedOptions

  const rest = args.command.replace(/-N\s+\d+/g, '')
  const cmdline = rest.substring(rest.indexOf('dopar ') + 'dopar '.length)

  await Promise.all(
    Array(N)
      .fill(0)
      .map(() => args.REPL.qexec(cmdline))
  )
  return true
}
