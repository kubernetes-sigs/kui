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

import { before as commonBefore, after as commonAfter, localDescribe, ISuite, oops } from '@kui-shell/core/tests/lib/common'
import { cli } from '@kui-shell/core/tests/lib/ui'

const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))
const input = join(ROOT, 'data/k8s/empty-status-cell.txt')

localDescribe('k8s table with empty status cell', function (this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  it('should format a table with an empty status cell', () => cli.do(`kdebug "${input}"`, this.app)
    .then(cli.expectOKWith('reviews-v3-rollout'))
    .catch(oops(this)))
})
