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

import * as assert from 'assert'
import { dirname, join } from 'path'

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/plugin-core-support/package.json'))

describe('card command', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should fail to exec the command without cardBody: card', () =>
    CLI.command('card', this.app).then(ReplExpect.error(497)).catch(Common.oops(this)))

  it('should fail to exec the command with unsupported optional param: card foo --bar=baz', () =>
    CLI.command('card foo --bar=baz', this.app).then(ReplExpect.error(499)).catch(Common.oops(this)))

  it('should execute the command and show card with foo bar: card foo --title=bar', () =>
    CLI.command('card foo --title=bar', this.app)
      .then(async () => {
        await this.app.client.$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`).then(_ => _.waitForDisplayed())
        const text = await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`)
          .then(_ => _.getText())
        return assert.ok(text.includes('foo') && text.includes('bar'))
      })
      .catch(Common.oops(this)))

  it('should show card with file', () =>
    CLI.command(`card -f=${ROOT}/tests/data/comment.md`, this.app)
      .then(async () => {
        await this.app.client.$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`).then(_ => _.waitForDisplayed())
        const head1: string = await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD} h1`)
          .then(_ => _.getText())
        const head2: string = await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD} h2`)
          .then(_ => _.getText())
        return assert.ok(head1 === 'The Kui Framework for Graphical Terminals' && head2 === 'Installation')
      })
      .catch(Common.oops(this)))

  /** Disabled: --icon support removed, for now, until we figure out what we mean by icon paths */
  xit('should execute the command and show card with image: card foo --title=bar --icon="icons/png/TestIcon.png"', () =>
    CLI.command('card foo --title=bar --icon="icons/png/TestIcon.png"', this.app)
      .then(async () => {
        await this.app.client.$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`).then(_ => _.waitForDisplayed())
        const text = await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`)
          .then(_ => _.getText())
        return assert.ok(text.includes('foo') && text.includes('bar'))
      })
      .then(async () => {
        if (process.env.MOCHA_RUN_TARGET === 'electron') {
          return this.app.client.execute(cardSelector => {
            const imageSrc = document.querySelector(cardSelector).querySelector('img').getAttribute('src')
            const fs = require('fs')
            return fs.statSync(join(__dirname, imageSrc))
          }, `${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`)
        }

        if (process.env.MOCHA_RUN_TARGET === 'webpack') {
          return this.app.client.execute(cardSelector => {
            const imageSrc = document.querySelector(cardSelector).querySelector('img').getAttribute('src')
            const image = new Image()
            image.src = `${window.location.origin}/${imageSrc}`
            if (image.height === 0) throw new Error(`image not found: ${window.location.origin}/${imageSrc}`)
          }, `${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`)
        }
      })
      .catch(Common.oops(this)))
})
