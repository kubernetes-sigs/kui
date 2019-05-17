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

import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui

describe('wsk trigger fire tests', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  // create an action, using the implicit entity type
  it('should create trigger', () => cli.do(`wsk trigger create ttt -p tvar 2`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('ttt'))
    .catch(common.oops(this)))

  it('should create action', () => cli.do('let aaa = x=>x -p avar 3', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('aaa'))
    .catch(common.oops(this)))

  it('should create rule', () => cli.do(`wsk rule create rrr ttt aaa`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('rrr'))
    .catch(common.oops(this)))

  it('should fire the trigger', () => cli.do('wsk trigger fire ttt', this.app)
    .then(cli.expectOKWithCustom({ selector: '.clickable.activationId' }))
    .then(selector => this.app.client.click(selector))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('ttt'))
    .then(() => cli.do('wsk activation logs', this.app))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('ttt'))
    .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(logs => JSON.parse(logs))
    .then(logs => logs.activationId)
    .then(activationId => cli.do(`wsk activation get ${activationId}`, this.app))
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('aaa'))
    .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({ tvar: 2, avar: 3 }))
    .catch(common.oops(this)))

  it('should fire the trigger with fire parameter', () => cli.do('wsk trigger fire ttt -p fvar 4', this.app)
    .then(cli.expectOKWithCustom({ selector: '.clickable.activationId' }))
    .then(selector => this.app.client.click(selector))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('ttt'))
    .then(() => cli.do('wsk activation logs', this.app))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('ttt'))
    .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(logs => JSON.parse(logs))
    .then(logs => logs.activationId)
    .then(activationId => cli.do(`wsk activation get ${activationId}`, this.app))
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('aaa'))
    .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({ tvar: 2, avar: 3, fvar: 4 }))
    .catch(common.oops(this)))
})
