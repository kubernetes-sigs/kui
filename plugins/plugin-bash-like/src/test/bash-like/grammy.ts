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
import * as assert from 'assert'
import { dirname, join } from 'path'

import { Common, CLI, Selectors } from '@kui-shell/test'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-bash-like/tests/data/grammy1.txt')), '..')

describe(`grammy table ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should do grammy in the test file', async () => {
    try {
      const res = await CLI.command(`grammy ${ROOT}/data/grammy1.txt`, this.app)
      const validRecordsInGrammy1 = 6

      await this.app.client.$(Selectors.TABLE_SHOW_AS_HISTOGRAM(res.count)).then(_ => _.waitForDisplayed())
      await this.app.client.waitUntil(
        async () => {
          const labels = await this.app.client.$$(Selectors.TABLE_HISTOGRAM_TEXT(res.count))
          return labels.length === validRecordsInGrammy1 * 2
        },
        { timeout: CLI.waitTimeout }
      )

      await this.app.client
        .$(Selectors.TABLE_HISTOGRAM_TEXT_WITH_ID('chart-axis-0-tickLabels-0', res.count))
        .then(text => assert.strictEqual(text, 'prepublish', `expect: prepublish; actual: ${text}`))

      await this.app.client
        .$(Selectors.TABLE_HISTOGRAM_TEXT_WITH_ID('chart-bar-1-labels-0', res.count))
        .then(text => assert.strictEqual(text, '205', `expect: 205; actual: ${text}`))

      await this.app.client
        .$(Selectors.TABLE_HISTOGRAM_TEXT_WITH_ID('chart-axis-0-tickLabels-1', res.count))
        .then(text => assert.strictEqual(text, 'publish suffix', `expect: publish suffix; actual: ${text}`))
    } catch (err) {
      return Common.oops(this, true)
    }
  })

  it('should do grammy via globbing the test files', async () => {
    try {
      const res = await CLI.command(`grammy ${ROOT}/data/grammy*`, this.app)
      await this.app.client.$(Selectors.TABLE_SHOW_AS_HISTOGRAM(res.count)).then(_ => _.waitForDisplayed())
      await this.app.client
        .$(Selectors.TABLE_HISTOGRAM_TEXT_WITH_ID('chart-bar-1-labels-0', res.count))
        .then(text => assert.strictEqual(text, '410', `expect: 410; actual: ${text}`))
    } catch (err) {
      return Common.oops(this, true)
    }
  })

  it('should do grammy against pacakge.json and expect an empty table', async () => {
    try {
      const res = await CLI.command(`grammy ${ROOT}/package.json`, this.app)
      await this.app.client
        .$(Selectors.TABLE_SHOW_AS_HISTOGRAM(res.count))
        .then(_ => _.waitForDisplayed({ timeout: 8000, reverse: true }))
    } catch (err) {
      return Common.oops(this, true)
    }
  })
})
