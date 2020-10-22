/*
 * Copyright 2018 IBM Corporation
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

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName = 'foo'
const actionName2 = 'foo2'

describe('wsk action invoke -r', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action', () =>
    CLI.command(`let ${actionName} = x=>x`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it('should create another action', () =>
    CLI.command(`let ${actionName2} = x=>x`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))

  it(`should invoke ${actionName} with -r`, () =>
    CLI.command(`wsk action invoke ${actionName} -r -p x 3`, this.app)
      .then(
        ReplExpect.okWithCustom<string>({ selector: '.json' })
      )
      .then(selector => this.app.client.$(selector))
      .then(_ => _.getText())
      .then(Util.expectStruct({ x: 3 }))
      .catch(Common.oops(this)))

  it(`should invoke ${actionName} with --result`, () =>
    CLI.command(`wsk action invoke ${actionName} --result --param x 3`, this.app)
      .then(
        ReplExpect.okWithCustom<string>({ selector: '.json' })
      )
      .then(selector => this.app.client.$(selector))
      .then(_ => _.getText())
      .then(Util.expectStruct({ x: 3 }))
      .catch(Common.oops(this)))

  it(`should invoke ${actionName} with -br`, () =>
    CLI.command(`wsk action invoke ${actionName} -p x 3 -br`, this.app)
      .then(
        ReplExpect.okWithCustom<string>({ selector: '.json' })
      )
      .then(selector => this.app.client.$(selector))
      .then(_ => _.getText())
      .then(Util.expectStruct({ x: 3 }))
      .catch(Common.oops(this)))

  it(`should invoke ${actionName} with -rb`, () =>
    CLI.command(`wsk action invoke ${actionName} -rb --param x 3`, this.app)
      .then(
        ReplExpect.okWithCustom<string>({ selector: '.json' })
      )
      .then(selector => this.app.client.$(selector))
      .then(_ => _.getText())
      .then(Util.expectStruct({ x: 3 }))
      .catch(Common.oops(this)))

  it(`should invoke ${actionName} with --blocking --result`, () =>
    CLI.command(`wsk action invoke ${actionName} --blocking --result -p x 3`, this.app)
      .then(
        ReplExpect.okWithCustom<string>({ selector: '.json' })
      )
      .then(selector => this.app.client.$(selector))
      .then(_ => _.getText())
      .then(Util.expectStruct({ x: 3 }))
      .catch(Common.oops(this)))
})
