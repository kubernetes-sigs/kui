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

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const fileWithSpaces = `${ROOT}/data/openwhisk/dir with spaces/foo.js`
const fileWithSpacesAndQuotes = [
  `${ROOT}/data/openwhisk/"dir with spaces"/foo.js`,
  `"${ROOT}/data/openwhisk/dir with spaces"/foo.js`
]

const actionName1 = 'foo'
const actionName2 = 'foo2.funnel'
const actionName3 = 'foo3.crypto.cash'
const packageName1 = 'ppp'
const packageName2 = 'ppp.fun'

describe('Create an action via let with dots', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  for (let idx = 0; idx < fileWithSpacesAndQuotes.length; idx++) {
    const actionName1 = `foobar.${idx}`
    const actionName2 = `foobar.2.${idx}`
    const actionName3 = `foobar.3 ${idx}` // with a space

    it(`should create an action with spaces in the filename, variant ${idx}a`, () =>
      CLI.command(`let ${actionName1} = ${fileWithSpacesAndQuotes[idx]}`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName1))
        .catch(Common.oops(this)))

    it(`should create an action with spaces in the filename, variant ${idx}b`, () =>
      CLI.command(`let ${actionName2} = "${fileWithSpacesAndQuotes[idx]}"`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName2))
        .catch(Common.oops(this)))

    it(`should create an action with spaces in the filename, variant ${idx}c`, () =>
      CLI.command(`let "${actionName3}" = "${fileWithSpacesAndQuotes[idx]}"`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName3))
        .catch(Common.oops(this)))
  }

  it('should create an action with dots in the filename, with external quotes', () =>
    CLI.command(`let ${actionName1} = "${fileWithSpaces}"`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .catch(Common.oops(this)))

  it('should create a packaged action with dots, variant 1', () =>
    CLI.command(`let ${packageName1}/${actionName1} = "${fileWithSpaces}"`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1, undefined, undefined, packageName1))
      .catch(Common.oops(this)))

  it('should create a packaged action with dots, variant 2', () =>
    CLI.command(`let "${packageName1}/${actionName2}" = "${fileWithSpaces}"`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2, undefined, undefined, packageName1))
      .catch(Common.oops(this)))

  it('should create a packaged action with dots, variant 3', () =>
    CLI.command(`let "${packageName1}/${actionName3}" = x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName3, undefined, undefined, packageName1))
      .catch(Common.oops(this)))

  it('should create a packaged action with dots, variant 4', () =>
    CLI.command(`let "${packageName2}/${actionName1}" = x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1, undefined, undefined, packageName2))
      .catch(Common.oops(this)))

  it('should create a packaged action with dots, variant 5', () =>
    CLI.command(`let "${packageName2}/${actionName2}" = "${fileWithSpaces}"`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2, undefined, undefined, packageName2))
      .catch(Common.oops(this)))
})
