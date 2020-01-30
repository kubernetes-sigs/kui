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

import { UsageModel, i18n } from '@kui-shell/core'

const strings = i18n('plugin-editor')

/** list of related commands */
const all = ['compose', 'new', 'edit']
const allExcept = (cmd: string): string[] => all.filter(_ => _ !== cmd)

/**
 * Usage model for the editor plugin
 *
 */
export const toplevelUsage: UsageModel = {
  title: 'Editing operations',
  header: 'These commands will help you edit existing or create new assets',
  example: 'editor <command>',
  commandPrefix: 'editor',
  available: [{ command: 'edit', docs: 'Edit an existing file or entity' }]
}

export const editUsage = (command: string): UsageModel => ({
  command,
  strict: command,
  title: strings('Edit'),
  header: strings('header:edit'),
  docs: strings('docs:edit'),
  example: `${command} <filepath>`,
  required: [
    {
      name: '<filepath>',
      docs: strings('docs:edit:filepath'),
      file: true,
      implicitOK: ['actions', 'activations']
    }
  ],
  optional: [
    {
      name: '--create',
      boolean: true,
      docs: strings('docs:edit:create')
    },
    {
      name: '--language',
      hidden: true,
      docs: strings('docs:edit:language')
    },
    {
      name: '--name',
      hidden: true,
      docs: strings('docs:edit:name')
    },
    {
      name: '--type',
      hidden: true,
      docs: strings('docs:edit:type')
    }
  ],
  parents: [{ command: 'editor' }],
  related: allExcept('edit')
})
