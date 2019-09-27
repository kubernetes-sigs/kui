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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const HTML_WITH_JS_INPUT = `${ROOT}/data/openwhisk/hello-with-script.html`

const actionName = 'foo'

describe('Create a javascript web action via let', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  //
  // javascript web action: NO LONGER NEEDED, the html let should create the javascript action for us
  //
  /* it('should create an JS web action via let', () => CLI.command(`let ${JS_INPUT}.webjs = ${JS_INPUT_FILE}`, this.app)
        .then(ReplExpect.okWithCustom({ selector: '.entity-web-export-url' }))
       .then(selector => this.app.client.getText(selector))
       .then(href => rp({ url: href, rejectUnauthorized: false }))
       .then(content => fs.readFile(JS_INPUT_FILE, (err, data) => {
           if (err) throw err
           else assert.equal(content, data.toString())
       }))
       .then(() => this.app)
       .then(SidecarExpect.open)
       .then(SidecarExpect.showing(JS_INPUT))
       .then(SidecarExpect.badge('web'))
       .catch(Common.oops(this))) */

  it('should create an HTML web action that uses a JS web action, via let', () =>
    CLI.command(`let ${actionName} = ${HTML_WITH_JS_INPUT}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => this.app.client.url(href))
      .then(() => this.app.client.getText('#hello'))
      .then(content => assert.strictEqual(content, 'hello'))
      .then(() => Common.restart(this)) // to unsmash the .url call
      .catch(Common.oops(this)))
})
