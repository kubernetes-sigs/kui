/*
 * Copyright 2017 IBM Corporation
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

import help from './lib/cmds/help'
import zoom from './lib/cmds/zoom'
import newTab from './lib/new-tab'
import textSearch from './lib/text-search'
import tabCompletion from './lib/tab-completion'

import { PluginRequire, PreloadRegistration } from '../../../../build/models/plugin'

/**
 * This is the module
 *
 */
const registration: PreloadRegistration = async (commandTree, prequire: PluginRequire, options?) => {
  await Promise.all([
    help(commandTree, prequire, options),
    zoom(commandTree, prequire),
    newTab(commandTree, prequire),
    textSearch(),
    tabCompletion()
  ])
}

export default registration
