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

import Debug from 'debug'

const initDones: { initDone: Promise<void>; placeholderMountPath: string }[] = []

export function pushInitDone(initDone: Promise<void>, placeholderMountPath: string) {
  initDones.push({ initDone, placeholderMountPath })
  return initDone
}

export async function waitForMountsToFinish(filepath: string) {
  const waitForThis = initDones.find(
    _ => filepath.startsWith(_.placeholderMountPath) || filepath === _.placeholderMountPath + '/'
  )
  if (waitForThis) {
    const debug = Debug('plugin-bash-like/fs/initDone')
    debug('waiting for mount', waitForThis.placeholderMountPath)
    await waitForThis.initDone
    debug('waiting for mount: done!', waitForThis.placeholderMountPath)
  }
}
