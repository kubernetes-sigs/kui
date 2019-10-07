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

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */

/**
 * API: arguments to plugin management
 *
 */
export namespace Plugins {
  /**
   * Recompile the plugin registry
   *
   * @param {string} [pluginToBeRemoved] when removing a plugin, it is
   * important to pass its name as this parameter, so that the command
   * registry cache can be updated without requiring a reload. You may
   * opt not to do so, but, in this case, a subsequent full reload is
   * mandatory; this will be the *caller's responsibility*.
   */
  export const compile = async (pluginToBeRemoved?: string) => {
    const { compileUserInstalled } = await import('../plugins/assembler')
    compileUserInstalled(pluginToBeRemoved)
  }

  /**
   * Home for user-installed plugins
   *
   */
  export const userHome = async () => {
    const { userInstalledHome } = await import('../plugins/plugins')
    return userInstalledHome()
  }

  /**
   * Render the commands provided by a given plugin
   *
   * @param {string} [plugin] enumerate the commands offered by the
   * given plugin
   */
  export const commandsOffered = async (plugin?: string) => {
    const commandsOffered = await import('../plugins/commands')
    return commandsOffered.default(plugin)
  }
}
