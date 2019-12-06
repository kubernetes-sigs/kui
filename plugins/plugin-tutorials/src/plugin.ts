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

import { Registrar } from '@kui-shell/core'

import list from './lib/cmds/list'
import get from './lib/cmds/get'
import play from './lib/cmds/play'
import shortcuts from './lib/cmds/shortcuts'

export default async (commandTree: Registrar) => {
  return Promise.all([list(commandTree), get(commandTree), play(commandTree), shortcuts(commandTree)])
}
