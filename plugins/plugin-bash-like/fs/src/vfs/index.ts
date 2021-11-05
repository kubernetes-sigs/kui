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

import slash from 'slash'
import { Arguments, Events, ParsedOptions, REPL, Table, getCurrentTab, inBrowser, Util } from '@kui-shell/core'

import { FStat } from '../lib/fstat'
import { KuiGlobOptions, GlobStats } from '../lib/glob'
import { pushInitDone, waitForMountsToFinish } from './initDone'

type DirEntry = GlobStats
export { DirEntry }

// const debug = Debug('plugin-bash-like/fs/vfs')

export interface ParallelismOptions extends ParsedOptions {
  /** Parallelism */
  P: number

  /** Memory per task */
  m: string
  memory: string
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
  const existingIdx = _currentMounts.findIndex(mount => mount.mountPath === vfs.mountPath)
  if (existingIdx >= 0) {
    // replace existing mount
    _currentMounts.splice(existingIdx, 1, vfs)
  } else {
    // add new mount
    _currentMounts.push(vfs)
    _currentMounts.sort(orient)
  }
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
export function mount(vfs: VFS | VFSProducingFunction, placeholderMountPath?: string): void {
  if (typeof vfs !== 'function') {
    _mount(vfs)
  } else {
    pushInitDone(
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve, reject) => {
        const tab = getCurrentTab()
        if (!tab) {
          try {
            let debounce = false
            Events.eventBus.on('/tab/new', async tab => {
              try {
                if (!debounce) {
                  debounce = true
                  await mountAll(tab, vfs)
                  resolve(undefined)
                }
              } catch (err) {
                console.error('Error in mount 1', err)
                reject(err)
              }
            })
          } catch (err) {
            console.error('Error in mount 2', err)
            reject(err)
          }
        } else {
          try {
            await mountAll(tab, vfs)
            resolve(undefined)
          } catch (err) {
            console.error('Error in mount 3', err)
            reject(err)
          }
        }
      }),
      placeholderMountPath
    )
  }
}

/** @return the absolute path to `filepath` */
export function absolute(filepath: string): string {
  return Util.expandHomeDir(filepath.toString())
}

/** Lookup compiatible matching mount */
export function findMatchingMounts(filepath: string, checkClient = false): VFS[] {
  const isClient = inBrowser()
  filepath = absolute(filepath)

  const mounts = _currentMounts.filter(
    mount => mount.mountPath.startsWith(filepath) && (!checkClient || !isClient || mount.isVirtual)
  )

  return mounts
}

/**
 * Lookup compiatible mount. Returns one of:
 * - a VFS mount, if it encloses the given filepath
 *
 * - true if `allowInner` and there exists a mount s.t. filepath
 *     encloses it (i.e. filepath is a parent of some mount)
 *
 * - otherwise, the local VFS mount
 */
export async function findMount(filepath: string, checkClient = false, allowInner = false): Promise<VFS> {
  await waitForMountsToFinish(filepath)

  const isClient = inBrowser()
  filepath = absolute(filepath)

  // filepath: /kuifake   Possibilities limited to [/kuifake]
  // mounts: ['/kuifake/fake1', '/tmpo', '/kuifake/fake2', '/kui', '/']
  // first loop should find nothing
  // if allowInner, second loop should return true; done!

  // filepath: /kuifake/fake1  Possibilities limited to [/kuifake, /kuifake/fake1]
  // mounts: ['/kuifake/fake1', '/tmpo', '/kuifake/fake2', '/kui', '/']
  // first loop should find /kuifake/fake1; done!

  // filepath: /kuifake/fake1/E1/f1  Possibilities limited to [/kuifake, /kuifake/fake1, /kuifake/fake1/E1, /kuifake/fake1/E1/f1]
  // mounts: ['/kuifake/fake1', '/tmpo', '/kuifake/fake2', '/kui', '/']
  // first loop should find /kuifake/fake1; done!

  // filepath: /a/b/c/d
  // mounts: ['/kuifake/fake1', '/tmpo', '/kuifake/fake2', '/kui', '/']
  // first loop should find '/'; done!

  // This loop checks if any mount **encloses** the given filepath (hence startsWith())
  // Important: search from longest to shortest!! e.g. we don't want
  // /aaa/b/c to match a mount /a when we also have a mount /aaa/b
  const splitPath = filepath.split(/\//)
  const possibilities: string[] = []
  for (let idx = 1; idx < splitPath.length; idx++) {
    if (splitPath[idx]) {
      possibilities.push('/' + splitPath.slice(1, idx + 1).join('/'))
    }
  }

  let foundMount: VFS
  for (let idx = 0; idx < _currentMounts.length; idx++) {
    const mount = _currentMounts[idx]
    const { mountPath } = mount

    if (possibilities.includes(mountPath) && (!checkClient || !isClient || mount.isVirtual)) {
      foundMount = mount
      break
    }
  }

  if (!foundMount) {
    if (allowInner) {
      // ok, then look for a mount where the given filepath encloses the mount
      for (let idx = 0; idx < _currentMounts.length; idx++) {
        const mount = _currentMounts[idx]
        if (mount.mountPath.startsWith(filepath) && (!checkClient || !isClient || mount.isVirtual)) {
          return
        }
      }
    }

    // local fallback; see https://github.com/IBM/kui/issues/5898
    foundMount = _currentMounts.find(mount => mount.isLocal)
  }

  // debug(`findMount ${filepath}->${foundMount.mountPath}`)
  return foundMount
}

/** Lookup compatible mounts */
export async function multiFindMount(
  filepaths: string[],
  checkClient = false
): Promise<{ filepaths: string[]; mount: VFS }[]> {
  if (filepaths.length === 0) {
    return multiFindMount([Util.cwd()], checkClient)
  }

  return (
    await Promise.all(
      filepaths.map(async filepath => ({
        filepaths: [slash(filepath)],
        mount: await findMount(filepath, checkClient)
      }))
    )
  )
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
export async function isLocal(filepath: string): Promise<boolean> {
  const mount = await findMount(filepath)
  return mount && mount.isLocal
}
