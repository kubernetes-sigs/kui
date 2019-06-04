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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname, normalize } from 'path'
const { cli, selectors, sidecar } = ui
const { localDescribe } = common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

localDescribe('Change shell directory via cd', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should execute cd data', () => cli.do(`cd ${ROOT}/data`, this.app)
    .then(cli.expectOKWithString('data')))

  it('should create an action in the data directory', () => cli.do(`wsk action create long openwhisk/long.js`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('long'))
    .catch(common.oops(this)))

  it('should execute cd - to change to previous dir', () => cli.do(`cd -`, this.app)
    .then(cli.expectOKWithString(normalize(process.env.TEST_ROOT))))

  // now we should be able to change back to data and re-do the action create
  it('should execute cd data', () => cli.do(`cd ${ROOT}/data`, this.app)
    .then(cli.expectOKWithString('data')))

  it('should create an action in the data directory', () => cli.do(`wsk action create long2 openwhisk/long.js`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('long2'))
    .catch(common.oops(this)))

  it('should execute cd without arguments', () => cli.do(`cd`, this.app)
    .then(cli.expectOKWithString(normalize(process.env.HOME))))
})
