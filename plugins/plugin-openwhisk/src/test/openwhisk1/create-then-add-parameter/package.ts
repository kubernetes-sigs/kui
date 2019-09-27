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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'
const packageName = 'ppp'

// TODO: webpack test
localDescribe('Add parameters to packages', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action, using the implicit entity type
  it('should create a packaged action', () =>
    CLI.command(`let ${packageName}/${actionName} = ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName, undefined, undefined, packageName)))

  it('should add a parameter with explicit package name', () =>
    CLI.command(`wsk package set x=1 in ${packageName}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(packageName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .package-source`))
      .then(Util.expectStruct({ x: 1 })))

  it('should add a parameter with implicit package name', () =>
    CLI.command('wsk package set y=1', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(packageName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .package-source`))
      .then(Util.expectStruct({ x: 1, y: 1 })))

  it('should update a parameter value with implicit package name', () =>
    CLI.command('wsk package set x=2', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(packageName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .package-source`))
      .then(Util.expectStruct({ x: 2, y: 1 })))
})
