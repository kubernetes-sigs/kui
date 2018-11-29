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

import * as path from 'path'
import * as expandHomeDir from 'expand-home-dir'

import { ISuite } from '../../../../tests/lib/common'
import * as common from '../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

describe('Change local shell directory', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  const commands = [ 'cd', 'lcd' ]

  const root = path.normalize(process.env.TEST_ROOT)
  const rootRelative = dir => path.join(root, dir)

  commands.forEach(cd => {
    it(`should execute '${cd} data'`, () => cli.do(`${cd} data`, this.app)
      .then(cli.expectOKWithString(rootRelative('data')))
      .catch(common.oops(this)))

    it(`should execute '${cd} -' to change to previous dir`, () => cli.do(`${cd} -`, this.app)
      .then(cli.expectOKWithString(root))
      .catch(common.oops(this)))

    it(`should execute '${cd} -' again to change to previous-previous dir`, () => cli.do(`${cd} -`, this.app)
      .then(cli.expectOKWithString(rootRelative('data')))
      .catch(common.oops(this)))

    it(`should execute '${cd} -' one more time to change to previous dir`, () => cli.do(`${cd} -`, this.app)
      .then(cli.expectOKWithString(root))
      .catch(common.oops(this)))

    // now we should be able to change back to data
    it(`should execute '${cd} data'`, () => cli.do(`${cd} data`, this.app)
      .then(cli.expectOKWithString(rootRelative('data')))
      .catch(common.oops(this)))

    it(`should execute ${cd} without arguments`, () => cli.do(cd, this.app)
      .then(cli.expectOKWithString(expandHomeDir('~')))
      .catch(common.oops(this)))

    it(`should execute '${cd} ${path.resolve(process.env.TEST_ROOT)}`, () => cli.do(`${cd} ${path.resolve(process.env.TEST_ROOT)}`, this.app)
      .then(cli.expectOKWithString(root))
      .catch(common.oops(this)))
  })
})
