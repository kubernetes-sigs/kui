/*
 * Copyright 2018 The Kubernetes Authors
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

import type { Arguments, Registrar } from '@kui-shell/core'

/** Expand env vars */
async function expand(expr: number | boolean | string, env = process.env): Promise<string> {
  const { expandHomeDir } = await import('@kui-shell/core/mdist/api/Util')

  return typeof expr !== 'string'
    ? expr.toString()
    : expr.replace(/\${?([^}/\s]+)}?/g, (_, p1) => expandHomeDir(typeof env[p1] !== 'undefined' ? env[p1] : _))
}

async function kuiecho(args: Arguments) {
  return (
    Promise.all(args.argvNoOptions.slice(1).map(_ => expand(_, args.execOptions.env))).then(_ => _.join(' ')) || true
  )
}

export async function echo(args: Arguments) {
  const { inBrowser, hasProxy } = await import('@kui-shell/core/mdist/api/Capabilities')
  if (inBrowser() && !hasProxy()) {
    return kuiecho(args)
  } else {
    const { doExecWithPty } = await import('@kui-shell/plugin-bash-like')
    return doExecWithPty(args)
  }
}

export default (registrar: Registrar) => {
  // For debugging the command line parser. This avoids the PTY.
  registrar.listen('/kuiecho', kuiecho)

  // and, in a browser deployment without a backing proxy (and hence
  // without PTY support), we should also register as a handler for
  // `echo`
  registrar.listen('/echo', echo)
}
