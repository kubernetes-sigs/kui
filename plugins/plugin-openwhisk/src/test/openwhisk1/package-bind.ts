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

/**
 * tests wsk package bind
 *
 */

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('wsk package bind tests', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action in a package', () =>
    CLI.command(`let package/action = x=>x`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('action', undefined, undefined, 'package'))
      .catch(Common.oops(this)))

  it('should bind that package', () =>
    CLI.command(`wsk package bind package binder`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('binder'))
      .catch(Common.oops(this)))

  it('should invoke binder/action', () =>
    CLI.command('wsk action invoke binder/action -p name hassle', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('action'))
      .then(app => app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ name: 'hassle' }))
      .catch(Common.oops(this)))

  it('should bind that package with namespace', () =>
    CLI.command(`wsk package bind /${openwhisk.expectedNamespace()}/package minder`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('minder'))
      .catch(Common.oops(this)))

  it('should invoke binder/action', () =>
    CLI.command('wsk action invoke minder/action -p name hoffer', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('action'))
      .then(app => app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ name: 'hoffer' }))
      .catch(Common.oops(this)))
})
