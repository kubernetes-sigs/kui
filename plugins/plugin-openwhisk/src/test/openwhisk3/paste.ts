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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, sidecar } = ui

const actionName = 'foo'
const actionName2 = 'foo2'
const actionName3 = 'foo3'
const actionName4 = 'foo4'
const actionName5 = 'foo5'
const actionName6 = 'foo6'
const actionName7 = 'foo7'
const actionName8 = 'foo8'

// electron 5 seems to require localDescribe on linux
common.localDescribe('Execute commands via paste', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should paste a single line and enter the newline manually', () =>
    Promise.resolve(this.app.electron.clipboard.writeText(`let ${actionName} = x=>x`))
      .then(() => this.app.client.execute(() => document.execCommand('paste')))
      .then(() => cli.do(ui.keys.ENTER, this.app))
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))

  it('should paste a single line with terminating newline', () =>
    cli
      .paste(`let ${actionName2} = x=>x\n`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2))
      .catch(common.oops(this)))

  it('should paste a single line with multiple terminating newlines', () =>
    cli
      .paste(`let ${actionName3} = x=>x\n \n \n \n`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName3))
      .catch(common.oops(this)))

  it('should paste two lines', () =>
    cli
      .paste(`let ${actionName4} = x=>x\nlet ${actionName5} = x=>x\n`, this.app, 2)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName5))
      .catch(common.oops(this)))

  it('should get the action created by the first line', () =>
    cli
      .do(`wsk action get ${actionName4}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName4))
      .catch(common.oops(this)))

  it('should paste three lines without trailing newline', () =>
    Promise.resolve(
      this.app.electron.clipboard.writeText(
        `let ${actionName6} = x=>x\nlet ${actionName7} = x=>x\n\n\n\n   \n   \n\nlet ${actionName8} = x=>x`
      )
    )
      .then(() => this.app.client.execute(() => document.execCommand('paste')))
      .then(() => cli.do(ui.keys.ENTER, this.app))
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName8))
      .catch(common.oops(this)))

  it('should get the action created by the first line', () =>
    cli
      .do(`wsk action get ${actionName6}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName6))
      .catch(common.oops(this)))
  it('should get the action created by the second line', () =>
    cli
      .do(`wsk action get ${actionName7}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName7))
      .catch(common.oops(this)))
})
