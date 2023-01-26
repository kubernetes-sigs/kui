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

import type { Arguments, REPL } from '@kui-shell/core'
import type VFS from './VFS'

import { pushInitDone } from './initDone'

/**
 * Current VFS mounts
 *
 */
export const _currentMounts: VFS[] = []

/**
 * Establish a total ordering of mounts, based on depth in the
 * tree. Sibling order is arbitrary, at the moment.
 *
 */
function orient(A: VFS, B: VFS) {
  const a = A.mountPath.split(/\//).filter(_ => _)
  const b = B.mountPath.split(/\//).filter(_ => _)

  return b.length - a.length
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
        const { getCurrentTab } = await import('@kui-shell/core/mdist/api/Tab')
        const tab = getCurrentTab()
        if (!tab) {
          try {
            let debounce = false
            const { eventBus } = await import('@kui-shell/core/mdist/api/Events')
            eventBus.on('/tab/new', async tab => {
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
