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

import { join } from 'path'
import { encodeComponent } from '@kui-shell/core/mdist/api/Exec'
import { main } from '@kui-shell/client/package.json'

async function getAppPath() {
  try {
    const { app } = await import('electron')
    if (app) {
      const appPath = app.getAppPath()
      if (appPath) {
        return appPath
      }
    }
  } catch (err) {
    console.error('Error fetching app path', err)
  }

  const appPath = process.argv.find(_ => /app-path/.test(_))
  if (appPath) {
    return appPath.replace(/^--app-path=/, '')
  } else {
    return '.'
  }
}

/**
 * In electron production builds, if the user launches by double
 * clicking, or via spotlight (macos), then the CODEFLARE_HEADLESS and
 * GUIDEBOOK_STORE env vars are not defined. However, we can still
 * find these relative to the electron appPath. Note: here, we take a
 * shortcut, and extract the appPath from the `argv`. The proper way
 * to do this would be to invoke
 * `import('electron').app.getAppPath()`. Doing so would require
 * communicating with the electron main process, since this API is not
 * available in the renderer processes. See src/tray/renderer.ts for
 * how this is done; except that we would need to consume a return
 * value from the main process.
 *
 * @return the absolute path to the directory that includes the
 * headless bundle.js.
 */
async function electronProductionBuildHeadlessRoot() {
  return join(await getAppPath(), 'dist/headless')
}

/**
 * @return same as with `electronProductionBuildHeadlessRoot()`, except
 * returning the guidebook store absolute path
 */
async function electronProductionBuildGuidebookStore() {
  return join(await getAppPath(), 'store')
}

/**
 * @return same as with `electronProductionBuildGuidebookStore()`, except
 * returning the guidebook store for dev mode
 */
async function electronDevelopmentBuildGuidebookStore() {
  return join(await getAppPath(), 'node_modules/@guidebooks/store/dist/store')
}

/** @return the absolute path to the directory that contains the headless bundle.js */
function headlessRoot() {
  return electronProductionBuildHeadlessRoot()
}

/** @return the absolute path to the directory that contains the guidebook store for this build */
export function guidebookStore() {
  return (
    process.env.GUIDEBOOK_STORE ||
    (process.env.NODE_ENV === 'development'
      ? electronDevelopmentBuildGuidebookStore()
      : electronProductionBuildGuidebookStore())
  )
}

/** @return an env that will at least point to our guidebook store */
async function env() {
  return {
    KUI_S3: 'false',
    KUI_HEADLESS: 'true',
    KUI_HEADLESS_WEBPACK: 'true',
    ELECTRON_RUN_AS_NODE: 'true',
    GUIDEBOOK_STORE: await guidebookStore(),
    DEBUG: process.env.DEBUG || '',
    HOME: process.env.HOME || '',
    PATH: process.env.PATH || '',
    KUBECONFIG: process.env.KUBECONFIG || ''
  }
}

/** Fill in the given command line to spawn ourselves as a subprocess */
export default async function respawnCommand(cmdline: string | string[]) {
  return {
    argv: [
      // re: replace, in UI mode on macOS, the argv[0] points to the renderer executable
      encodeComponent(
        process.argv[0].replace(
          /\/Frameworks\/(\w+) Helper \(Renderer\)\.app\/Contents\/MacOS\/\w+ Helper \(Renderer\)$/,
          '/MacOS/$1'
        )
      ),
      encodeComponent(join(await headlessRoot(), '../../', main)),
      '--',
      ...(typeof cmdline === 'string' ? [cmdline] : cmdline)
    ],
    env: await env()
  }
}
