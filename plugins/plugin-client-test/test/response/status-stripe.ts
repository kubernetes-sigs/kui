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
import { Common } from '@kui-shell/test'

/** see CounterWidget */
const colors = ['ok' as const, 'warn' as const, 'error' as const, 'normal' as const]
const rawId = (idx: number) => `test-client-counter-fragment-${idx}`

/** turn id into a selector */
const id = `.${rawId(0)}`

describe('status stripe', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // the count in the UI that we expect to see next
  let count = 0

  it('should show as ok', async () => {
    console.error('A')
    await this.app.client.waitForVisible(id)
    console.error('B')
    const text = await this.app.client.getText(`${id} .kui--status-stripe-text`)
    console.error('C', text)

    const match = text.match(/^count: (\d+)$/)
    assert.ok(!!match)
    count = parseInt(match[1])

    const color = colors[count]
    console.error('D', count, color)
    await this.app.client.waitForVisible(`${id}[data-view="${color}"]`)
  })

  it('should click on the icon part and show count+1', async () => {
    const currColor = colors[count]
    const nextColor = colors[count + 1]
    console.error('E', count, currColor, nextColor)

    await this.app.client.click(`${id}[data-view="${currColor}"] .kui--status-stripe-icon`)
    await this.app.client.waitForVisible(`${id}[data-view="${nextColor}"]`)
    const text = await this.app.client.getText(`${id}[data-view="${nextColor}"] .kui--status-stripe-text`)
    console.error('F', text)
    assert.strictEqual(text, `count: ${++count}`)
  })

  it('should click on the text part and show count+2', async () => {
    const currColor = colors[count]
    const nextColor = colors[count + 1]

    await this.app.client.click(`${id}[data-view="${currColor}"] .kui--status-stripe-text`)
    await this.app.client.waitForVisible(`${id}[data-view="${nextColor}"]`)
    const text = await this.app.client.getText(`${id}[data-view="${nextColor}"] .kui--status-stripe-text`)
    assert.strictEqual(text, `count: ${++count}`)
  })
})
