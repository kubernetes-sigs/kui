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

import { CLI, Common, Selectors, ReplExpect } from '@kui-shell/test'

describe(`tutorial vfs ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should list our test tutorial directory', () =>
    CLI.command('ls -l /kui', this.app)
      .then(ReplExpect.okWith('test'))
      .catch(Common.oops(this, true)))

  it('should list our test tutorial', () =>
    CLI.command('ls -l /kui/test', this.app)
      .then(ReplExpect.okWith('ls.json'))
      .catch(Common.oops(this, true)))
})

async function isBlockRerunable(ctx: Common.ISuite, count: number, isOutputOnlyBlock: boolean, reverse: boolean) {
  if (isOutputOnlyBlock) {
    await ctx.app.client.$(Selectors.OUTPUT_N(count)).then(_ => _.moveTo()) // 1st command is output only
  } else {
    await ctx.app.client.$(Selectors.PROMPT_N(count)).then(_ => _.moveTo())
  }

  const rerunButton = await ctx.app.client.$(Selectors.COMMAND_RERUN_BUTTON(count))
  await rerunButton.waitForDisplayed({ reverse })
}

async function clickRerunButton(ctx: Common.ISuite, count: number) {
  const rerunButton = await ctx.app.client.$(Selectors.COMMAND_RERUN_BUTTON(count))
  await rerunButton.waitForDisplayed()
  await rerunButton.click()
}

describe(`tutorial sequential execution ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  let count: number

  it('should replay our test tutorial', () =>
    CLI.command('replay /kui/test/ls.json', this.app)
      .then(() => {
        count = 0
      })
      .catch(Common.oops(this, true)))

  it('first block is not executable', async () => {
    try {
      await isBlockRerunable(this, count, true, true)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('second block is executable', async () => {
    try {
      await isBlockRerunable(this, count + 1, false, false)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('third block is not executable', async () => {
    try {
      await isBlockRerunable(this, count + 2, false, true)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('should rerun second block', async () => {
    try {
      await clickRerunButton(this, count + 1)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('second block is not executable', async () => {
    try {
      await isBlockRerunable(this, count + 1, false, true)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('third block is executable', async () => {
    try {
      await isBlockRerunable(this, count + 2, false, false)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('should rerun third block', async () => {
    try {
      await clickRerunButton(this, count + 2)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('second block is not executable', async () => {
    try {
      await isBlockRerunable(this, count + 1, false, true)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('third block is not executable', async () => {
    try {
      await isBlockRerunable(this, count + 2, false, true)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })
})
