/*
 * Copyright 2020 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

describe('alert command', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const types = ['info', 'error', 'success', 'warning']
  types.forEach(type => {
    it(`should execute: alert ${type} "foo" --body="bar"`, () => {
      return CLI.command(`alert ${type} "foo" --body="bar"`, this.app)
        .then(ReplExpect.okWithCustom({ selector: Selectors.TERMINAL_ALERT(type) }))
        .then((selector: string) =>
          this.app.client.waitUntil(
            async () => {
              const alertText = await this.app.client.$(selector).then(_ => _.getText())
              return alertText.includes('foo') && alertText.includes('bar')
            },
            { timeout: CLI.waitTimeout }
          )
        )
        .catch(Common.oops(this, true))
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
