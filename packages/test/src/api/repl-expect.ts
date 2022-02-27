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

import { Application } from 'spectron'
import { ElementArray } from 'webdriverio'
import * as assert from 'assert'

import { ISuite } from './common'
import { getTextContent, waitTimeout } from './cli'
import * as Selectors from './selectors'

export interface AppAndCount {
  app: Application
  count: number
  splitIndex?: number
}

interface CustomSpec {
  selector?: string
  errOk?: boolean
  expect?: string
  exact?: boolean
  passthrough?: boolean
  streaming?: boolean
}

interface Options {
  elements?: boolean
  expectError?: boolean
  exact?: boolean
  expect?: string
  nonBlankPromptOk?: boolean
  passthrough?: boolean
  selfSelector?: string
  selector?: string
  expectJustOK?: boolean
  expectString?: string
  expectArray?: string[]
  streaming?: boolean
}

async function expectOK<T extends number | string | boolean | ElementArray | Application = boolean>(
  appAndCount: AppAndCount,
  opt?: Options
): Promise<T> {
  // appAndCount.count is the prompt index of this command... so +1 gives us the next prompt, whose existence signals that this command has finished
  const app = appAndCount.app
  const N = appAndCount.count + 1
  const { splitIndex = 1 } = appAndCount

  const nextPrompt = process.env.KUI_POPUP
    ? Selectors.STATUS_STRIPE_PROMPT
    : !process.env.BOTTOM_INPUT_MODE
    ? Selectors.PROMPT_N_FOR_SPLIT(N, splitIndex)
    : Selectors.BOTTOM_PROMPT

  const nextPromptDom = await app.client.$(nextPrompt)
  await nextPromptDom.waitForExist({ timeout: waitTimeout }) // wait for the next prompt to appear
  const promptValue = await nextPromptDom.getValue()
  if (!process.env.BOTTOM_INPUT_MODE && (!opt || !opt.nonBlankPromptOk) && promptValue && promptValue.length !== 0) {
    console.error(`Expected prompt value to be empty: ${promptValue}`)
    if (promptValue) {
      assert.strictEqual(promptValue.length, 0)
    }
  }

  if (opt && opt.expectError) return false as T
  const html = await app.client.$(Selectors.OK_N(N - 1, splitIndex)).then(_ => _.getHTML())
  const okReg = new RegExp(process.env.OK) || /ok/
  assert.ok(okReg.test(html)) // make sure it says "ok" !

  return Promise.resolve()
    .then(
      async (): Promise<T> => {
        // validate any expected list entry
        if (opt && opt.expectString) {
          // expect exactly one entry
          await app.client
            .$(`${Selectors.LIST_RESULTS_BY_NAME_N(N - 1, splitIndex)} .entity-name`)
            .then(_ => _.getText())
            .then(name => assert.strictEqual(name, opt.expectString))
        } else if (opt && opt.expectArray) {
          // expect several entries, of which opt is one // NOTE: what does it mean by opt is one???
          await app.client
            .$$(Selectors.LIST_RESULTS_BY_NAME_N(N - 1, splitIndex))
            .then(names => Promise.all(names.map(_ => _.getText())))
            .then(names =>
              assert.notStrictEqual(
                names.findIndex(_ => _.indexOf(opt.expectArray[0]) >= 0),
                -1,
                `name="${opt.expectArray[0]}" not found in list=${names}`
              )
            )
        } else if (opt && (opt.selector || opt.expect)) {
          // more custom, look for expect text under given selector
          const selector = `${
            opt.streaming ? Selectors.OUTPUT_N_STREAMING(N - 1, splitIndex) : Selectors.OUTPUT_N(N - 1, splitIndex)
          }${opt.selfSelector || ''} ${opt.selector || ''}`
          if (opt.elements) {
            return (app.client.$$(selector) as any) as Promise<T>
          } else {
            let idx = 0
            return app.client
              .waitUntil(
                async () => {
                  const txt = await app.client.$(selector).then(async _ => {
                    await _.waitForExist({ timeout: waitTimeout })
                    return _.getText()
                  })

                  if (++idx > 5) {
                    console.error(`still waiting for expected text actualText=${txt} expectedText=${opt.expect}`)
                  }

                  if (opt.exact) return txt === opt.expect
                  else if (opt.expect) {
                    if (txt.indexOf(opt.expect) < 0) {
                      console.error(
                        `Expected string not found expected=${opt.expect} idx=${txt.indexOf(opt.expect)} actual=${txt}`
                      )
                      return txt.indexOf(opt.expect) >= 0
                    }
                  }

                  return true
                },
                { timeout: waitTimeout }
              )
              .then(() => {
                return opt.passthrough ? N - 1 : selector // so that the caller can inspect the selector in more detail
              })
              .then(res => res as T)
          }
        } else if (opt && opt.expectJustOK === true) {
          // ensure that there is nothing other than "ok"
          await app.client.waitUntil(
            async () => {
              const txt = await app.client.$(Selectors.OUTPUT_N(N - 1, splitIndex)).then(_ => _.getText())
              const justOK = process.env.OK || 'ok'
              return txt.length === 0 || txt === justOK
            },
            { timeout: waitTimeout }
          )
        } else {
          // nothing to validate with the "console" results of the command
          // return the index of the last executed command
          return ((N - 1) as any) as Promise<T>
        }
      }
    )
    .then(res => (opt && (opt.selector || opt.passthrough) ? res : app)) // return res rather than app, if requested
    .then(res => res as T)
}

