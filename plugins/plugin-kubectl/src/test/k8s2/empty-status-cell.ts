/*
 * Copyright 2019 The Kubernetes Authors
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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const input = join(ROOT, 'data/k8s/empty-status-cell.txt')

Common.localDescribe('k8s table with empty status cell', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  xit('should format a table with an empty status cell', () =>
    CLI.command(`kdebug "${input}"`, this.app).then(ReplExpect.okWith('reviews-v3-rollout')).catch(Common.oops(this)))
})
