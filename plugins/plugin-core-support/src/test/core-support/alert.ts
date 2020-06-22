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
import * as assert from 'assert'

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

describe('alert command', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const types = ['info', 'error', 'success', 'warning']
  types.forEach(type => {
    it(`should execute: alert ${type} "foo" --body="bar"`, () => {
      return CLI.command(`alert ${type} "foo" --body="bar"`, this.app)
        .then(() => ReplExpect.okWithCustom({ selector: Selectors.TERMINAl_ALERT(type) }))
        .then(async () => {
          const alertText = await this.app.client.getText(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAl_ALERT(type)}`)
          assert.ok(alertText.includes('foo') && alertText.includes('bar'))
        })
        .catch(Common.oops(this))
    })
  })

  it('should fail to exec the command without type and title: alert', () =>
    CLI.command(`alert`, this.app).then(ReplExpect.error(497)))

  it('should fail to exec the command without title: alert error', () =>
    CLI.command(`alert error`, this.app).then(ReplExpect.error(497)))

  it('should fail to exec the wrong command: alert foo bar', () =>
    CLI.command(`alert foo bar`, this.app).then(ReplExpect.error(500)))

  it('should fail to exec the command with unsupported optional param: alert error yo --yo=true', () =>
    CLI.command(`alert error yo --yo=true`, this.app).then(ReplExpect.error(499)))
})
