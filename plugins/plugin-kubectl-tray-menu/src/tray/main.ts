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

import { CreateWindowFunction } from '@kui-shell/core'
import { productName } from '@kui-shell/client/config.d/name.json'

import { trayIcon } from './icons'
import buildContextMenu from './menus'

// we only want one tray menu, so we need to squirrel away a reference
// somewhere
let tray: null | InstanceType<typeof import('electron').Tray> = null

class LiveMenu {
  // serialized form, to avoid unnecessary repaints
  private currentContextMenu = ''

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly tray: import('electron').Tray,
    private readonly createWindow: CreateWindowFunction,
    private readonly periodic = setInterval(() => this.render(), 10 * 1000)
  ) {}

  /** Avoid a flurry of re-renders */
  private debounce: null | ReturnType<typeof setTimeout> = null

  public render() {
    if (this.debounce != null) {
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(async () => {
      try {
        // avoid blinking on linux by constantly repainting: only update
        // the tray if the model has changed
        const newContextMenu = await buildContextMenu(this.createWindow, this.render.bind(this))
        const newContextMenuSerialized = JSON.stringify(
          newContextMenu,
          (key, value) => (key === 'menu' || key === 'commandsMap' || key === 'commandId' ? undefined : value),
          2
        )
        if (this.currentContextMenu !== newContextMenuSerialized) {
          this.currentContextMenu = newContextMenuSerialized
          this.tray.setToolTip(productName)
          this.tray.setContextMenu(newContextMenu)
        }
      } catch (err) {
        console.error('Error rendering tray menu', err)
      }
    }, 200)
  }
}

/**
 * This is the logic that will be executed in the *electron-main*
 * process for tray menu registration. This will be invoked by our
 * `electron-main.ts`, via the `renderer` function below, which in
 * turn is called from our `preload.ts`.
 */
export default async function main(createWindow: CreateWindowFunction) {
  if (tray) {
    // only register one tray menu...
    return
  }

  const { app } = await import('electron')

  app
    .whenReady()
    .then(async () => {
      try {
        const { Tray } = await import('electron')
        tray = new Tray(trayIcon)
        new LiveMenu(tray, createWindow).render()
      } catch (err) {
        console.error('Error registering electron tray menu', err)
      }
    })
    .catch(err => {
      console.error('Error registering electron tray menu', err)
    })
}
