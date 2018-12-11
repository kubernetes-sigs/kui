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
import * as Debug from 'debug'
const debug = Debug('plugins/apache-composer/cmd/invoke')

export default async (commandTree, prequire) => {
  /* command handler for app list */
  commandTree.listen(`/wsk/app/list`, ({ command }) => {
    return repl.qfexec(command.replace('app', 'action'))
      .then(actions => {
        debug('app list -> action list', actions)
        let apps = actions.filter(astUtil.isAnApp)
        apps.forEach(app => {
          app.type = 'composition'
          app.prettyType = 'composition'
          app.prettyKind = 'composition'
          app.onclick = () => repl.pexec(`app get "/${app.namespace}/${app.name}"`)
          app.noSort = true
          return app
        })
        return apps
      })
  }, { usage: appList('list') })
}
