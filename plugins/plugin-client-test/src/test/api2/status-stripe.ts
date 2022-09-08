/*
 * Copyright 2020 The Kubernetes Authors
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
import { Common, Selectors } from '@kui-shell/test'

/** see CounterWidget */
const colors = ['ok' as const, 'warn' as const, 'error' as const, 'normal' as const]

function colorOf(N: number) {
  return colors[N % colors.length]
}

/** id for our test widget */
const id = 'test-client-counter-fragment-0'

describe('test client status stripe', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // the count in the UI that we expect to see next
  let count = 0

  it('should show as ok', async () => {
    console.error('A')
    await this.app.client.$(Selectors.STATUS_STRIPE_WIDGET(id)).then(_ => _.waitForDisplayed())
    console.error('B')
    const text = await this.app.client.$(Selectors.STATUS_STRIPE_WIDGET_LABEL(id)).then(_ => _.getText())
    console.error('C', text)

    const match = text.match(/^count: (\d+)$/)
    assert.ok(!!match)
    count = parseInt(match[1])

    const color = colorOf(count)
    console.error('D', count, color)
    await this.app.client.$(Selectors.STATUS_STRIPE_WIDGET_WITH_ATTR(id, 'view', color)).then(_ => _.waitForDisplayed())
  })

  it('should click on the icon part and show count+1', async () => {
    try {
      const currColor = colorOf(count)
      const nextColor = colorOf(count + 1)
      console.error('E', count, currColor, nextColor)

      await this.app.client.$(Selectors.STATUS_STRIPE_WIDGET_ICON_WITH_ATTR(id, 'view', currColor)).then(_ => _.click())
      console.error('F1')
      await this.app.client
        .$(Selectors.STATUS_STRIPE_WIDGET_WITH_ATTR(id, 'view', nextColor))
        .then(_ => _.waitForDisplayed())
      console.error('F2')
      const text = await this.app.client
        .$(Selectors.STATUS_STRIPE_WIDGET_LABEL_WITH_ATTR(id, 'view', nextColor))
        .then(_ => _.getText())
      console.error('F3', text)
      assert.strictEqual(text, `count: ${++count}`)
      console.error('F4')
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should click on the text part and show count+2', async () => {
    try {
      const currColor = colorOf(count)
      const nextColor = colorOf(count + 1)

      await this.app.client
        .$(Selectors.STATUS_STRIPE_WIDGET_LABEL_WITH_ATTR(id, 'view', currColor))
        .then(_ => _.click())
      await this.app.client
        .$(Selectors.STATUS_STRIPE_WIDGET_WITH_ATTR(id, 'view', nextColor))
        .then(_ => _.waitForDisplayed())
      const text = await this.app.client
        .$(Selectors.STATUS_STRIPE_WIDGET_LABEL_WITH_ATTR(id, 'view', nextColor))
        .then(_ => _.getText())
      assert.strictEqual(text, `count: ${++count}`)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
