/*
 * Copyright 2019 The Kubernetes Authors
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
import * as Common from './common'
import * as CLI from './cli'
import * as ReplExpect from './repl-expect'

interface Param {
  command: string
  expect: string
  exact: boolean
  streaming?: boolean
}

export class TestStringResponse {
  // eslint-disable-next-line no-useless-constructor
  public constructor(public readonly param: Param) {}

  public string() {
    const { command, expect, exact, streaming } = this.param

    describe(`string response for command=${command} ${
      process.env.MOCHA_RUN_TARGET || ''
    }`, function (this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it('should return a string', () =>
        CLI.command(command, this.app)
          .then(ReplExpect.okWithString(expect, exact, streaming))
          .catch(Common.oops(this, true)))
    })
  }
}
