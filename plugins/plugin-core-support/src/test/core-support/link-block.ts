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

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'

describe('Link blocks', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  let id: string
  let lsRes: ReplExpect.AppAndCount

  it('do ls and then copy the link of the block', () =>
    CLI.command('ls', this.app)
      .then(async res => {
        await ReplExpect.ok(res)
        lsRes = res
        await Util.copyBlockLink(res)
        const anchor = await this.app.client.$(`${Selectors.PROMPT_BLOCK_LAST_FOR_SPLIT()} a`)
        await anchor.waitForExist()
        id = await anchor.getAttribute('id')
      })
      .catch(Common.oops(this, true)))

  it('paste the link to a commentary block, and expect the commentary block show the status of ls', async () => {
    try {
      const res = await CLI.command('#', this.app).then(ReplExpect.ok)

      await this.app.client
        .$(`${Selectors.OUTPUT_N(res.count)} ${Selectors.COMMENTARY_EDITOR}`)
        .then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))

      await this.app.client.execute(() => document.execCommand('paste'))

      const commentary = `${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`
      const anchor = await this.app.client.$(`${commentary} a[href="#${id}"]`)
      await anchor.waitForExist()
      const waiting = await this.app.client.$(`${commentary} .kui--link-status--icon[icon="Waiting"]`)
      await waiting.waitForExist()
      await Util.rerunCommand(lsRes)
      const success = await this.app.client.$(`${commentary} .kui--link-status--icon[icon="Checkmark"]`)
      await success.waitForExist()
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })
})
