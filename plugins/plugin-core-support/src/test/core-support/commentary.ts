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

describe('commentary and replay', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const verifyComment = async () => {
    await this.app.client.waitForVisible(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`)
    const title: string = await this.app.client.getText(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD_TITLE}`)
    assert.strictEqual(title, 'hello there')

    const head1: string = await this.app.client.getText(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD} h1`)
    assert.strictEqual(head1, 'The Kui Framework for Graphical Terminals')

    const head2: string = await this.app.client.getText(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD} h2`)
    assert.strictEqual(head2, 'Installation')
  }
  const addComment = () => {
    it('should show comment with file', () =>
      CLI.command(`commentary --title "hello there" -f=${ROOT}/tests/data/comment.md`, this.app)
        .then(() => verifyComment())
        .catch(Common.oops(this, true)))
  }

  addComment()
  it('should show version', () =>
    CLI.command('version', this.app)
      .then(ReplExpect.okWithCustom({ expect: Common.expectedVersion }))
      .catch(Common.oops(this, true)))
  addComment()

  it('should snapshot', () =>
    CLI.command('snapshot /tmp/test.kui', this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should refresh', () => Common.refresh(this))

  it('should replay', () =>
    CLI.command('replay /tmp/test.kui', this.app)
      .then(() => verifyComment())
      .catch(Common.oops(this, true)))
})
