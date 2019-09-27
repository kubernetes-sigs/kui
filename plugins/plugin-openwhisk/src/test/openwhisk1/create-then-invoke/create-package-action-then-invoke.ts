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

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

// TODO: webpack test
localDescribe('Create a packaged action then invoke with implicit entity', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action, using the implicit entity type
  it('should create a packaged action', () =>
    CLI.command(`let ppp/foo = ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo', undefined, undefined, 'ppp'))
      .catch(Common.oops(this)))

  // invoke it asynchronously with no params
  it('should async that action', () =>
    CLI.command(`wsk action async`, this.app)
      .then(ReplExpect.okWithCustom(CLI.makeCustom('.activationId', '')))
      .then(async selector => {
        const activationId = await this.app.client.getText(selector)
        await this.app.client.click(selector)
        return SidecarExpect.open(this.app).then(SidecarExpect.showing('foo', activationId))
      })
      .catch(Common.oops(this)))

  it('should get/open the package', () =>
    CLI.command(`wsk package get ppp`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('ppp'))
      .catch(Common.oops(this)))

  // re-open the packaged action and invoke it, for good measure
  it('should create re-open the packaged action', () =>
    CLI.command(`wsk action get ppp/foo`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo', undefined, undefined, 'ppp'))
      .catch(Common.oops(this)))

  // invoke it asynchronously with no params
  it('should async that action', () =>
    CLI.command(`wsk action async`, this.app)
      .then(ReplExpect.okWithCustom(CLI.makeCustom('.activationId', '')))
      .then(async selector => {
        const activationId = await this.app.client.getText(selector)
        await this.app.client.click(selector)
        return SidecarExpect.open(this.app).then(SidecarExpect.showing('foo', activationId))
      })
      .catch(Common.oops(this)))
})
