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

// this is for the resolveA and resolveB below
/* eslint-disable promise/param-names */

export let waitForInitDone: Promise<void>

import { REPL } from '@kui-shell/core'

/**
 * Create all semantic mounts for Kubernetes
 *
 */
export default async function preload() {
  // We use an env var as a primitive feature toggle for now
  if (process.env.KUI_SFS) {
    const [{ mount }, { onKubectlConfigChangeEvents }, { default: createContextMounts }] = await Promise.all([
      import('@kui-shell/plugin-bash-like/fs'),
      import('@kui-shell/plugin-kubectl'),
      import('./ContextFS')
    ])

    const init = (resolveA?: () => void) => {
      waitForInitDone = new Promise((resolveB, reject) => {
        setTimeout(() => {
          mount(async (repl: REPL) => {
            try {
              const mounts = await createContextMounts(repl)
              resolveB()
              return mounts
            } catch (err) {
              console.error('Error initializing k8s vfs', err)
              reject(err)
            }
          })

          if (typeof resolveA === 'function') {
            resolveA()
          }
        })
      })
    }

    onKubectlConfigChangeEvents(() => init())
    return new Promise(resolve => init(() => resolve(undefined)))
  }
}
