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

/**
 * [Main Process]: This logic will be executed in the electron-main
 * process, and is called by Kui core in response to the event issued
 * by `./tray/renderer`, whenever a new electron window opens.
 */
export async function initTray(args: { command: string }, _: unknown, createWindow: CreateWindowFunction) {
  if (args.command === '/tray/init') {
    import('./tray/main').then(_ => _.default(createWindow))
  } else if (args.command === '/tray/refresh') {
    import('./tray/events').then(_ => _.emitRefresh())
  }
}
