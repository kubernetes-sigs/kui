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

import { tellRendererToExecute } from '@kui-shell/core'

/** Get current context */
export async function get() {
  const { execFile } = await import('child_process')
  return new Promise<string>((resolve, reject) => {
    try {
      execFile('kubectl', ['config', 'current-context'], { windowsHide: true }, (err, stdout, stderr) => {
        if (err) {
          console.error(stderr)
          reject(err)
        } else {
          resolve(stdout.trim())
        }
      })
    } catch (err) {
      console.error('Error starting current namespace process', err)
      reject(err)
    }
  })
}

/** Set current context */
export async function set(context: string, tellRenderer = true) {
  const args = ['config', 'use-context', context]

  if (tellRenderer) {
    // inform the renderer that we have a context-related change
    setTimeout(() => {
      try {
        tellRendererToExecute('kubectl ' + args.join(' '))
      } catch (err) {
        console.error('Error communicating context change to renderer', err)
      }
    }, 200)
  }

  const { execFile } = await import('child_process')
  return new Promise<string>((resolve, reject) => {
    try {
      execFile('kubectl', args, { windowsHide: true }, (err, stdout, stderr) => {
        if (err) {
          console.error(stderr)
          reject(err)
        } else {
          resolve(stdout.trim())
        }
      })
    } catch (err) {
      console.error('Error starting use-context process', err)
      reject(err)
    }
  })
}
