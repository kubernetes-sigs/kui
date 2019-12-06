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

/** breadcrumb parents */
const parents = ['module']

/** entity type */
export const entity = 'module'
export const entities = `${entity}s`
const commandPrefix = entity

/** projectName required attribute */
const projectNameAttr = 'projectName'
const importedProject = [
  {
    name: projectNameAttr,
    docs: 'Name of an imported module',
    entity,
    implicitOK: [entities]
  }
]

/** example string */
const example = (command: string) => `${entity} ${command} <${projectNameAttr}>`

/** capitalize a word */
const capitalize = word => word.charAt(0).toUpperCase() + word.substring(1)

/** generic project-related command */
const projectCommand = (command: string, docs: string, opts?) => ({
  strict: command,
  command,
  commandPrefix,
  breadcrumb: opts.breadcrumb || command,
  title: capitalize(command),
  header: docs,
  example: example(command),
  required: opts.noProjectRequired ? [] : opts.required || importedProject,
  optional: opts.optional,
  parents,
  related: opts.related
})

export const usage = {
  import: {
    strict: 'import',
    command: 'import',
    title: 'Import',
    header: 'import a Composer module from GitHub',
    example: `${entity} import <url>`,
    required: [
      {
        name: 'url',
        docs: 'github.com URL for the module to import',
        entity,
        file: true
      }
    ],
    optional: [
      {
        name: '--name',
        docs: 'Name for the imported module; defaults to the git repo name'
      },
      {
        name: '--branch',
        alias: '-b',
        docs: 'Check out a branch of the given module repository'
      },
      {
        name: '--force',
        alias: '-f',
        boolean: true,
        docs: 'Refresh the module if it has already been imported'
      }
    ],
    // related: ['plugin install', 'plugin list'],
    parents
  },

  get: projectCommand('get', 'learn more about a module', {
    related: [`${entity} api`, `${entity} deps`]
  }),

  imports: projectCommand('imports', 'discover the other modules upon which this module depends', {
    breadcrumb: 'Module Imports'
  }),
  deps: projectCommand('deps', 'discover the cloud services upon which this module depends', {
    breadcrumb: 'Service Dependencies'
  }),

  config: {
    strict: 'config',
    command: 'config',
    title: 'Configure',
    header: 'configure a module before deploying, such as setting up credentials',
    example: example('config'),
    required: importedProject,
    optional: [
      {
        name: '--save',
        hidden: true,
        boolean: true,
        docs: 'Save an empty config'
      }
    ],
    parents
  },

  deploy: {
    strict: 'deploy',
    command: 'deploy',
    title: 'Deploy',
    header: 'deploy a module',
    example: example('deploy'),
    required: importedProject,
    parents
  },

  undeploy: {
    strict: 'undeploy',
    command: 'undeploy',
    title: 'Undeploy',
    header: 'undeploy a module from the cloud',
    example: example('undeploy'),
    required: importedProject,
    parents
  },

  // module list command
  list: syn =>
    projectCommand(syn, 'list the imported projects', {
      breadcrumb: 'list',
      noProjectRequired: true,
      optional: [
        {
          name: 'moduleName',
          positional: true,
          docs: 'list the assets of a given module',
          entity
        },
        { name: '--limit', hidden: true } // needed for tab completion
      ],
      related: [`${entity} set`]
    }),

  // module init
  init: projectCommand('init', 'create a new empty project', {
    required: [{ name: 'moduleName', docs: 'name for the new module' }],
    related: [`${entity} set`, `${entity} list`]
  }),

  // module set, and unset
  set: projectCommand('set', 'focus the Shell on a given module', {
    related: [`${entity} list`]
  }),
  unset: projectCommand('unset', 'remove the current module focus', {
    noProjectRequired: true,
    related: [`${entity} list`, `${entity} set`]
  }),

  delete: projectCommand('delete', 'delete your local copy of a given imported module', {
    related: [`${entity} list`]
  }),

  status: syn =>
    projectCommand(syn, "Check on the status of a module's deployment", {
      optional: [
        {
          name: '--resource',
          alias: '-r',
          docs: 'Show the status of a given resource type'
        }
      ],
      related: [`${entity} list`, `${entity} watch`]
    }),

  watch: projectCommand('watch', "Monitor the status of a module's deployment", {
    related: [`${entity} list`, `${entity} status`]
  })
}

/** form a subtree usage model (TODO: this should be moved to a more common spot) */
const mkToplevel = () => {
  const model = {
    strict: entity,
    command: entity,
    commandPrefix: entity,
    title: 'Module management',
    header: 'Commands related to module management',
    example: `${entity} <command>`,
    nRowsInViewport: 6,
    available: []
  }

  for (const cmd in usage) {
    model.available.push(usage[cmd])
  }

  return model
}

export const toplevel = mkToplevel()
