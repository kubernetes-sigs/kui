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

import type { Writable } from 'stream'
import type { Arguments, Table } from '@kui-shell/core'

import type { FStat } from '../lib/fstat'
import type { KuiGlobOptions, GlobStats } from '../lib/glob'

type DirEntry = GlobStats
export { DirEntry }

/**
 * A Virtual File System implements `ls`, `cp`, etc. Filesystem
 * operations against filepaths that match this `mountPath` as a
 * prefix will be delegated to this `VFS` impl.
 *
 */
export default interface VFS {
  /** Path to mount point */
  mountPath: string

  /** Is this a local mount? */
  isLocal: boolean

  /** Is this a virtual mount? i.e. one that works in a browser without server-side proxy support */
  isVirtual: boolean

  /** Any tags that the provider might want to associate with their VFS */
  tags?: string[]

  /** Directory listing */
  ls(
    opts: Pick<Arguments<KuiGlobOptions>, 'tab' | 'REPL' | 'parsedOptions'>,
    filepaths: string[]
  ): DirEntry[] | Promise<DirEntry[]>

  /** Insert filepath into directory */
  cp(
    opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>,
    srcFilepaths: string[],
    dstFilepath: string,
    srcIsSelf: boolean[],
    dstIsSelf: boolean,
    srcProvider: VFS[],
    dstProvider: VFS
  ): Promise<string | Table | true | (string | Table)[]>

  /** Remove filepath */
  rm(
    opts: Pick<Arguments, 'command' | 'tab' | 'REPL' | 'parsedOptions' | 'execOptions'>,
    filepath: string,
    recursive?: boolean
  ): Promise<string | boolean>

  /** Fetch contents */
  fstat(
    opts: Pick<Arguments, 'REPL' | 'parsedOptions'>,
    filepath: string,
    withData?: boolean,
    enoentOk?: boolean
  ): Promise<FStat>

  /** Fetch content slice */
  fslice(filename: string, offset: number, length: number): Promise<string>

  /** Pipe a content slice to the given `stream` */
  pipe?: (filename: string, offset: number, length: number, stream: Writable) => Promise<void>

  /** write data to file */
  fwrite(
    opts: Pick<Arguments, 'REPL'>,
    fullpath: string,
    data: string | Buffer,
    options?: { append?: boolean }
  ): Promise<void>

  /** Create a directory/bucket */
  mkdir(
    opts: Pick<Arguments, 'command' | 'REPL' | 'argvNoOptions' | 'parsedOptions' | 'execOptions'>,
    filepath: string
  ): Promise<void>

  /** remove a directory/bucket */
  rmdir(opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>, filepath: string): Promise<void>
}
