/*
 * Copyright 2020 IBM Corporation
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

import * as assert from 'assert'
import { dirname } from 'path'

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/plugin-core-support/package.json'))

describe('commentary command', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const addComment = () => {
    it('should show comment with file', () =>
      CLI.command(`commentary -f=${ROOT}/tests/data/comment.md`, this.app)
        .then(async () => {
          await this.app.client.waitForVisible(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAl_CARD}`)
          const head1: string = await this.app.client.getText(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAl_CARD} h1`)
          const head2: string = await this.app.client.getText(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAl_CARD} h2`)
          return assert.ok(head1 === 'The Kui Framework for Graphical Terminals' && head2 === 'Installation')
        })
        .catch(Common.oops(this)))
  }

  addComment()
  it('should show version', () =>
    CLI.command('version', this.app)
      .then(ReplExpect.okWithCustom({ expect: Common.expectedVersion }))
      .catch(Common.oops(this)))
  addComment()
})
