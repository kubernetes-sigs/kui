/*
 * Copyright 2019 The Kubernetes Authors
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
import type { CapabilityRegistration, PreloadRegistrar } from '@kui-shell/core'

export const registerCapability: CapabilityRegistration = async (registrar: PreloadRegistrar) => {
  const { inBrowser, isHeadless, inProxy } = require('@kui-shell/core/mdist/api/Capabilities')

  if (inBrowser()) {
    await import('./pty/session').then(({ init }) => init(registrar))
  } else if (!isHeadless() || inProxy()) {
    try {
      const prefetchShellState = (await import('./pty/prefetch')).default
      await prefetchShellState()
      const debug = Debug('plugins/bash-like/preload')
      debug('done with state prefetch')
    } catch (err) {
      console.error('error in state prefetch', err)
    }
  }
}

/**
 * This is the module
 *
 */
export default async (registrar: PreloadRegistrar) => {
  // registerPluginTabState()
  await import('./tab-state').then(_ => _.default())

  // register catch all
  await import('./lib/cmds/catchall').then(_ => _.preload(registrar))
}
