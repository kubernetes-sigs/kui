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

import { Common, CLI, Keys, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName = 'foo'
const actionName2 = 'foo2'
const actionName3 = 'foo3'
const actionName4 = 'foo4'
const actionName5 = 'foo5'
const actionName6 = 'foo6'
const actionName7 = 'foo7'
const actionName8 = 'foo8'

// electron 5 seems to require localDescribe on linux
Common.localDescribe('Execute commands via paste', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should paste a single line and enter the newline manually', () =>
    Promise.resolve(this.app.electron.clipboard.writeText(`let ${actionName} = x=>x`))
      .then(() => this.app.client.execute(() => document.execCommand('paste')))
      .then(() => CLI.command(Keys.ENTER, this.app))
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it('should paste a single line with terminating newline', () =>
    CLI.paste(`let ${actionName2} = x=>x\n`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))

  it('should paste a single line with multiple terminating newlines', () =>
    CLI.paste(`let ${actionName3} = x=>x\n \n \n \n`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName3))
      .catch(Common.oops(this)))

  it('should paste two lines', () =>
    CLI.paste(`let ${actionName4} = x=>x\nlet ${actionName5} = x=>x\n`, this.app, 2)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName5))
      .catch(Common.oops(this)))

  it('should get the action created by the first line', () =>
    CLI.command(`wsk action get ${actionName4}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName4))
      .catch(Common.oops(this)))

  it('should paste three lines without trailing newline', () =>
    Promise.resolve(
      this.app.electron.clipboard.writeText(
        `let ${actionName6} = x=>x\nlet ${actionName7} = x=>x\n\n\n\n   \n   \n\nlet ${actionName8} = x=>x`
      )
    )
      .then(() => this.app.client.execute(() => document.execCommand('paste')))
      .then(() => CLI.command(Keys.ENTER, this.app))
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName8))
      .catch(Common.oops(this)))

  it('should get the action created by the first line', () =>
    CLI.command(`wsk action get ${actionName6}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName6))
      .catch(Common.oops(this)))
  it('should get the action created by the second line', () =>
    CLI.command(`wsk action get ${actionName7}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName7))
      .catch(Common.oops(this)))
})
