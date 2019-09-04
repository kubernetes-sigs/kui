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

import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const { rp } = common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'
const actionName2 = 'foo2'
const actionName3 = 'foo3'
const actionName4 = 'foo4'
const actionName5 = 'foo5'
const actionName6 = 'foo6'
const actionName7 = 'foo7'
const packageName = 'ppp'

describe('Webbify actions', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create an action', () =>
    cli
      .do(`let ${actionName} = x=>x`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName)))

  it('should create another action', () =>
    cli
      .do(`let ${actionName2} = x=>x`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2)))

  it('should webbify with implicit action', () =>
    cli
      .do(`webbify`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: `${href}?message=test`, rejectUnauthorized: false })) // provide an input to the remote request
      .then(ui.expectSubset({ message: 'test' })) // and expect it right back, since the action is an echo action
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2)))

  it('should webbify with explicit action', () =>
    cli
      .do(`webbify ${actionName}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: `${href}?message2=test2`, rejectUnauthorized: false })) // provide an input to the remote request
      .then(ui.expectSubset({ message2: 'test2' })) // and expect it right back, since the action is an echo action
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName)))

  it('should create a packaged action', () =>
    cli
      .do(`let ${packageName}/${actionName3} = x=>x`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName3, undefined, undefined, packageName)))

  it('should create another packaged action', () =>
    cli
      .do(`let ${packageName}/${actionName4} = x=>x`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName4, undefined, undefined, packageName)))

  it('should webbify a packaged action with implicit action', () =>
    cli
      .do(`webbify`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: `${href}?message3=test3`, rejectUnauthorized: false })) // provide an input to the remote request
      .then(ui.expectSubset({ message3: 'test3' })) // and expect it right back, since the action is an echo action
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName4, undefined, undefined, packageName)))

  it('should webbify a packaged action with explicit action', () =>
    cli
      .do(`webbify ${packageName}/${actionName3}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: `${href}?message4=test4`, rejectUnauthorized: false })) // provide an input to the remote request
      .then(ui.expectSubset({ message4: 'test4' })) // and expect it right back, since the action is an echo action
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName3, undefined, undefined, packageName)))

  it('should create an action for http', () =>
    cli
      .do(`let ${actionName5} = x=>({body: x.message})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName5)))

  it('should create another action for http', () =>
    cli
      .do(`let ${actionName6} = x=>({body: x.message})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName6)))

  it('should webbify as http with implicit action', () =>
    cli
      .do(`webbify as http`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: `${href}?message=test5`, rejectUnauthorized: false })) // provide an input to the remote request
      .then(response => assert.strictEqual(response, 'test5')) // and expect it right back
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName6)))

  it('should webbify as http with explicit action', () =>
    cli
      .do(`webbify ${actionName5} as http`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: `${href}?message=test6`, rejectUnauthorized: false })) // provide an input to the remote request
      .then(response => assert.strictEqual(response, 'test6')) // and expect it right back
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName5)))

  //
  // not quite webbify, but closely related; web action via action create --web
  //
  it('should create a web action via action create --web', () =>
    cli
      .do(`wsk action create ${actionName7} ${ROOT}/data/openwhisk/foo.js --web`, this.app)
      // make sure the REPL output has the proper href:
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href =>
        rp({
          uri: href,
          qs: { name: 'openwhisk' },
          json: true,
          rejectUnauthorized: false
        })
      )
      .then(ui.expectStruct({ name: 'Step1 openwhisk' }, true))
      .then(() => this.app)
      // make sure the sidecar is open and showing the web accessible badge
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName7))
      .then(sidecar.expectBadge('web'))
      // finally, make sure the "web accessible" badge also has the proper href:
      .then(() => this.app.client.getAttribute(`${ui.selectors.SIDECAR} .badges .entity-web-export-url`, 'href'))
      .then(href =>
        rp({
          uri: href,
          qs: { name: 'openwhisk' },
          json: true,
          rejectUnauthorized: false
        })
      )
      .then(ui.expectStruct({ name: 'Step1 openwhisk' }, true))
      .catch(common.oops(this)))
})
