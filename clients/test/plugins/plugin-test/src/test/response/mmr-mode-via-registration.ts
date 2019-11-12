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

import { TestMMR } from '@kui-shell/test'

import { command, metadata as _meta } from '../../lib/cmds/mmr-mode-via-registration'
import { badgesWeWillRegister as badges, modesWeWillRegister as modes } from '../../lib/modes'

const { metadata } = _meta

const test = new TestMMR({
  testName: 'mmr-mode-via-registration',
  metadata,
  command
})

test.badges(badges)
test.modes(modes, { testWindowButtons: true })
