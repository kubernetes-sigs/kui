/*
 * Copyright 2017-18 IBM Corporation
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

import { Capabilities, Commands } from '@kui-shell/core'

const usage = {
  command: 'shell',
  title: 'Visual Shell',
  header: 'Open the visual shell',
  headlessOnly: true
}

// noEcho means don't echo the command if we came from headless
const docs = {
  usage,
  needsUI: true,
  fullscreen: false,
  noEcho: true,
  noHistory: true,
  noAuthOk: true
}

/**
 * This plugin allows opening the graphical shell from the terminal
 *
 */
export default (commandTree: Commands.Registrar) => {
  /** command handler */
  const doIt = () => ({ execOptions }) => {
    if (!Capabilities.isHeadless() && (!execOptions || !execOptions.causedByHeadless)) {
      throw new Error(`Usage: This command is intended for use from the CLI, to launch this graphical Shell.
You are already here. Welcome!`)
    }

    return true
  }

  // install the command handlers
  commandTree.listen(`/shell`, doIt(), docs)
}
