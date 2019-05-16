/*
 * Copyright 2019 IBM Corporation
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
import { cli } from '@kui-shell/core/tests/lib/ui'

describe('helm commands', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const lists = ['list', 'ls']

  lists.forEach(list => {
    it(`should list empty releases via helm ${list}`, () => cli.do(`helm ${list}`, this.app)
      .then(cli.expectBlank)
      .catch(common.oops(this)))
  })
})
