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

import { join } from 'path'
import { readFileSync } from 'fs'

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@test/lib/ui'
import * as openwhisk from '@test/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui

const file = './data/openwhisk/not-really-png.png'
const content = readFileSync(join(process.env.TEST_ROOT, file)).toString()

const actionName1 = 'foo'

describe('Invoke an action with a binary-formatted parameter', function (this: ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  // this action reverses the base64 decoding, and returns the
  // result as a string; our input isn't really binary, we're just
  // testing the auto-base64 support
  it(`should create an action`, () => cli.do(`let ${actionName1} = ({image}) => ({ text: Buffer.from(image, 'base64').toString() })`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName1))
    .catch(common.oops(this)))

  it('should invoke it with a fake-binary file argument', () => cli.do(`invoke -p image @${file}`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName1))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .activation-content`))
    .then(ui.expectStruct({ text: content }))
    .catch(common.oops(this)))
})
