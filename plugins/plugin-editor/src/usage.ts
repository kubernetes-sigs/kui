/*
 * Copyright 2018 IBM Corporation
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

import { Errors } from '@kui-shell/core'

/** list of related commands */
const all = ['compose', 'new', 'edit']
const allExcept = (cmd: string): string[] => all.filter(_ => _ !== cmd)

/**
 * Usage model for the editor plugin
 *
 */
export const toplevelUsage: Errors.UsageModel = {
  title: 'Editing operations',
  header: 'These commands will help you edit existing or create new assets',
  example: 'editor <command>',
  commandPrefix: 'editor',
  available: [{ command: 'edit', docs: 'Edit an existing file or entity' }]
}

export const editUsage = (command: string): Errors.UsageModel => ({
  command,
  strict: command,
  title: 'Editor',
  header: 'Open a given file or entity for editing.',
  example: `${command} <filepath>`,
  required: [
    {
      name: '<filepath>',
      docs: 'The local file path or entity name to edit',
      file: true,
      implicitOK: ['actions', 'activations']
    }
  ],
  optional: [
    {
      name: '--create',
      boolean: true,
      docs: 'Indicates that you want to create a local file (and parent directories as needed)'
    },
    {
      name: '--language',
      hidden: true,
      docs: 'For internal use, specify a language for coloring and IntelliSense'
    },
    {
      name: '--name',
      hidden: true,
      docs: 'For internal use, specify a name to show up in the sidecar header'
    },
    {
      name: '--type',
      hidden: true,
      docs: 'For internal use, specify a type to show up in the sidecar header'
    }
  ],
  parents: [{ command: 'editor' }],
  related: allExcept('edit')
})
