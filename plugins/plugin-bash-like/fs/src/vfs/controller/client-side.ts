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

import { Arguments, Registrar } from '@kui-shell/core'
import { cp, rm, mkdir, rmdir } from '../delegates'

/* function delegateToServer(this: Registrar, cmd: string) {
  this.listen(`/${cmd}`, args => args.REPL.qexec(`vfs ${args.command}`, undefined, undefined, args.execOptions))
  } */

function withFilepathArg(
  this: Registrar,
  command: string,
  handler: (args: Arguments, tgt: string, opt?: boolean) => void,
  boolean: string[],
  opt: (args: Arguments) => boolean
) {
  this.listen(
    `/${command}`,
    async args => {
      const idx = args.argvNoOptions.indexOf(command)
      const tgt = args.argvNoOptions[idx + 1]

      const params: (Arguments | string | boolean)[] = [args, tgt]
      if (opt) {
        params.push(opt(args))
      }

      // eslint-disable-next-line prefer-spread
      await handler.apply(undefined, params)
      return true
    },
    {
      flags: {
        boolean
      }
    }
  )
}

export default function(registrar: Registrar) {
  const on = withFilepathArg.bind(registrar)

  // on('cp')
  // on('rm')
  // on('mkdir')
  // on('rmdir')

  on(
    'rm',
    rm,
    ['f', 'r', 'R', 'i', 'd', 'P', 'v', 'W'],
    (args: Arguments) => args.parsedOptions.r || args.parsedOptions.R
  )
  on('mkdir', mkdir, ['p', 'v'])
  on('rmdir', rmdir, ['p'])

  registrar.listen(
    '/cp',
    args => {
      const idx = args.argvNoOptions.indexOf('cp')
      const src = args.argvNoOptions[idx + 1]
      const dst = args.argvNoOptions[idx + 2]
      return cp(args, src, dst)
    },
    {
      flags: {
        boolean: ['a', 'f', 'H', 'i', 'L', 'n', 'P', 'p', 'R', 'v', 'X', 'c']
      }
    }
  )
}
