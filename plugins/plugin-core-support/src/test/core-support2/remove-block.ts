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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

async function removeAndValidate(ctx: Common.ISuite, N: number) {
  await ctx.app.client.$(Selectors.PROMPT_N(N)).then(_ => _.moveTo())
  await ctx.app.client.$(Selectors.BLOCK_REMOVE_BUTTON(N)).then(_ => {
    _.waitForDisplayed()
    _.moveTo()
    _.click()
  })

  await ctx.app.client.waitUntil(async () => {
    const text = await ctx.app.client.$(Selectors.OUTPUT_LAST).then(_ => _.getText())
    return text === 'hi'
  })
}

function doEchoThenRemove(this: Common.ISuite, idx: number) {
  it(`should echo ${idx} then remove that block`, async () => {
    try {
      const res = await CLI.command(`echo ${idx}`, this.app)
      await ReplExpect.okWithPtyOutput(idx.toString())(res)

      await removeAndValidate(this, res.count)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
}

describe(`remove command block ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const echo = doEchoThenRemove.bind(this)

  // here come the tests
  it('should echo hi', () =>
    CLI.command('echo hi', this.app).then(ReplExpect.okWithPtyOutput('hi')).catch(Common.oops(this)))

  echo(1)
  echo(2)

  it(`should remove the block during sleep 30`, async () => {
    try {
      const res = await CLI.command('sleep 30', this.app)
      await removeAndValidate(this, res.count)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
