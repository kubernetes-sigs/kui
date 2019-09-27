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

import { Common, CLI, ReplExpect } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const expectedError = `Usage: This command is intended for use from the CLI, to launch this graphical Shell.
You are already here. Welcome!`

describe('try using "shell" to open the graphical shell, when already in the graphical shell', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should fail when executing "shell"', () =>
    CLI.command('shell', this.app)
      .then(ReplExpect.error(0, expectedError))
      .catch(Common.oops(this)))
})
