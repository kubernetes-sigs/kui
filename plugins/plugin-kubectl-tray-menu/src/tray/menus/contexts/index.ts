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

import Debug from 'debug'
import { MenuItemConstructorOptions } from 'electron'
import { CreateWindowFunction } from '@kui-shell/core'

import Loading from '../loading'
import { get, set } from './current'
import { onRefresh } from '../../events'
import UpdateFunction from '../../update'
import { invalidate } from '../namespaces'

class ContextWatcher {
  private readonly debug = Debug('plugin-kubectl-tray-menu/context-watcher')

  public constructor(
    private readonly updateFn: UpdateFunction,
    private _contexts: MenuItemConstructorOptions[] = [Loading]
  ) {
    this.debug('constructor')
    setTimeout(() => this.scan())
    onRefresh(this.refresh)
  }

  /** Refresh content, e.g. because the model changed in the renderer */
  private readonly refresh = () => {
    this.debug('refresh')
    setTimeout(() => this.findAndSetCurrentContext(this.contexts))
  }

  /** Re-generate menu model from current data */
  private async findAndSetCurrentContext(
    contexts: MenuItemConstructorOptions[],
    currentContextP = get().catch(() => '')
  ) {
    try {
      this.debug('findAndSetCurrentContext', contexts.length)
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
    } catch (err) {
      this.debug('findAndSetCurrentContext failure', err.message)
    }
  }

  private none(): MenuItemConstructorOptions[] {
    return [{ label: '<none>', enabled: false }]
  }

  private async setAndScan(context: string) {
    this.debug('setAndScan')
    await set(context)
    this._contexts = []
    invalidate()
    this.scan()
  }

  private async scan() {
    this.debug('scan')
    const currentContextP = get().catch(() => '')

    const { execFile } = await import('child_process')
    execFile(
      'kubectl',
      ['config', 'get-contexts', '--output=name'],
      { windowsHide: true },
      async (err, stdout, stderr) => {
        this.debug('scan done', !!err)
        if (err) {
          if (!/ENOENT/.test(err.message)) {
            // ENOENT if kubectl is not found
            console.error('Error scanning Kubernetes contexts', err.message)
            console.error(stderr)
          }
          this.contexts = this.none()
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