export const ok = async (res: AppAndCount) =>
  expectOK<number>(res, { passthrough: true })
    .then(N => res.app.client.$$(Selectors.LIST_RESULTS_BY_NAME_N(N, res.splitIndex)))
    .then(elts => assert.strictEqual(elts.length, 0))
    .then(() => res)

export const error = (statusCode: number | string, expect?: string) => async (res: AppAndCount) => {
  await expectOK(res, {
    expectError: true
  })

  if (expect) {
    const selfSelector = `.oops[data-status-code="${statusCode || 0}"]`
    const selector = `${Selectors.OUTPUT_N(res.count, res.splitIndex || 1)}${selfSelector || ''}`
    let idx = 0
    await res.app.client.waitUntil(
      async () => {
        const actualText = await res.app.client.$(selector).then(_ => _.getText())
        if (++idx > 5) {
          console.error(`still waiting for actualText=${actualText} expectedText=${expect}`)
        }
        return actualText.indexOf(expect) >= 0
      },
      { timeout: waitTimeout }
    )
  }

  return res.app
}

export const blankWithOpts = (opts = {}) => async (res: AppAndCount) =>
  expectOK(res, Object.assign({ selector: '', expectError: true }, opts))

export const blank = (res: AppAndCount) => blankWithOpts()(res)

/** The return type `any` comes from webdriverio waitUntil */
export const consoleToBeClear = (app: Application, residualBlockCount = 1, splitIndex = 1) => {
  let idx = 0
  return app.client.waitUntil(
    async () => {
      const actualBlockCount = (await app.client.$$(Selectors.PROMPT_BLOCK_FOR_SPLIT(splitIndex))).length
      if (++idx > 5) {
        console.error(
          `still waiting for residualBlockCount=${residualBlockCount}; actualBlockCount=${actualBlockCount}`
        )
      }
      return actualBlockCount === residualBlockCount
    },
    { timeout: waitTimeout }
  )
}

/** as long as its ok, accept anything */
export const okWithCustom = <T extends string | boolean>(custom: CustomSpec) => async (res: AppAndCount) =>
  expectOK<T>(res, custom)

