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

import { CommandOptions, UsageModel } from '@kui-shell/core'

import standardOptions from './aliases'

/** deployed variant of an entity name */
const deployed = entity => [Object.assign({}, entity[0], { entity: `wsk ${entity[0].name}` })]

/** required action parameter */
const action = [{ name: 'action', docs: 'an action name' }]
export const deployedAction = deployed(action)
export const actionImplicitOK = [
  Object.assign({}, deployedAction[0], {
    implicitOK: ['Action', 'Activation', 'actions', 'activations']
  })
]

/** required package parameter */
export const aPackage = [{ name: 'package', docs: 'a package name' }]
export const deployedPackage = deployed(aPackage)
export const maybeDeployedPackage = deployedPackage // nothing special for now; this is for update, which takes either a name or an entity

/** required trigger parameter */
export const trigger = [{ name: 'trigger', docs: 'a trigger name' }]
export const deployedTrigger = deployed(trigger)
export const maybeDeployedTrigger = deployedTrigger // nothing special for now; this is for update, which takes either a name or an entity

/** required rule parameter */
export const rule = [{ name: 'rule', docs: 'a rule name' }]
export const deployedRule = deployed(rule)
export const maybeDeployedRule = deployedRule // nothing special for now; this is for update, which takes either a name or an entity

/** required source file parameter */
export interface Option {
  name: string
  alias?: string
  positional?: boolean
  file?: boolean
  docs: string
}
export const sourceFile: Option[] = [
  {
    name: 'sourceFile',
    positional: true,
    file: true,
    docs: 'a local path to the action source'
  }
]

/** required activationId parameter */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const activationID: any[] = [{ name: 'activationId', docs: 'an activation ID', entity: 'wsk activation' }]

/** optional parameters having to do with parameter bindings */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const params: any[] = [
  {
    name: '--param',
    alias: '-p',
    example: 'key value',
    docs: 'bind a variable to a value',
    narg: 2,
    key: 'parameters'
  },
  {
    name: '--param-file',
    alias: '-P',
    advanced: true,
    docs: 'a local path to a bindings file',
    file: true
  }
]

/** optional parameters having to do with annotations */
const annotations = [
  {
    name: '--annotation',
    alias: '-a',
    example: 'key value',
    docs: 'annotate a variable with a value',
    narg: 2,
    key: 'annotations'
  },
  {
    name: '--annotation-file',
    alias: '-A',
    advanced: true,
    docs: 'a local path to a bindings file'
  }
]

/** optional parameters and annotations */
export const paramsAndAnnotations = params.concat(annotations)

/** package sharing scope parameter */
export const shared = [{ name: '--shared', docs: 'package visibility', allowed: ['yes', 'no'] }]

/** feed annotation for triggers */
export const feed = [
  {
    name: '--feed',
    alias: '-f',
    docs: 'create a feed from a given provider',
    entity: 'wsk action'
  }
]

/** timeout parameter */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const timeout: any[] = [
  {
    name: '--timeout',
    alias: '-t',
    docs: 'max milliseconds to wait for blocking invoke',
    defaultValue: 60000
  }
]

/** resource limit parameters */
const limits = timeout.concat([
  {
    name: '--memory',
    alias: '-m',
    numeric: true,
    docs: 'the maximum memory in MB',
    defaultValue: 256
  },
  {
    name: '--logsize',
    alias: '-l',
    numeric: true,
    docs: 'the maximum log size in MB',
    defaultValue: 10
  }
])

/** common action parameters */
export const actionMix = params
  .concat(annotations)
  .concat(limits)
  .concat([
    {
      name: '--kind',
      allowed: ['nodejs', 'python', 'php'],
      allowedIsPrefixMatch: true,
      defaultValue: 'nodejs',
      docs: 'the action runtime'
    },
    {
      name: '--sequence',
      boolean: true,
      example: 'a1,a2,a3',
      docs: 'create a sequence of the given actions'
    },
    {
      name: '--copy',
      boolean: true,
      advanced: true,
      docs: 'copy the action named by the second parameter to a new action named by the first'
    },
    {
      name: '--native',
      boolean: true,
      docs: 'use a shell script or Linux binary for the action'
    },
    { name: '--web', boolean: true, docs: 'web export the action' },
    { name: '--main', docs: 'specify the main method for Java actions' },
    { name: '--content-type', hidden: true }
  ])

/** optional skip and limit parameters */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const skipAndLimit: any[] = [
  { name: '--limit', alias: '-l', numeric: true, docs: 'show at most N' },
  { name: '--skip', alias: '-s', numeric: true, docs: 'start from N' },
  {
    name: '--count',
    boolean: true,
    docs: 'return a count, rather than the records'
  }
]

export const bind = 'Usage: bind <packageName> <bindName> [-p key value]...'

export const api = {
  title: 'API Gateway operations',
  header: 'These commands will help you to work with routes and the API Gateway.',
  example: 'wsk api <command>',
  commandPrefix: 'wsk api',
  nRowsInViewport: 4, // list all four, since we have a short list
  available: [
    {
      command: 'list',
      strict: 'list',
      docs: 'list all APIs',
      example: 'wsk api list',
      optional: skipAndLimit
    },
    {
      command: 'get',
      strict: 'get',
      docs: 'get API details',
      example: 'wsk api get <api>',
      oneof: [
        { name: 'api', docs: 'the name of an API' },
        { name: 'path', docs: 'the full base/path route an API' }
      ],
      optional: [
        { name: 'verb', positional: true, docs: 'the verb to show' },
        {
          name: '--format',
          docs: 'specify the API output TYPE, either json or yaml',
          allowed: ['json', 'yaml'],
          defaultValue: 'json'
        },
        {
          name: '--full',
          alias: '-f',
          docs: 'display full API configuration details'
        }
      ]
    },
    {
      command: 'delete',
      strict: 'delete',
      docs: 'delete an API',
      example: 'wsk api delete <api>',
      required: [{ name: 'api', docs: 'the name of an API' }],
      optional: [
        { name: 'path', positional: true, docs: 'the path of the API' },
        { name: 'verb', positional: true, docs: 'the verb of the API' }
      ]
    },
    {
      command: 'create',
      strict: 'create',
      docs: 'create a new API',
      example: 'wsk api create <[base] path verb action>',
      required: [
        { name: 'path', docs: 'path for the API' },
        { name: 'verb', docs: 'the HTTP method' },
        { name: 'action', docs: 'the OpenWhisk action to invoke' }
      ],
      optional: [
        { name: 'base', positional: true, docs: 'base path for the API' },
        { name: '--apiname', alias: '-n', docs: 'friendly name of the API' },
        {
          name: '--config-file',
          alias: '-c',
          docs: 'file containing API configuration in swagger JSON format'
        },
        {
          name: '--response-type',
          docs: 'set the web action response type',
          allowed: ['http', 'json', 'text', 'svg'],
          defaultValue: 'json'
        }
      ]
    }
  ]
}

export function withStandardOptions(model: UsageModel): CommandOptions {
  const usage = Object.assign({}, standardOptions.usage, model)
  return Object.assign({}, standardOptions, { usage })
}

export const standardListUsage = (syn: string, withName = false, command = 'list') =>
  withStandardOptions({
    command,
    strict: command,
    docs: `list all ${syn} entities`,
    example: `wsk ${syn} ${command}`,
    optional: [
      {
        name: 'package',
        positional: true,
        entity: 'wsk package',
        docs: `list all ${syn} entities in a given package`
      }
    ]
      .concat(skipAndLimit)
      .concat(withName ? [{ name: '--name', positional: false, entity: '', docs: 'Filter by name' }] : [])
  })
