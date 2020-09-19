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

import { Registrar } from '@kui-shell/core'
import { VFS } from '@kui-shell/plugin-bash-like/fs'

import { responder } from '.'

export default function(registrar: Registrar) {
  registrar.listen(
    '/vfs-s3/cp',
    args => {
      const N = args.argvNoOptions.length
      return responder.cp(
        args,
        args.argvNoOptions.slice(2, N - 3),
        args.argvNoOptions[N - 3],
        args.argvNoOptions[N - 2].split(/,/).map(_ => _ === 'true'),
        args.argvNoOptions[N - 1] === 'true'
      )
    },
    {
      requiresLocal: true
    }
  )
  registrar.listen(
    '/vfs-s3/rm',
    async args => {
      await responder.rm(args, args.argvNoOptions[2], args.argvNoOptions[3] === 'true')
      return true
    },
    { requiresLocal: true }
  )
  registrar.listen(
    '/vfs-s3/rmdir',
    async args => {
      await responder.rmdir(args, args.argvNoOptions[2])
      return true
    },
    { requiresLocal: true }
  )
  registrar.listen(
    '/vfs-s3/mkdir',
    async args => {
      await responder.mkdir(args, args.argvNoOptions[2])
      return true
    },
    { requiresLocal: true }
  )
  registrar.listen(
    '/vfs-s3/grep',
    async (args: Parameters<VFS['grep']>[0]) => {
      await responder.grep(args, args.argvNoOptions[2], args.argvNoOptions.slice(3))
      return true
    },
    { requiresLocal: true }
  )

  registrar.listen(
    '/vfs-s3/gzip',
    async (args: Parameters<VFS['gzip']>[0]) => {
      await responder.gunzip(args, args.argvNoOptions.slice(1))
      return true
    },
    { requiresLocal: true }
  )

  registrar.listen(
    '/vfs-s3/gunzip',
    async (args: Parameters<VFS['gunzip']>[0]) => {
      await responder.gunzip(args, args.argvNoOptions.slice(1))
      return true
    },
    { requiresLocal: true }
  )
}
