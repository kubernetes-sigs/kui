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

import type { Registrar } from '@kui-shell/core'

export default function (registrar: Registrar) {
  registrar.listen(
    '/vfs-s3/cp',
    async args => {
      const N = args.argvNoOptions.length

      const { responderFor, vfsFor } = await import('../responders')

      return responderFor(args).cp(
        args,
        args.argvNoOptions.slice(3, N - 5),
        args.argvNoOptions[N - 5],
        args.argvNoOptions[N - 4].split(/,/).map(_ => _ === 'true'),
        args.argvNoOptions[N - 3] === 'true',
        args.argvNoOptions[N - 2].split(/,/).map(vfsFor),
        vfsFor(args.argvNoOptions[N - 1])
      )
    },
    {
      requiresLocal: true
    }
  )
  registrar.listen(
    '/vfs-s3/rm',
    args =>
      import('../responders').then(_ =>
        _.responderFor(args).rm(args, args.argvNoOptions[3], args.argvNoOptions[4] === 'true')
      ),
    { requiresLocal: true }
  )
  registrar.listen(
    '/vfs-s3/rmdir',
    async args => {
      await import('../responders').then(_ => _.responderFor(args).rmdir(args, args.argvNoOptions[3]))
      return true
    },
    { requiresLocal: true }
  )
  registrar.listen(
    '/vfs-s3/fwrite',
    async args => {
      await import('../responders').then(_ =>
        _.responderFor(args).fwrite(args, args.argvNoOptions[3], args.execOptions.data as string | Buffer)
      )
      return true
    },
    { requiresLocal: true }
  )
  registrar.listen(
    '/vfs-s3/mkdir',
    async args => {
      await import('../responders').then(_ => _.responderFor(args).mkdir(args, args.argvNoOptions[3]))
      return true
    },
    { requiresLocal: true }
  )
}
