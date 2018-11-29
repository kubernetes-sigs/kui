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

import { join } from 'path'

import { addPath } from '../../../../build/core/find-file'
import { PluginRequire, PreloadRegistration } from '../../../../build/models/plugin'

const registration: PreloadRegistration = async (commandTree, prequire: PluginRequire) => {
  // give visibility to our @demos directory on the module path
  addPath(join(__dirname, '../tutorials/@tutorials'))
}

export default registration
