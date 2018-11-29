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

/** list of related commands */
const all = ['compose', 'new', 'edit']
const allExcept = (cmd: string): Array<String> => all.filter(_ => _ !== cmd)

/** optional arguments for new and compose commands */
const optional = allowed => [
  { name: '--kind',
    alias: '-k',
    docs: 'The OpenWhisk kind of the new action',
    allowed,
    allowedIsPrefixMatch: true,
    defaultValue: 'nodejs'
  },
  { name: '--template',
    alias: '-t',
    docs: 'Create a new entity using the given file as the starting place'
  },
  { name: '--readOnly',
    docs: 'Open the editor in read-only mode'
  },
  { name: '--simple',
    alias: '-s',
    docs: 'Simplify the editor presentation, such as not showing line numbers'
  }
]

/**
 * Usage model for the editor plugin
 *
 */
export const toplevelUsage = {
  title: 'In-shell editing operations',
  header: 'These commands will help you create new OpenWhisk assets from within the Shell',
  example: 'editor <command>',
  commandPrefix: 'editor',
  available: [{ command: 'compose', docs: 'Begin editing a new OpenWhisk Composition' },
              { command: 'edit', docs: 'Edit an existing OpenWhisk action' },
              { command: 'new', docs: 'Begin editing a new Openwhisk action' }],
  related: ['wsk', 'composer']
}

export const editUsage = {
  strict: 'edit',
  command: 'edit',
  title: 'Edit action',
  header: 'Open a given action or composition in the sidecar for editing.',
  example: 'edit <actionName>',
  required: [{ name: '<actionName>', docs: 'The OpenWhisk action to edit', implicitOK: ['actions', 'activations'] }],
  optional: [
    { name: '--language', hidden: true, docs: 'For internal use, specify a language for coloring and IntelliSense' },
    { name: '--name', hidden: true, docs: 'For internal use, specify a name to show up in the sidecar header' },
    { name: '--type', hidden: true, docs: 'For internal use, specify a type to show up in the sidecar header' }
  ],
  parents: [{ command: 'editor' }],
  related: allExcept('edit')
}

export const composeUsage = {
  strict: 'compose',
  command: 'compose',
  title: 'New composition',
  header: 'For quick prototyping of compositions, this command opens an editor in the sidecar.',
  example: 'compose <appName>',
  required: [{ name: '<appName>', docs: 'The name of your new composition' }],
  optional: optional(['nodejs', 'python']).concat([
    { name: '--preview', docs: 'Open the visualization of your composition' }
  ]),
  parents: [{ command: 'editor' }],
  related: allExcept('compose')
}

export const newUsage = {
  strict: 'new',
  command: 'new',
  title: 'New action',
  header: 'For quick prototyping of actions, this command opens an editor in the sidecar.',
  example: 'new <actionName>',
  required: [{ name: '<actionName>', docs: 'The name of your new action' }],
  optional: optional(['nodejs', 'python', 'php', 'swift']),
  parents: [{ command: 'editor' }],
  related: allExcept('new')
}
