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

const debug = require('debug')('openwhisk.context')

import { current } from '../models/namespace'
import repl = require('@kui/core/core/repl')

export default (commandTree, prequire) => {
  // register namespace.current command
  commandTree.listen(`/wsk/namespace/current`, () => current(),
                     { docs: 'Print the currently selected namespace' })
}
