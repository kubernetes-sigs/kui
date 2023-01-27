/*
 * Copyright 2019 The Kubernetes Authors
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

import type { Arguments, Registrar } from '@kui-shell/core'

/**
 * export command
 *
 */
const exportCommand = async (args: Arguments) => {
  const [{ doExecWithStdoutViaPty }, { inBrowser, hasProxy }, { eventBus }, { SymbolTable }] = await Promise.all([
    import('./catchall'),
    import('@kui-shell/core/mdist/api/Capabilities'),
    import('@kui-shell/core/mdist/api/Events'),
    import('@kui-shell/core/mdist/api/SymbolTable')
  ])

  const { command, tab, parsedOptions } = args
  const curDic = SymbolTable.read(tab)

  const toBeParsed = parsedOptions._[1]
  const arr = toBeParsed.split('=')
  const key = arr[0]

  // only add a semicolon if needed
  const semicolon = /;\s*$/.test(command) ? '' : ';'
  const myArgs = Object.assign({}, args, { command: `${command}${semicolon} echo -n $${key}` })

  const value = inBrowser() && !hasProxy() ? arr[1].replace(/^"(.+)"$/, '$1') : await doExecWithStdoutViaPty(myArgs)

  curDic[key] = value

  SymbolTable.write(tab, curDic)
  eventBus.emitEnvUpdate(key, value)

  return true
}

const usage = {
  command: 'export',
  docs: 'Export a variable or function to the environment of all the child processes running in the current shell',
  required: [{ name: 'key=value', docs: 'an assignment of key to value' }]
}

/**
 * Register command handlers
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen('/export', exportCommand, { usage })
}
