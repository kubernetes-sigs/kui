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

import { ISuite } from '../../../../../../../tests/lib/common'
import * as common from '../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

const fileWithSpaces = './data/openwhisk/dir with spaces/foo.js'
const fileWithSpacesAndQuotes = [
  './data/openwhisk/"dir with spaces"/foo.js',
  '"./data/openwhisk/dir with spaces"/foo.js'
]

const actionName1 = 'foo'
const actionName2 = 'foo2.funnel'
const actionName3 = 'foo3.crypto.cash'
const packageName1 = 'ppp'
const packageName2 = 'ppp.fun'

describe('Create an action via let with dots', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  for (let idx = 0; idx < fileWithSpacesAndQuotes.length; idx++) {
    const actionName1 = `foobar.${idx}`
    const actionName2 = `foobar.2.${idx}`
    const actionName3 = `foobar.3 ${idx}` // with a space

    it(`should create an action with spaces in the filename, variant ${idx}a`, () => cli.do(`let ${actionName1} = ${fileWithSpacesAndQuotes[idx]}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName1)))

    it(`should create an action with spaces in the filename, variant ${idx}b`, () => cli.do(`let ${actionName2} = "${fileWithSpacesAndQuotes[idx]}"`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2)))

    it(`should create an action with spaces in the filename, variant ${idx}c`, () => cli.do(`let "${actionName3}" = "${fileWithSpacesAndQuotes[idx]}"`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName3)))
  }

  it('should create an action with dots in the filename, with external quotes', () => cli.do(`let ${actionName1} = "${fileWithSpaces}"`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName1)))

  it('should create a packaged action with dots, variant 1', () => cli.do(`let ${packageName1}/${actionName1} = "${fileWithSpaces}"`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName1, undefined, undefined, packageName1)))

  it('should create a packaged action with dots, variant 2', () => cli.do(`let "${packageName1}/${actionName2}" = "${fileWithSpaces}"`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName2, undefined, undefined, packageName1)))

  it('should create a packaged action with dots, variant 3', () => cli.do(`let "${packageName1}/${actionName3}" = x=>x`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName3, undefined, undefined, packageName1)))

  it('should create a packaged action with dots, variant 4', () => cli.do(`let "${packageName2}/${actionName1}" = x=>x`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName1, undefined, undefined, packageName2)))

  it('should create a packaged action with dots, variant 5', () => cli.do(`let "${packageName2}/${actionName2}" = "${fileWithSpaces}"`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName2, undefined, undefined, packageName2)))
})
