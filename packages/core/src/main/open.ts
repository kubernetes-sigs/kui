/*
 * Copyright 2020 IBM Corporation
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

/** Open a new window and replay the contents of the given `filepath` */
export function replay(filepath: string, createWindow: (executeThisArgvPlease?: string[]) => void) {
  createWindow(['replay', filepath])
}

/**
 * Open a file and replay its session.
 *
 */
export default async function open(createWindow: (executeThisArgvPlease?: string[]) => void) {
  const { app, dialog } = await import('electron')
  const resp = await dialog.showOpenDialog({
    title: 'Select a Kui snapshot',
    filters: [{ name: 'Kui snapshot', extensions: ['kui'] }]
  })
  if (!resp.canceled) {
    resp.filePaths.forEach(filepath => {
      app.addRecentDocument(filepath)
      replay(filepath, createWindow)
    })
  }
}
