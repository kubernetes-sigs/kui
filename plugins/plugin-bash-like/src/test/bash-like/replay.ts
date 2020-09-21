/*
 * Copyright 2020 IBM Corporation
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

describe(`bash-like snapshot and replay ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // should pwd
  let curentDirectory: string
  it('should echo current directory', () =>
    CLI.command('pwd', this.app)
      .then(ReplExpect.okWithAny)
      .then(async () => {
        curentDirectory = await this.app.client.getText(Selectors.OUTPUT_LAST_PTY)
      })
      .catch(Common.oops(this, true)))

  it('should snapshot', () =>
    CLI.command('snapshot /tmp/test.kui', this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should refresh', () => Common.refresh(this))

  it('should replay', async () => {
    try {
      await CLI.command('replay /tmp/test.kui', this.app)

      // verify the pwd command replay
      let idx = 0
      await this.app.client.waitUntil(async () => {
        const txt = await this.app.client.getText(Selectors.OUTPUT_LAST_PTY)
        if (++idx > 5) {
          console.error(`still waiting for expected=${curentDirectory}; actual=${txt}`)
        }
        return txt === curentDirectory
      }, CLI.waitTimeout)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
