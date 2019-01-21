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
const debug = Debug('plugin/apache-composer/init')

import sessionList from './lib/controller/cmd/session-list'
import sessionGet from './lib/controller/cmd/session-get'
import invoke from './lib/controller/cmd/app-invoke'
import appDelete from './lib/controller/cmd/app-delete'
import appCreate from './lib/controller/cmd/app-create'
import appGet from './lib/controller/cmd/app-get'
import appList from './lib/controller/cmd/app-list'
import appConfig from './lib/controller/cmd/app-config'
import editorBits from './lib/controller/cmd/editor-extensions'
import * as usage from './usage'
import { initRequirePath } from './lib/utility/compile'

export default async (commandTree, prequire) => {
  debug('initializing')

  await initRequirePath()

  commandTree.subtree('/composer', { usage: usage.composer })

  const app = commandTree.subtree('/wsk/app', { usage: usage.app })
  commandTree.subtreeSynonym('/composer/app', app)

  const session = commandTree.subtree('/wsk/session', { usage: usage.session })
  commandTree.subtreeSynonym('/composer/session', session)

  // CRUD commands
  await sessionList(commandTree, prequire)
  await sessionGet(commandTree, prequire)
  await invoke(commandTree, prequire)
  await appDelete(commandTree, prequire)
  await appCreate(commandTree, prequire)
  await appList(commandTree, prequire)
  await appGet(commandTree, prequire)
  await appConfig(commandTree, prequire)
  await editorBits(commandTree, prequire)

  debug('init done')
}
