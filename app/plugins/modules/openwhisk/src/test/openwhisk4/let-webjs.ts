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

import { ISuite } from '../../../../../../../tests/lib/common'
import * as common from '../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui
const { rp } = common

const HTML_WITH_JS_INPUT = './data/openwhisk/hello-with-script.html'

const actionName = 'foo'

describe('Create a javascript web action via let', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  //
  // javascript web action: NO LONGER NEEDED, the html let should create the javascript action for us
  //
  /* it('should create an JS web action via let', () => cli.do(`let ${JS_INPUT}.webjs = ${JS_INPUT_FILE}`, this.app)
        .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
       .then(selector => this.app.client.getText(selector))
       .then(href => rp({ url: href, rejectUnauthorized: false }))
       .then(content => fs.readFile(JS_INPUT_FILE, (err, data) => {
           if (err) throw err
           else assert.equal(content, data.toString())
       }))
       .then(() => this.app)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(JS_INPUT))
       .then(sidecar.expectBadge('web'))
       .catch(common.oops(this))) */

  it('should create an HTML web action that uses a JS web action, via let', () => cli.do(`let ${actionName} = ${HTML_WITH_JS_INPUT}`, this.app)
    .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
    .then(selector => this.app.client.getText(selector))
    .then(href => this.app.client.url(href))
    .then(() => this.app.client.getText('#hello'))
    .then(content => assert.strictEqual(content, 'hello'))
    .catch(common.oops(this)))
})
