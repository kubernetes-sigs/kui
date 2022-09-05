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
import { CreateWindowFunction } from '@kui-shell/core'
import { MenuItemConstructorOptions } from 'electron'

import Loading from '../loading'
import { get, set } from './current'
import { errorIcon } from '../../icons'
import { onRefresh } from '../../events'
import UpdateFunction from '../../update'

class NamespaceWatcher {
  public constructor(
    private readonly updateFn: UpdateFunction,
    private _namespaces: MenuItemConstructorOptions[] = [Loading]
  ) {
    setTimeout(() => this.scan())
    onRefresh(this.refresh)
  }

  /** Refresh content, e.g. because the model changed in the renderer */
  private readonly refresh = () => this.findAndSetCurrentNamespace(this.namespaces)

  /** Re-generate menu model from current data */
  private async findAndSetCurrentNamespace(
    namespaces: MenuItemConstructorOptions[],
    currentNamespaceP = get().catch(() => '')
  ) {
    const currentNamespace = await currentNamespaceP

    const oldCur = namespaces.find(_ => _.checked)
    const newCur = namespaces.find(_ => _.label === currentNamespace)
    if (oldCur) {
      oldCur.checked = false
    }
    if (newCur) {
      newCur.checked = true
    }

    this.namespaces = namespaces
  }

  private async setAndScan(ns: string) {
    await set(ns)
    this._namespaces = []
    this.scan()
  }

  private unauthorized() {
    this.namespaces = [{ label: 'Your token has probably expired', enabled: false, icon: errorIcon }]
  }

  private async scan() {
    try {
      const currentNamespaceP = get().catch(() => '')

      const { spawn } = await import('child_process')
      const child = spawn(
        'kubectl',
        ['get', 'ns', '--no-headers', '--output=custom-columns=NAME:.metadata.name,STATUS:.status.phase', '--watch'],
        {
          stdio: ['inherit', 'pipe', 'pipe']
        }
      )

      child.on('exit', async code => {
        if (
          code === 1 &&
          (this.namespaces.length === 0 || (this.namespaces.length === 1 && this.namespaces[0] === Loading))
        ) {
          this.unauthorized()
        }
        await new Promise(resolve => setTimeout(resolve, 2000))
        this.scan()
      })

      child.on('error', err => {
        if (/Unauthorized/.test(err.message)) {
          this.unauthorized()
        } else {
          if (!/ENOENT/.test(err.message)) {
            // ENOENT if kubectl is not found
            console.error(err.message)
          }
          this.namespaces = [{ label: '<none>', enabled: false }]
        }
      })

      const debug = Debug('plugin-kubectl/tray/menus/namespaces')
      child.stderr.on('data', data => debug(data.toString()))

      // partial line from last batch
      let leftover = ''

      child.stdout.on('data', async data => {
        const events = (leftover + data.toString())
          .split(/\n/)
          .filter(Boolean)
          .filter(_ => !/^(kube-|openshift|tigera|ibm-|calico-)/.test(_))
          .sort()
          .map(_ => _.split(/\s+/))

        if (events.length > 0 && events[events.length - 1].length < 2) {
          // keep track of partial lines from last time
          leftover = events[events.length - 1].join(' ')
        } else {
          leftover = ''
        }

        // we use this to 1) remove duplicates (e.g. a namespace might
        // appear twice because some other field was updated, but it
        // is still Active); and 2) remove namespaces that are going
        // away
        const inThisBatch = events
          .filter(_ => _.length === 2) // ignore partial lines
          .reduce((M, _) => {
            M[_[0]] = true
            return M
          }, {})

        const namespaces: MenuItemConstructorOptions[] = [
          // strip off initial Loading indiciator and any deleted or updated namespaces
          ...this.namespaces.filter(_ => _ !== Loading && !inThisBatch[_.label]),

          // add in new ones, indicated by an Active status in the event
          ...events
            .filter(_ => _[0] && _[1] === 'Active')
            .map(_ => ({
              label: _[0],
              type: 'radio' as const,
              click: () => this.setAndScan(_[0])
            }))
        ]

        this.findAndSetCurrentNamespace(namespaces, currentNamespaceP)
      })
    } catch (err) {}
  }

  public invalidate() {
    this._namespaces = []
    this.scan()
  }

  public get namespaces() {
    return this._namespaces
  }

  private set namespaces(namespaces: MenuItemConstructorOptions[]) {
    this._namespaces = namespaces
    this.updateFn()
  }
}

let watcher: null | NamespaceWatcher = null

/** Invalidate based on context change */
export function invalidate() {
  if (watcher) {
    watcher.invalidate()
  }
}

/** @return a menu for namespaces for the current context */
export default function namespacesMenu(
  createWindow: CreateWindowFunction,
  updateFn: UpdateFunction
): MenuItemConstructorOptions[] {
  if (!watcher) {
    watcher = new NamespaceWatcher(updateFn)
  }

  return watcher.namespaces
}
