/*
 * Copyright 2019 IBM Corporation
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
import { lstat, readJSON } from 'fs-extra'

import { i18n, pluginUserHome, CodedError, Arguments, Registrar } from '@kui-shell/core'

const strings = i18n('plugin-manager')

interface Version {
  name: string
  version: string
  installedOn: Date
}

/**
 * Read the package.json of one given plugin to get its version
 *
 */
const _getVersion = async (pluginDir: string): Promise<Version> => {
  try {
    const { name, version } = (await readJSON(join(pluginDir, 'package.json'))) as { name: string; version: string }
    const { ctime } = await lstat(pluginDir)

    return { name, version, installedOn: new Date(ctime) }
  } catch (error) {
    const err = error as CodedError<string>
    if (err.code !== 'ENOTDIR') {
      console.error(err)
    }
    return undefined
  }
}

export async function getVersion(plugin: string): Promise<Version> {
  const moduleDir = await pluginUserHome()
  const version = await _getVersion(join(moduleDir, 'node_modules', plugin))

  if (!version) {
    const err: CodedError = new Error(strings('Plugin not found'))
    err.code = 404
    throw err
  } else {
    return version
  }
}

/**
 * This is the command handler for `plugin get`
 *
 */
const doVersion = async ({ argvNoOptions }: Arguments): Promise<string> => {
  argvNoOptions = argvNoOptions.slice(argvNoOptions.indexOf('version') + 1)
  const name = argvNoOptions.shift()
  const version = await getVersion(name)
  return version.version
}

export default (commandTree: Registrar) => {
  commandTree.listen('/plugin/version', doVersion)
}
