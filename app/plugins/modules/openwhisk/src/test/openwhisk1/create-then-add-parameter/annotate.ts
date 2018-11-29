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

import * as assert from 'assert'

import { ISuite } from '../../../../../../../../tests/lib/common'
import * as common from '../../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

describe('Modify annotations', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  // create an action, using the implicit entity type
  it('should create an action', () => cli.do(`create foo ./data/openwhisk/foo.js`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo')))

  it('should switch to annotations mode', () => cli.do('annotations', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'exec': 'nodejs:6' })))

  it('should add a parameter with explicit action name', () => cli.do('annotate x=1 in foo', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'x': 1 })))

  it('should add a parameter with implicit action name', () => cli.do('annotate y=1', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset(({ 'x': 1, 'y': 1 }))))

  it('should update a parameter value with implicit action name', () => cli.do('annotate x=2', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'x': 2, 'y': 1 })))

  it('should update an inner structure parameter with implicit action name', () => cli.do('annotate z={}', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset(({ 'x': 2, 'y': 1, 'z': {} }))))

  it('should update an inner-inner structure parameter with implicit action name', () => cli.do('annotate z.z=true', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'x': 2, 'y': 1, 'z': { 'z': true } })))

  it('should update a parameter to false, with implicit action name', () => cli.do('annotate x=false', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should update a parameter with spaces', () => cli.do('annotate humble pie="rumble tummy"', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'humble pie': 'rumble tummy', 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should update an nested parameter with spaces', () => cli.do('annotate z.humble pie="rumble tummy"', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'humble pie': 'rumble tummy', 'x': false, 'y': 1, 'z': { 'z': true, 'humble pie': 'rumble tummy' } })))

  it('should remove a nested parameter with spaces', () => cli.do('deannotate z.humble pie', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'humble pie': 'rumble tummy', 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should remove a top-level parameter with spaces', () => cli.do('deannotate humble pie', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should add a structure', () => cli.do('annotate sss={"phone home": 345}', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'sss': { 'phone home': 345 }, 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should remove that structure', () => cli.do('deannotate sss', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should add with a pathy key', () => cli.do('annotate m.n={"phone home": 345}', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'm': { 'n': { 'phone home': 345 } }, 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should remove with a pathy key', () => cli.do('deannotate m.n', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'm': {}, 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should push to a new array', () => cli.do('apush 3 to a', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'a': [3], 'm': {}, 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should push to an existing array', () => cli.do('apush 4 to a', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'a': [3, 4], 'm': {}, 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should push to a new pathy array', () => cli.do('apush 5 to m.n', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'a': [3, 4], 'm': { 'n': [5] }, 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should push to an existing pathy array', () => cli.do('apush 6 to m.n', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'a': [3, 4], 'm': { 'n': [5, 6] }, 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should push to a struct to an existing pathy array', () => cli.do('apush {"y": 7 } to m.n', this.app) // <-- some spaces in the value, for good measure
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'a': [3, 4], 'm': { 'n': [5, 6, { 'y': 7 }] }, 'x': false, 'y': 1, 'z': { 'z': true } })))

  it('should switch back to code mode', () => cli.do('code', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(text => assert.strictEqual(text.replace(/\s+/g, ''), 'functionmain(params){return{name:"Step1"+params.name};}')))
})
