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

import * as Debug from 'debug'

import * as repl from '@kui-shell/core/core/repl'
import { CommandRegistrar } from '@kui-shell/core/models/command'

import { appList } from '../../utility/usage'
import * as astUtil from '../../utility/ast'

import { withHeader } from '@kui-shell/plugin-openwhisk'

const debug = Debug('plugins/apache-composer/cmd/app-list')

/** for the table model */
const type = 'composition'
const prettyType = 'compositions'
const prettyKind = type

interface ListOptions {
  name?: string
  count?: number
  limit?: number
  skip?: number
}

/**
 * Command handler for app list
 *
 */
export default async (commandTree: CommandRegistrar) => {
  commandTree.listen(
    `/wsk/app/list`,
    ({ argvNoOptions, parsedOptions: options, execOptions }) => {
      const parsedOptions = (options as any) as ListOptions // eslint-disable-line @typescript-eslint/no-explicit-any

      const limit = parsedOptions.limit || 10 // limit 10 sessions in session list if users didn't specify --limit

      if (limit === 0) {
        return { body: [] }
      }

      return repl.qexec(argvNoOptions.join(' ').replace('app', 'action')).then(actions => {
        debug('filtering action list to find compositions', actions)
        if (actions.body) {
          const apps = actions.body.filter(astUtil.isAnApp).map(app =>
            Object.assign({}, app, {
              type,
              prettyType,
              prettyKind,
              onclick: `wsk app get "/${app.namespace}/${app.name}"`
            })
          )

          const skip = parsedOptions.skip || 0
          const limit = parsedOptions.limit || apps.length

          const paginated = apps.slice(skip, skip + limit)

          return parsedOptions.count ? paginated.length : withHeader(paginated, execOptions)
        }
      })
    },
    { usage: appList('list') }
  )
}
