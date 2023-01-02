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

import { width, height } from '@kui-shell/client/config.d/style.json'

export async function openWindow(title: string, initialTabTitle: string, argv: (string | undefined)[]) {
  const { ipcRenderer } = await import('electron')

  ipcRenderer.send(
    'synchronous-message',
    JSON.stringify({
      operation: 'new-window',
      title,
      initialTabTitle,
      width,
      height,
      argv
    })
  )
}

/** Delete the given profile */
export async function handleDelete(selectedProfile: string) {
  const { Profiles } = await import('madwizard')
  await Profiles.remove({}, selectedProfile)
}

/** Create a new profile */
export async function handleNew(selectedProfile: string, profiles: import('madwizard').Profiles.Profile[]) {
  const { Profiles } = await import('madwizard')

  const defaults = profiles
    .map(_ => _.name.match(/default-?(\d+)?/))
    .filter(Boolean)
    .map(_ => (_ && _[1] ? parseInt(_[1], 10) : 0))
  defaults.sort((a, b) => b - a)

  const name = defaults.length === 0 ? 'default' : `default-${defaults[0] + 1}`
  await Profiles.clone({}, selectedProfile, name)
  await Profiles.reset({}, name)
  await Profiles.touch({}, name)

  return name
}

/** Reset the choices of the given profile */
export async function handleReset(selectedProfile: string) {
  const { Profiles } = await import('madwizard')
  await Profiles.reset({}, selectedProfile)
}

export function handleBoot(selectedProfile: string | undefined) {
  openWindow(`Booting ${selectedProfile}`, 'Booting', [
    'madwizard',
    'gui',
    'guide',
    '-y',
    '--profile',
    selectedProfile,
    'ml/ray/start/kubernetes'
  ])
}

export function handleShutdown(selectedProfile: string | undefined) {
  openWindow(`Shutting down ${selectedProfile}`, 'Shutting down', [
    'madwizard',
    'gui',
    'guide',
    '-y',
    '--profile',
    selectedProfile,
    'ml/ray/stop'
  ])
}
