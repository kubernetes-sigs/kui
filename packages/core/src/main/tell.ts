/*
 * Copyright 2017 The Kubernetes Authors
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

/**
 * Tell the renderer to execute a command
 *
 */
const tellRendererToExecute = async (command: string, exec = 'qexec') => {
  const { webContents } = await import('electron')
  const focusedWindow = webContents.getFocusedWebContents() || webContents.getAllWebContents()[0] // see https://github.com/IBM/kui/issues/1717

  const devTools = webContents
    .getAllWebContents()
    .map(_ => _.devToolsWebContents)
    .filter(x => x)
  const isFocusedWindowDevTools = devTools.find(_ => _.id === focusedWindow.id)

  if (isFocusedWindowDevTools) {
    // debug('closing dev tools')
    const owningWindow = webContents.getAllWebContents().find(_ => {
      return _.devToolsWebContents && _.devToolsWebContents.id === focusedWindow.id
    })
    if (owningWindow) {
      owningWindow.closeDevTools()
    }
  } else if (focusedWindow) {
    // debug('closing kui window')
    focusedWindow.send(`/repl/${exec}`, { command })
  }
}

export default tellRendererToExecute
