/*
 * Copyright 2017-19 IBM Corporation
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

Common.localDescribe('plugin manager', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // const reload = () => this.app.client.execute('window.location.reload()')
  // const reload = N => this.app.client.click(`${ui.selectors.OUTPUT_N(N)} .clickable`)
  const reload = () => Common.refresh(this)

  it('should remove @kui-shell/plugin-sample', () =>
    CLI.command('plugin remove @kui-shell/plugin-sample', this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(reload)
      .catch(Common.oops(this, true)))

  it('should try "hi" and fail', () =>
    CLI.command('hi', this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this, true)))

  it('should install @kui-shell/plugin-sample', () =>
    CLI.command('plugin install @kui-shell/plugin-sample', this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(reload) // reload the app, to pick up the plugin model changes
      .catch(Common.oops(this, true)))

  it('should try "hi" and succeed', () =>
    CLI.command('hi', this.app)
      .then(ReplExpect.okWithString('hello world'))
      .catch(Common.oops(this, true)))

  it('should try "hello" and succeed', () =>
    CLI.command('hello', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true)))

  it('should show the sample plugin via plugin list', () =>
    CLI.command('plugin list', this.app)
      .then(ReplExpect.okWith('@kui-shell/plugin-sample'))
      .catch(Common.oops(this, true)))

  it('should show available commands with "plugin commands @kui-shell/plugin-sample", then click on a command', () =>
    CLI.command('plugin commands @kui-shell/plugin-sample', this.app)
      .then(ReplExpect.okWithCustom({ expect: 'hello', passthrough: true }))
      .then(async (N: number) => {
        await this.app.client.click(`${Selectors.OUTPUT_N(N)} .entity[data-name="hello"] .clickable`)
        await this.app.client.waitForExist(Selectors.OUTPUT_N(N + 1))
        await this.app.client.waitForText(Selectors.OUTPUT_N(N + 1))
        return this.app.client.getText(Selectors.OUTPUT_N(N + 1))
      })
      .then(txt => assert.strictEqual(txt, 'hello world'))
      .catch(Common.oops(this, true)))

  it('should remove @kui-shell/plugin-sample', () =>
    CLI.command('plugin remove @kui-shell/plugin-sample', this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(reload)
      .catch(Common.oops(this, true)))

  it('should show an error with "plugin commands @kui-shell/plugin-sample"', () =>
    CLI.command('plugin commands @kui-shell/plugin-sample', this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this, true)))

  it('should try "hi" and fail', () =>
    CLI.command('hi', this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this, true)))

  it('should successfully execute plugin compile', () =>
    CLI.command('plugin compile', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true)))
})
