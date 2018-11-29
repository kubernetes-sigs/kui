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

// const common = require('../../../lib/common')
// const ui = require('../../../lib/ui')
// const assert = require('assert')
// const cli = ui.cli

describe('Install and remove plugins', function () {
  // disabled for now; not compatible with webpack
  /*
  before(common.before(this))
  after(common.after(this))

  // const reload = () => this.app.client.execute('window.location.reload()')
  // const reload = N => this.app.client.click(`${ui.selectors.OUTPUT_N(N)} .clickable`)
  const reload = () => this.app.restart()

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should remove shell-sample-plugin', () => cli.do('plugin remove shell-sample-plugin', this.app)
    .then(cli.expectOKWithCustom({ passthrough: true }))
    .then(reload)
    .catch(common.oops(this)))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should try "sample hi" and fail', () => cli.do('sample hi', this.app)
    .then(cli.expectError(0, 'Command not found'))
    .catch(common.oops(this)))

  it('should install shell-sample-plugin', () => cli.do('plugin install shell-sample-plugin', this.app)
    .then(cli.expectOKWithCustom({ passthrough: true }))
    .then(reload) // reload the app, to pick up the plugin model changes
    .catch(common.oops(this)))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should try "sample hi" and succeed', () => cli.do('sample hi', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should show the sample plugin via plugin list', () => cli.do('plugin list', this.app)
    .then(cli.expectOKWith('shell-sample-plugin'))
    .catch(common.oops(this)))

  it('should show available commands with "plugin commands shell-sample-plugin", then click on a command', () => cli.do('plugin commands shell-sample-plugin', this.app)
    .then(cli.expectOKWithCustom({ expect: 'hello', passthrough: true }))
    .then(N => this.app.client.click(`${ui.selectors.OUTPUT_N(N)} .entity[data-name="hello"]`)
      .then(() => this.app.client.getText(ui.selectors.OUTPUT_N(N + 1))))
    .then(txt => assert.strictEqual(txt, 'hello world'))
    .catch(common.oops(this)))

  it('should remove shell-sample-plugin', () => cli.do('plugin remove shell-sample-plugin', this.app)
    .then(cli.expectOKWithCustom({ passthrough: true }))
    .then(reload)
    .catch(common.oops(this)))

  it('should show an error with "plugin commands shell-sample-plugin"', () => cli.do('plugin commands shell-sample-plugin', this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should try "sample hi" and fail', () => cli.do('sample hi', this.app)
    .then(cli.expectError(0, 'Command not found'))
    .catch(common.oops(this)))

  it('should successfully execute plugin compile', () => cli.do('plugin compile', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))
*/
})
