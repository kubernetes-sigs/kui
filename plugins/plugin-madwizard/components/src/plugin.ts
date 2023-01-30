/*
 * Copyright 2022 The Kubernetes Authors
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
import { doMadwizard, flags } from '@kui-shell/plugin-madwizard/do'

/** Register Kui Commands */
export default function registerMadwizardComponentCommands(registrar: Registrar) {
  // registrar.listen('/profile', doMadwizard({ task: 'profile', withFilepath: false }))

  registrar.listen(
    '/guide',
    doMadwizard({
      task: 'guide',
      cb: (filepath, tab) => import('./PlanAndGuide').then(_ => _.planAndGuide(filepath, { tab }))
    }),
    { outputOnly: true, flags }
  )

  /* registrar.listen(
    '/wizard',
    doMadwizard({
      readonlyUI: false,
      task: 'guide',
      cb: (filepath, tab) => import('./Guide').then(_ => _.guide(filepath, { tab }))
    }),
    { flags }
  ) */

  registrar.listen(
    '/plan',
    doMadwizard({
      readonlyUI: false,
      task: 'plan',
      cb: (filepath, tab) => import('./Plan').then(_ => _.plan(filepath, { tab }))
    }),
    { flags }
  )

  /**
   * This is a command handler that opens up a terminal to run a
   * selected profile-oriented task.
   *
   */
  registrar.listen(
    '/madwizard/designer',
    async args => import('./designer').then(async _ => ({ react: await _.controller(args) })),
    {
      needsUI: true
    }
  )

  /**
   * This is a command handler that opens up a terminal to run a
   * selected profile-oriented task.
   *
   */
  registrar.listen(
    '/madwizard/guide',
    async args => import('./GuidebookTerminal').then(async _ => ({ react: await _.controller(args) })),
    {
      needsUI: true
    }
  )

  /**
   * Playground that listens for edits on the provided channel
   *    madwizard playground <channel>
   *
   */
  registrar.listen(
    '/madwizard/playground',
    async args => import('./Playground').then(async _ => ({ react: await _.listenOnChannel(args) })),
    {
      needsUI: true
    }
  )

  /**
   * Playground for a given filepath
   *    madwizard playground file <filepath>
   *
   */
  registrar.listen(
    '/madwizard/playground/file',
    async args => import('./Playground').then(async _ => ({ react: await _.readFromFile(args) })),
    {
      needsUI: true
    }
  )
}
