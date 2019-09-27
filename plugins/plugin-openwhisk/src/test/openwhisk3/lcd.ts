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

import { dirname, normalize } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

localDescribe('Change shell directory via cd', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should execute cd data', () => CLI.command(`cd ${ROOT}/data`, this.app).then(ReplExpect.okWithString('data')))

  it('should create an action in the data directory', () =>
    CLI.command(`wsk action create long openwhisk/long.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('long'))
      .catch(Common.oops(this)))

  it('should execute cd - to change to previous dir', () =>
    CLI.command(`cd -`, this.app).then(ReplExpect.okWithString(normalize(process.env.TEST_ROOT))))

  // now we should be able to change back to data and re-do the action create
  it('should execute cd data', () => CLI.command(`cd ${ROOT}/data`, this.app).then(ReplExpect.okWithString('data')))

  it('should create an action in the data directory', () =>
    CLI.command(`wsk action create long2 openwhisk/long.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('long2'))
      .catch(Common.oops(this)))

  it('should execute cd without arguments', () =>
    CLI.command(`cd`, this.app).then(ReplExpect.okWithString(normalize(process.env.HOME))))
})
