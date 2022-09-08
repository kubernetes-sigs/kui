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

import { CommandHandler, KResponse, ParsedOptions, Registrar } from '@kui-shell/core'

import { fstatImpl, fwriteImpl, lsImpl } from './server-side'
import { cp, rm, mkdir, rmdir } from '../delegates'

/**
 * Generic registration for commands with boolean flags.
 *
 * @param boolean: 'abc' is treated as meaning all of -a, -b, and -c
 * are boolean flags
 *
 */
function withBooleanFlags<Handler extends CommandHandler<KResponse, ParsedOptions>>(
  this: Registrar,
  command: string,
  handler: Handler,
  booleans: string | string[],
  booleans2?: string[]
) {
  this.listen(`/${command}`, handler, {
    flags: {
      boolean: (typeof booleans === 'string' ? booleans.split('') : booleans).concat(booleans2 || [])
    }
  })
}

export default function (registrar: Registrar) {
  const on = withBooleanFlags.bind(registrar)

  on(
    'vfs/ls',
    async args => {
      try {
        return await lsImpl(args)
      } catch (err) {
        // no virtual (client-only) mount found; try contacting the
        // proxy server
        return args.REPL.qexec(args.command.replace('vfs ls', 'vfs _ls'))
      }
    },
    'AadcClhtrsS'
  )

  on(
    'vfs/fstat',
    async args => {
      try {
        return await fstatImpl(args)
      } catch (err) {
        // no virtual (client-only) mount found; try contacting the
        // proxy server
        return args.REPL.qexec(args.command.replace('vfs fstat', 'vfs _fstat'))
      }
    },
    ['with-data', 'enoent-ok']
  )

  on(
    'vfs/fwrite',
    async args => {
      try {
        return await fwriteImpl(args)
      } catch (err) {
        // no virtual (client-only) mount found; try contacting the
        // proxy server
        return args.REPL.qexec(args.command.replace('vfs fwrite', 'vfs _fwrite'), undefined, undefined, {
          data: args.execOptions.data
        })
      }
    },
    'data'
  )

  on(
    'rm',
    args =>
      rm(args, args.argvNoOptions[1], !!(args.parsedOptions.r || args.parsedOptions.R)).then(response =>
        typeof response === 'string' ? response : true
      ),
    'frRidPvw'
  )

  on('mkdir', args => mkdir(args, args.argvNoOptions[1]).then(() => true), 'pv')
  on('rmdir', args => rmdir(args, args.argvNoOptions[1]).then(() => true), 'p')

  on(
    'cp',
    args => {
      const N = args.argvNoOptions.length
      const srcs: string[] = args.argvNoOptions.slice(1, N - 1)
      const dst = args.argvNoOptions[N - 1]
      return cp(args, srcs, dst)
    },
    'acfHiLnPpRvXs'
  )
}
