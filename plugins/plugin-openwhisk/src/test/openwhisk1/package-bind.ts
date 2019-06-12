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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, sidecar } = ui

describe('wsk package bind tests', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create an action in a package', () => cli.do(`let package/action = x=>x`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('action', undefined, undefined, 'package'))
    .catch(common.oops(this)))

  it('should bind that package', () => cli.do(`wsk package bind package binder`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('binder'))
    .catch(common.oops(this)))

  it('should invoke binder/action', () => cli.do('wsk action invoke binder/action -p name hassle', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('action'))
    .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({ name: 'hassle' }))
    .catch(common.oops(this)))

  it('should bind that package with namespace', () => cli.do(`wsk package bind /${ui.expectedNamespace()}/package minder`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('minder'))
    .catch(common.oops(this)))

  it('should invoke binder/action', () => cli.do('wsk action invoke minder/action -p name hoffer', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('action'))
    .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({ name: 'hoffer' }))
    .catch(common.oops(this)))
})
