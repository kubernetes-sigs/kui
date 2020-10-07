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

import slash from 'slash'
import { isAbsolute, join } from 'path'
import { Arguments, ParsedOptions, REPL, Table, eventBus, getCurrentTab, inBrowser } from '@kui-shell/core'

import { FStat } from '../lib/fstat'
import { KuiGlobOptions, GlobStats } from '../lib/glob'

type DirEntry = GlobStats
export { DirEntry }

export interface ParallelismOptions extends ParsedOptions {
  /** Parallelism */
  P: number
}

/**
 * A Virtual File System implements `ls`, `cp`, etc. Filesystem
 * operations against filepaths that match this `mountPath` as a
 * prefix will be delegated to this `VFS` impl.
 *
 */
export interface VFS {
  /** Path to mount point */
  mountPath: string

  /** Is this a local mount? */
  isLocal: boolean

  /** Is this a virtual mount? i.e. one that works in a browser without server-side proxy support */
  isVirtual: boolean

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
    dstIsSelf: boolean
  ): Promise<string | true>

  /** Remove filepath */
  rm(
    opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>,
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

  /** Create a directory/bucket */
  mkdir(
    opts: Pick<Arguments, 'command' | 'REPL' | 'argvNoOptions' | 'parsedOptions' | 'execOptions'>,
    filepath: string
  ): Promise<void>

  /** remove a directory/bucket */
  rmdir(opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>, filepath: string): Promise<void>

  /** grep for file content */
  grep(opts: Arguments<ParallelismOptions>, pattern: string, filepaths: string[]): Promise<true | number | string[]>

  /** zip a set of files */
  gzip(opts: Arguments<ParallelismOptions>, filepaths: string[]): Promise<void | Table>

  /** unzip a set of files */
  gunzip(opts: Arguments<ParallelismOptions>, filepaths: string[]): Promise<void | Table>
}

/**
 * Current VFS mounts
 *
 */
const _currentMounts: VFS[] = []

/**
 * Establish a total ordering of mounts, based on depth in the
 * tree. Sibling order is arbitrary, at the moment.
 *
 */
function orient(A: VFS, B: VFS) {
  const a = A.mountPath.split(/\//).filter(_ => _)
  const b = B.mountPath.split(/\//).filter(_ => _)
  let lastCommonIdx = 0
  const N = Math.min(a.length, b.length)

  while (++lastCommonIdx < N) {
    if (a[lastCommonIdx] !== b[lastCommonIdx]) {
      break
    }
  }

  if (lastCommonIdx === 0 || a.length === b.length) {
    return 0
  } else if (lastCommonIdx === a.length) {
    return -1
  } else {
    return b.length - a.length
  }
}

/** Low-level mount */
function _mount(vfs: VFS) {
  _currentMounts.push(vfs)
  _currentMounts.sort(orient)
}

type VFSProducingFunction = (repl: REPL) => VFS | VFS[] | Promise<VFS | VFS[]>

/** Invoke the given VFS-producing function, and mount all of the resulting VFS's */
async function mountAll({ REPL }: Pick<Arguments, 'REPL'>, vfsFn: VFSProducingFunction) {
  const mounts = await vfsFn(REPL)
  const A = Array.isArray(mounts) ? mounts : [mounts]
  await Promise.all(A.map(_mount))
}

/**
 * Mount a VFS
 *
 */
export async function mount(vfs: VFS | VFSProducingFunction) {
  if (typeof vfs !== 'function') {
    _mount(vfs)
  } else {
    const tab = getCurrentTab()
    if (!tab) {
      eventBus.on('/tab/new', tab => mountAll(tab, vfs))
    } else {
      mountAll(tab, vfs)
    }
  }
}

/** @return current working directory */
function cwd() {
  return inBrowser() ? process.env.PWD || '/' : process.cwd()
}

/** @return the absolute path to `filepath` */
function absolute(filepath: string): string {
  return isAbsolute(filepath) ? filepath : join(cwd(), filepath)
}

/** Lookup compiatible mount */
export function findMount(filepath: string, checkClient = false): VFS {
  const isClient = inBrowser()
  filepath = absolute(filepath)
  return (
    _currentMounts.find(
      mount => filepath.startsWith(mount.mountPath) && (!checkClient || !isClient || mount.isVirtual)
    ) || _currentMounts.find(mount => mount.isLocal)
  ) // local fallback; see https://github.com/IBM/kui/issues/5898
}

/** Lookup compatible mounts */
export function multiFindMount(filepaths: string[], checkClient = false): { filepaths: string[]; mount: VFS }[] {
  if (filepaths.length === 0) {
    return multiFindMount([cwd()], checkClient)
  }

  return filepaths
    .map(filepath => ({
      filepaths: [slash(filepath)],
      mount: findMount(filepath, checkClient)
    }))
    .filter(_ => _.mount !== undefined)
    .reduce((mounts, mount) => {
      if (mounts.length === 0 || mounts[mounts.length - 1].mount.mountPath !== mount.mount.mountPath) {
        mounts.push(mount)
      } else {
        mounts[mounts.length - 1].filepaths.splice(mounts.length, 0, ...mount.filepaths)
      }
      return mounts
    }, [])
}

/**
 * Does the filepath specify a local file?
 *
 */
export function isLocal(filepath: string): boolean {
  const mount = findMount(filepath)
  return mount && mount.isLocal
}