export const okWithTextContent = (expect: string, exact = false, failFast = true, sel = ' ') => async (
  res: AppAndCount
) => {
  // Notes: webdriverio's getText seems to use .innerText to extract
  // the text from a given selector; this is quite unreliable in
  // terms of whitespace preservation; e.g. <div><span>
  // </span><span> </span></div> will preserve whitespace, but if
  // the inner spans have are inline-block, then innerText will not
  // preserve whitespace; textContent *will* preserve whitespace
  const selector = await okWithCustom<string>({ selector: sel })(res)
  const txt = await getTextContent(res.app, selector)

  if (exact) {
    assert.strictEqual(txt, expect)
    return true
  } else {
    if (txt.indexOf(expect) < 0) {
      console.error(`Expected string not found expected=${expect} idx=${txt.indexOf(expect)} actual=${txt}`)
      if (failFast) {
        assert.ok(txt.indexOf(expect) >= 0)
        return true
      } else {
        return false
      }
    }
  }
}

export const okWithString = (expect: string, exact = false, streaming = false) => async (res: AppAndCount) => {
  // first try innerText
  return okWithCustom<boolean>({ expect, exact, streaming })(res).catch(async err1 => {
    // use .textContent as a backup plan
    return okWithTextContent(
      expect,
      exact
    )(res).catch(() => {
      throw err1
    })
  })
}

export const okWithStreamingOutput = (expect: string, exact = false) => okWithString(expect, exact, true)
export const okWithPtyOutput = (expect: string, exact = false) => okWithString(expect, exact)

export const okWithStringEventually = (expect: string, exact = false) => (res: AppAndCount) => {
  return res.app.client.waitUntil(
    () => {
      try {
        return okWithString(expect, exact)(res)
      } catch (err) {
        // swallow
      }
    },
    { timeout: waitTimeout }
  )
}

export const okWithPtyOutputEventually = (expect: string, exact = false) => (res: AppAndCount) => {
  return res.app.client.waitUntil(
    () => {
      try {
        return okWithPtyOutput(expect, exact)(res)
      } catch (err) {
        // swallow
      }
    },
    { timeout: waitTimeout }
  )
}

export const okWithDropDownList = (openAndExpectLabel: string, click = false, closeAfterOpen = true) => async (
  res: AppAndCount
) => {
  const toggler = await okWithCustom<string>({
    selector: Selectors.DROPDOWN
  })(res)

  return res.app.client
    .$(toggler)
    .then(_ => _.click())
    .then(() => res.app.client.$(Selectors.DROPDOWN_N_MENU_ITEM(res.count, openAndExpectLabel, res.splitIndex)))
    .then(async _ => {
      if (click) {
        await _.waitForDisplayed()
        await _.click()
      }

      if (closeAfterOpen) {
        await res.app.client.$(toggler).then(_ => _.click())
      }

      return res
    })
}

const currentEventCount = async (app: Application, outputCount: number): Promise<number> => {
  const events = await app.client.$$(Selectors.TABLE_FOOTER(outputCount))
  const res = !events ? 0 : events.length
  return res
}

export const okWithEvents = async (ctx: ISuite, res: AppAndCount) => {
  let idx = 0
  await ctx.app.client.waitUntil(
    async () => {
      const actualEventCount = await currentEventCount(ctx.app, res.count)
      if (++idx > 5) {
        console.error('still waiting for events')
      }
      console.log('actualEventCount', actualEventCount)
      return actualEventCount > 0
    },
    { timeout: waitTimeout }
  )
  return res
}

/** as long as its ok, accept anything */
export const okWithAny = async (res: AppAndCount) => expectOK(res)

/** expect ok and *only* the given result value */
export const okWithOnly = (entityName: string) => async (res: AppAndCount) =>
  expectOK(res, { expectString: entityName })

/** expect ok and at least the given result value */
// FIXME: okWithAtLeast??
export const okWith = (entityName: string) => async (res: AppAndCount) => expectOK(res, { expectArray: [entityName] })

/** expect just ok, and no result value */
export const justOK = async (res: AppAndCount) => expectOK(res, { expectJustOK: true }).then(() => res)

