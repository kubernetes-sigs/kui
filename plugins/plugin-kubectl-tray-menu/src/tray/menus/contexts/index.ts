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

import { MenuItemConstructorOptions } from 'electron'
import { CreateWindowFunction } from '@kui-shell/core'

import Loading from '../loading'
import { get, set } from './current'
import { onRefresh } from '../../events'
import UpdateFunction from '../../update'
import { invalidate } from '../namespaces'

class ContextWatcher {
  public constructor(
    private readonly updateFn: UpdateFunction,
    private _contexts: MenuItemConstructorOptions[] = [Loading]
  ) {
    setTimeout(() => this.scan())
    onRefresh(() => this.findAndSetCurrentContext(this.contexts))
  }

  private async findAndSetCurrentContext(
    contexts: MenuItemConstructorOptions[],
    currentContextP = get().catch(() => '')
  ) {
    const currentContext = await currentContextP

    const oldCur = contexts.find(_ => _.checked)
    const newCur = contexts.find(_ => _.id === currentContext)
    if (oldCur) {
      oldCur.checked = false
    }
    if (newCur) {
      newCur.checked = true
    }

    this.contexts = contexts
  }

  private async setAndScan(cluster: string) {
    await set(cluster)
    this._contexts = []
    invalidate()
    this.scan()
  }

  private async scan() {
    const currentContextP = get().catch(() => '')

    const { execFile } = await import('child_process')
    execFile(
      'kubectl',
      ['config', 'get-contexts', '--output=name'],
      { windowsHide: true },
      async (err, stdout, stderr) => {
        if (err) {
          if (!/ENOENT/.test(err.message)) {
            // ENOENT if kubectl is not found
            console.error('Error scanning Kubernetes contexts', err.message)
            console.error(stderr)
          }
          this.contexts = [{ label: '<none>', enabled: false }]
        } else {
          const contexts: Record<string, string> = stdout
            .split(/\n/)
            .filter(Boolean)
            .sort()
            .reduce((M, context) => {
              const label = context
                .replace(/\/[^/]+$/, '')
                .replace(/:[^:]+$/, '')
                .replace(/^([^/]+)\/([^/]+)$/, '$2')
              if (!M[label]) {
                M[label] = context
              }
              return M
            }, {})

          const currentContext = await currentContextP
          this.contexts = Object.entries(contexts).map(([label, context]) => ({
            type: 'radio',
            id: context,
            label,
            click: () => this.setAndScan(context),
            checked: currentContext === context
          }))
        }
      }
    )
  }

  public get contexts() {
    return this._contexts
  }

  private set contexts(contexts: MenuItemConstructorOptions[]) {
    this._contexts = contexts
    this.updateFn()
  }
}

let watcher: null | ContextWatcher = null

export default function contextsMenu(
  createWindow: CreateWindowFunction,
  updateFn: UpdateFunction
): MenuItemConstructorOptions[] {
  if (!watcher) {
    watcher = new ContextWatcher(updateFn)
  }

  return watcher.contexts
}
