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

/**
 * Usage model for the composer plugin
 *
 */
export const composer = {
  breadcrumb: 'Composer',
  title: 'Create and invoke complex applications',
  header: 'These commands will help you work with Composer applications.',
  example: 'composer <command>',
  commandPrefix: 'composer',
  available: [
    { command: 'app', docs: 'create and invoke compositions', dir: true },
    {
      command: 'session',
      docs: 'inspect the results of composition activations',
      dir: true
    },
    { command: 'config', docs: 'print the details of your configuration' }
  ],
  related: ['help', 'wsk']
}

export const app = {
  title: 'CRUD Operations',
  header: 'These commands will help you create and invoke Composer applications.',
  example: 'wsk app <command> or app <command>',
  commandPrefix: 'wsk app',
  available: [
    { command: 'create', docs: 'create and deploy a new composition' },
    { command: 'update', docs: 'update and deploy a new composition' },
    { command: 'get', docs: 'get the details of a given composition' },
    {
      command: 'invoke',
      docs: 'invoke a given app and wait for its completion'
    },
    {
      command: 'async',
      docs: 'invoke a given app asynchronously, and return a session id'
    },
    {
      command: 'preview',
      docs: 'visualize a composition, without deploying it'
    },
    { command: 'list', docs: 'list all compositions' },
    { command: 'delete', docs: 'delete a compositions' },
    {
      command: 'config',
      docs: 'Print out the details of your composer configuration'
    }
  ],
  parents: ['composer'],
  related: ['composer session']
}

export const session = {
  title: 'Inspecting Sessions',
  header: 'These commands will help you inspect the activation results of Composer applications.',
  example: 'wsk session <command>',
  commandPrefix: 'session',
  available: [
    { command: 'get', docs: 'get the details of a given Composer activation' },
    { command: 'list', docs: 'list recent Composer activations' }
  ],
  parents: ['composer'],
  related: ['composer app']
}
