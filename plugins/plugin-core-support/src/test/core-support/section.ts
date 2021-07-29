/*
 * Copyright 2021 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Util } from '@kui-shell/test'

/**
 * re: xdescribe, we have currently disabled section blocks.
 * https://github.com/kubernetes-sigs/kui/pull/7827
 */
xdescribe('section blocks', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const section = '\u00A7'

  it('should show version in the second block and mark this block as section', () =>
    CLI.command('version', this.app)
      .then(async res => {
        await ReplExpect.okWithCustom({ expect: Common.expectedVersion })(res)
        await Util.markBlockAsSection(res)
        await CLI.expectInputContext(res, res.count + 1, `${section}1.1`)
      })
      .catch(Common.oops(this, true)))

  it('should show version in the next block, expect the correct section number, and mark this block as a new section', () =>
    CLI.command('version', this.app)
      .then(async res => {
        await ReplExpect.okWithCustom({ expect: Common.expectedVersion })(res)
        await CLI.expectInputContext(res, res.count, `${section}1.2`)
        await Util.markBlockAsSection(res)
        await CLI.expectInputContext(res, res.count + 1, `${section}2.1`)
      })
      .catch(Common.oops(this, true)))
})
