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
import { appList } from '../../utility/usage'
import * as repl from '../../../../../../../build/core/repl'
import * as astUtil from '../../utility/ast'
import UsageError from '../../../../../../../build/core/usage-error'
import * as Debug from 'debug'
const debug = Debug('plugins/apache-composer/cmd/invoke')

export default async (commandTree, prequire) => {
  /* command handler for app list */
  commandTree.listen(`/wsk/app/list`, ({ argvNoOptions, command, parsedOptions }) => {
    return repl.qfexec(argvNoOptions.join(' ').replace('app', 'action'))
      .then(actions => {
        debug('app list -> action list', actions)
        let apps = actions.filter(astUtil.isAnApp)

        if (parsedOptions.limit === 0) return []

        const queryParameters = ['limit', 'skip']
        queryParameters.forEach(parameter => {
          if (parsedOptions[parameter] !== undefined && (!Number.isInteger(parsedOptions[parameter]) || parsedOptions[parameter] < 0)) {
            throw new UsageError(`The query parameter ${parameter} was malformed:\nThe value '${parsedOptions[parameter]}' is not an integer for sessions.`)
          }
        })

        let skip = parsedOptions.skip || 0

        let limit = parsedOptions.limit || apps.length

        apps.forEach(app => {
          app.type = 'composition'
          app.prettyType = 'composition'
          app.prettyKind = 'composition'
          app.onclick = () => repl.pexec(`app get "/${app.namespace}/${app.name}"`)
          app.noSort = true
          return app
        })
        return parsedOptions.count ? apps.slice(skip, skip + limit).length : apps.slice(skip, skip + limit)
      })
  }, { usage: appList('list') })
}
