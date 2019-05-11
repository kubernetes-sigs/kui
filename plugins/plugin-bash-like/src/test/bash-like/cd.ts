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

import * as expandHomeDir from 'expand-home-dir'

import { ISuite } from '@kui-shell/core/tests/lib/common'
import * as common from '@kui-shell/core/tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, selectors, sidecar } = ui
const { localDescribe } = common

import { existsSync, unlinkSync } from 'fs'
import { dirname, join, normalize } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/core/tests/package.json'))
const rootRelative = dir => join(ROOT, dir)

localDescribe('Change local shell directory', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  const previous = () => {
    it(`should execute 'cd -' to change to previous dir`, () => cli.do(`cd -`, this.app)
       .then(cli.expectOKWithString(normalize(process.env.TEST_ROOT)))
       .catch(common.oops(this)))
  }

  let offset = 0
  while (existsSync(`/tmp/foo bar${offset}`)) {
    offset++
  }

  const bar = `bar${offset}`
  it('should mkdir with spaces', () => cli.do(`mkdir /tmp/"foo ${bar}"`, this.app)
     .then(cli.expectOK)
     .catch(common.oops(this)))

  it(`should execute 'cd /tmp/"foo ${bar}"'`, () => cli.do(`cd /tmp/"foo ${bar}"`, this.app)
     .then(cli.expectOKWithString('foo bar'))
     .catch(common.oops(this)))

  previous()

  it(`should execute 'cd "/tmp/foo ${bar}"'`, () => cli.do(`cd "/tmp/foo ${bar}"`, this.app)
     .then(cli.expectOKWithString('foo bar'))
     .catch(common.oops(this)))

  previous()

  it(`should execute 'cd /tmp/foo\ ${bar}'`, () => cli.do(`cd /tmp/foo\\ ${bar}`, this.app)
     .then(cli.expectOKWithString('foo bar'))
     .catch(common.oops(this)))

  // ls with space and trailing slash; see https://github.com/IBM/kui/issues/1389
  it(`should execute 'ls /tmp/foo\ ${bar}/'`, () => cli.do(`ls /tmp/foo\\ ${bar}/`, this.app)
     .then(cli.expectOKWithAny)
     .catch(common.oops(this)))
  it(`should execute 'ls /tmp/"foo ${bar}"/'`, () => cli.do(`ls /tmp/"foo ${bar}"/`, this.app)
     .then(cli.expectOKWithAny)
     .catch(common.oops(this)))

  previous()

  it(`should execute 'cd data'`, () => cli.do(`cd ${ROOT}/data`, this.app)
    .then(cli.expectOKWithString(rootRelative('data')))
    .catch(common.oops(this)))

  previous()

  it(`should execute 'cd -' again to change to previous-previous dir`, () => cli.do(`cd -`, this.app)
    .then(cli.expectOKWithString(rootRelative('data')))
    .catch(common.oops(this)))

  previous()

  // now we should be able to change back to data
  it(`should execute 'cd data'`, () => cli.do(`cd ${ROOT}/data`, this.app)
    .then(cli.expectOKWithString(rootRelative('data')))
    .catch(common.oops(this)))

  it(`should handle cd error`, () => cli.do(`cd notexist`, this.app)
    .then(cli.expectError(500, 'cd: no such file or directory: notexist'))
    .catch(common.oops(this)))

  it(`should handle cd error`, () => cli.do(`cd ../notexist`, this.app)
    .then(cli.expectError(500, 'cd: no such file or directory: ../notexist'))
    .catch(common.oops(this)))

  it(`should handle cd error`, () => cli.do(`cd -/..`, this.app)
    .then(cli.expectError(499, 'Unsupported optional parameter /'))
    .catch(common.oops(this)))

  it(`should execute cd without arguments`, () => cli.do('cd', this.app)
    .then(cli.expectOKWithString(expandHomeDir('~')))
    .catch(common.oops(this)))

  it(`should execute cd ${ROOT}`, () => cli.do(`cd ${ROOT}`, this.app)
    .then(cli.expectOKWithString(ROOT))
    .catch(common.oops(this)))
})
