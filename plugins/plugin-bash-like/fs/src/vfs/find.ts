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

import type VFS from './VFS'

import slash from 'slash'
import { isAbsolute, join, normalize } from 'path'
import { inBrowser } from '@kui-shell/core/mdist/api/Capabilities'
import { cwd, expandHomeDir } from '@kui-shell/core/mdist/api/Util'

import { _currentMounts } from './mount'
import { waitForMountsToFinish } from './initDone'

/** @return the absolute path to `filepath` */
export function absolute(filepath: string): string {
  return isAbsolute(expandHomeDir(filepath.toString())) ? filepath : normalize(join(cwd(), filepath))
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
    return multiFindMount([cwd()], checkClient)
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
