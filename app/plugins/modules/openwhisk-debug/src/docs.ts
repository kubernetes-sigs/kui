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

import * as strings from './strings'

/**
 * Docs for the plugin - total four commands
 *
 */
export const main = {
  title: strings.title,
  header: strings.overall,
  example: 'local <command>',
  commandPrefix: 'local',
  available: [
    { command: 'invoke', docs: strings.invoke },
    { command: 'debug', docs: strings.debug },
    { command: 'init', docs: strings.init },
    { command: 'kill', docs: strings.kill, partial: true }, // this...
    { command: 'clean', docs: strings.clean, partial: true } // ... and this are dangerous, so make them partial
  ],
  related: ['help']
}

export const invoke = 'local invoke <action|activationId> [-p param value]'

export const debug = 'local debug <action|activationId> [-p param value]'

export const init = 'local init <action>'

export const kill = 'local kill'

export const clean = 'local clean'
