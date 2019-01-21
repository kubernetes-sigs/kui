/*
 * Copyright 2018 IBM Corporation
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
import * as common from '@kui/core/tests/lib/common'
import * as openwhisk from '@kui-plugin/openwhisk/tests/lib/openwhisk/openwhisk'
import * as ui from '@kui/core/tests/lib/ui'
const cli = ui.cli

describe('composer config', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  /** app config */
  const getConfig = cmd => it(`should show app configuration via "${cmd}"`, () => cli.do(cmd, this.app)
    .then(cli.expectOKWithCustom({ expect: 'Composer version' }))
    .catch(common.oops(this)))

  getConfig('app properties')
  getConfig('app props')
  getConfig('app config')
  getConfig('wsk app properties')
  getConfig('wsk app props')
  getConfig('wsk app config')
})
