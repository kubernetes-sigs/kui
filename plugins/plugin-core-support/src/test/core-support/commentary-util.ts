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

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'

export function lastOutput(inNotebook: boolean) {
  return inNotebook ? Selectors.OUTPUT_LAST_IN_NOTEBOOK() : Selectors.OUTPUT_LAST
}

export function startEditing(ctx: Common.ISuite) {
  it('should create a commentary editor', async () => {
    try {
      const res = await CLI.command('#', ctx.app).then(ReplExpect.ok)

      await ctx.app.client
        .$(`${Selectors.OUTPUT_N(res.count)} ${Selectors.COMMENTARY_EDITOR}`)
        .then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))
    } catch (err) {
      await Common.oops(ctx, true)(err)
    }
  })
}

/** set the monaco editor text */
export async function type(ctx: Common.ISuite, text: string, inNotebook: boolean): Promise<void> {
  const selector = `${lastOutput(inNotebook)} .monaco-editor-wrapper .view-lines`
  await ctx.app.client.$(selector).then(async _ => {
    await _.click()
    await _.waitForEnabled()
  })

  await ctx.app.client.keys(text)
}

export function verifyTextInMonaco(ctx: Common.ISuite, expectedText: string, inNotebook: boolean) {
  let idx = 0
  return ctx.app.client.waitUntil(
    async () => {
      const actualText = await Util.getValueFromMonaco({ app: ctx.app, count: -1 }, lastOutput(inNotebook))

      if (++idx > 5) {
        console.error(`still waiting for actual=${actualText} expected=${expectedText}`)
      }

      return actualText === expectedText
    },
    { timeout: CLI.waitTimeout }
  )
}

export function typeAndVerify(ctx: Common.ISuite, text: string, expect: string, inNotebook: boolean) {
  it(`should type ${text} and expect ${expect} in the comment`, async () => {
    try {
      await type(ctx, text, inNotebook)
      await verifyTextInMonaco(ctx, expect, inNotebook)
    } catch (err) {
      await Common.oops(ctx, true)(err)
    }
  })
}