/** Expect the given number of terminal splits in the current tab, and check whether the last split has inverse colors */
export function splitCount(expectedSplitCount: number, inverseColors = false, expectedSplitIndex?: number) {
  return async (app: Application) => {
    let idx = 0
    await app.client.waitUntil(
      async () => {
        const splits = await app.client.$$(Selectors.SPLITS)
        if (++idx > 5) {
          console.error(`still waiting for splitCount; actual=${splits.length} expected=${expectedSplitCount}`)
        }
        return splits.length === expectedSplitCount
      },
      { timeout: waitTimeout }
    )

    if (inverseColors) {
      await app.client
        .$(Selectors.SPLIT_N(expectedSplitIndex || expectedSplitCount, inverseColors))
        .then(_ => _.waitForExist({ timeout: waitTimeout }))
    }
  }
}

/** Expect table with N rows */
export function tableWithNRows(N: number) {
  return (res: AppAndCount) => {
    return res.app.client.waitUntil(
      async () => {
        const rows = await res.app.client.$$(Selectors.LIST_RESULTS_N(res.count))
        return rows.length === N
      },
      { timeout: waitTimeout }
    )
  }
}

/** Expect an ElsewhereCommentaryResponse */
export function elsewhere(expectedBody: string, N?: number) {
  return async (res: AppAndCount) => {
    let idx = 0
    await res.app.client.waitUntil(
      async () => {
        const actualBody = await res.app.client
          .$(Selectors.OUTPUT_N(res.count, N === undefined ? res.splitIndex : N))
          .then(_ => _.getText())
        if (++idx > 5) {
          console.error(`still waiting for body; actual=${actualBody}; expected=${expectedBody}`)
        }
        return actualBody === expectedBody
      },
      { timeout: waitTimeout }
    )

    return res.app
  }
}

/** Expect a CommentaryResponse */
export function comment(expectedBody: string, expectedTitle?: string) {
  return async (res: AppAndCount): Promise<AppAndCount> => {
    const output = Selectors.OUTPUT_N(res.count)

    if (expectedTitle) {
      await res.app.client
        .$(`${output} ${Selectors.TERMINAL_CARD}`)
        .then(_ => _.waitForDisplayed({ timeout: waitTimeout }))
      const actualTitle: string = await res.app.client
        .$(`${output} ${Selectors.TERMINAL_CARD_TITLE}`)
        .then(_ => _.getText())
      assert.strictEqual(actualTitle, expectedTitle)
    }

    const actualBody: string = await res.app.client
      .$(`${output} ${Selectors.TERMINAL_CARD_BODY}`)
      .then(_ => _.getText())
    assert.strictEqual(actualBody, expectedBody)

    return res
  }
}

/** Verify that the number of blocks equals the expected count */
export function blockCount(this: ISuite) {
  return {
    inSplit: (splitIndex: number) => ({
      is: (expected: number | (() => number)) => {
        it(`should have expectedBlockCount=${
          typeof expected === 'number' ? expected : '...'
        } inSplit=${splitIndex}`, () => {
          let idx = 0

          const expectedBlockCount = typeof expected === 'number' ? expected : expected()

          return this.app.client.waitUntil(
            async () => {
              const blocks = await this.app.client.$$(Selectors.PROMPT_BLOCK_FOR_SPLIT(splitIndex))
              const actualBlockCount = blocks.length

              if (++idx > 5) {
                console.error(
                  `still waiting for expectedBlockCount=${expectedBlockCount}; actualBlockCount=${actualBlockCount}`,
                  blocks
                )
              }

              return actualBlockCount === expectedBlockCount
            },
            { timeout: waitTimeout }
          )
        })
      }
    })
  }
}

/** Transform the given block finder to one that can find the next block */
export function blockAfter(res: AppAndCount, delta = 1): AppAndCount {
  return Object.assign({}, res, {
    count: res.count + delta
  })
}
