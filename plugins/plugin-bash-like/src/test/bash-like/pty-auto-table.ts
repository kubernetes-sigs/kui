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

import { dirname, join } from 'path'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'

const ROOT = dirname(require.resolve('@kui-shell/plugin-bash-like/package.json'))
const { cli } = ui
const { dockerDescribe } = common

dockerDescribe('xterm auto-table', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  // let's pull a very specific (and somehow older) version so that we
  // can recognize it as new in our docker images call
  const alpineVersion = '3.6.5'
  const alpine = `alpine:${alpineVersion}`

  it('should cat a table from a table and have it displayed as a table', () =>
    cli
      .do(`cat ${join(ROOT, 'tests/data/table-with-duplicate-columns.txt')}`, this.app)
      .then(cli.expectOKWith('reviews-v1v2-e2etestcase1-1'))
      .catch(common.oops(this)))

  it('should remove the previous alpine, from previous tests', () =>
    cli.do(`docker rmi ${alpine}`, this.app).catch(common.oops(this)))

  it(`should pull alpine docker image ${alpine}`, () =>
    cli
      .do(`docker pull ${alpine}`, this.app)
      .then(cli.expectOKWithAny)
      .catch(common.oops(this)))

  it('should list alpine image as a kui table', () =>
    cli
      .do(`docker images ${alpine}`, this.app)
      .then(cli.expectOKWith('alpine'))
      .catch(common.oops(this)))
})
