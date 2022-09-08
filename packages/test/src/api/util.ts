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
import { Application } from 'spectron'
import { v4 as uuid } from 'uuid'
import { load } from 'js-yaml'

import * as Selectors from './selectors'
import * as CLI from './cli'
import * as Common from './common'
import * as ReplExpect from './repl-expect'
import * as SidecarExpect from './sidecar-expect'
import { keys } from './keys'

export interface AppAndCount {
  app: Application
  count: number
  splitIndex?: number
}

/**
 * subset means that it is ok for struct1 to be a subset of struct2
 * so: every key in struct1 must be in struct2, but not vice versa
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sameStruct = (struct1: Record<string, any>, struct2: Record<string, any>, subset = false): boolean => {
  if (struct1 === struct2) {
    return true
  } else if (typeof struct1 !== typeof struct2) {
    return false
  }

  for (const key in struct1) {
    if (!(key in struct2)) {
      console.log(`!(${key} in struct2)`)
      return false
    } else if (struct1[key].constructor === RegExp) {
      // then we have a validator regular expression
      if (!struct1[key].test(struct2[key])) {
        return false
      }
    } else if (typeof struct1[key] === 'function') {
      // then we have a validator function
      if (!struct1[key](struct2[key])) {
        return false
      }
    } else if (typeof struct1[key] !== typeof struct2[key]) {
      console.log(`typeof struct1[${key}] !== typeof struct2[${key}] ${typeof struct1[key]} ${typeof struct2[key]}`)
      console.log(struct1)
      console.log(struct2)
      return false
    } else if (typeof struct1[key] === 'object') {
      if (!sameStruct(struct1[key], struct2[key], subset)) {
        return false
      }
    } else if (struct1[key] !== struct2[key]) {
      console.log(`struct1[${key}] !== struct2[${key}] ${struct1[key]} ${struct2[key]}`)
      return false
    }
  }
  // if struct1 if expected to be a subset of struct2, then we're done
  if (subset) return true

  for (const key in struct2) {
    if (!(key in struct1)) {
      console.log(`!(${key} in struct1)`)
      return false
    } else if (typeof struct1[key] === 'function') {
      // then we have a validator function
      if (!struct1[key](struct2[key])) {
        return false
      }
    } else if (typeof struct1[key] !== typeof struct2[key]) {
      console.log(`typeof struct1[${key}] !== typeof struct2[${key}] ${typeof struct1[key]} ${typeof struct2[key]}`)
      console.log(struct1)
      console.log(struct2)
      return false
    } else if (typeof struct2[key] === 'object') {
      if (!sameStruct(struct1[key], struct2[key], subset)) {
        return false
      }
    } else if (struct1[key] !== struct2[key]) {
      console.log(`struct1[${key}] !== struct2[${key}] ${struct1[key]} ${struct2[key]}`)
      return false
    }
  }
  return true
}

export const expectSubset =
  (struct1: object, failFast = true) =>
  (str: string) => {
    try {
      const ok = sameStruct(struct1, JSON.parse(str), true)
      if (failFast) {
        assert.ok(ok)
      }
      return true
    } catch (err) {
      console.error('Error comparing subset for actual value=' + str)
      throw err
    }
  }

/** is the given struct2 the same as the given struct2 (given as a string) */
export const expectStruct =
  (struct1: object, noParse = false, failFast = true) =>
  (str: string) => {
    try {
      const ok = sameStruct(struct1, noParse ? str : JSON.parse(str))
      if (failFast) {
        assert.ok(ok)
      }
      return ok
    } catch (err) {
      console.error('Error comparing structs for actual value=' + str)
      throw err
    }
  }

export const expectYAML =
  (struct1: object, subset = false, failFast = true) =>
  (str: string) => {
    try {
      const struct2 = load(str)
      const ok = sameStruct(
        struct1,
        typeof struct2 !== 'string' || typeof struct2 !== 'boolean' || typeof struct2 !== 'number'
          ? struct2
          : JSON.parse(typeof struct2 === 'number' ? `${struct2}` : struct2),
        subset
      )
      if (failFast) {
        assert.ok(ok)
      }
      return ok
    } catch (err) {
      if (failFast) {
        return false
      } else {
        console.error('Error comparing subset for actual value=' + str)
        throw err
      }
    }
  }

export const expectYAMLSubset = (struct1: object, failFast = true) => expectYAML(struct1, true, failFast)

/** is the given actual array the same as the given expected array? */
export const expectArray =
  (expected: Array<string>, failFast = true, subset = false) =>
  (actual: string | Array<string>) => {
    if (!Array.isArray(actual)) {
      // webdriver.io's getText will return a singleton if there is only one match
      actual = [actual]
    }

    const matchFn = function (u: string, i: number) {
      return u === expected[i]
    }

    const ok = !subset ? actual.length === expected.length && actual.every(matchFn) : actual.some(matchFn)

    if (!ok) {
      console.error(`array mismatch; expected=${expected} actual=${actual}`)
    }

    if (failFast) {
      assert.ok(ok)
    } else {
      return ok
    }
  }

/** Expand the fold on the given line of a monaco editor */
export async function clickToExpandMonacoFold(res: AppAndCount, lineIdx: number) {
  const container =
    res.splitIndex !== undefined
      ? `${Selectors.PROMPT_BLOCK_N_FOR_SPLIT(res.count, res.splitIndex)} .kui--tab-content:not([hidden])`
      : `${Selectors.PROMPT_BLOCK_N(res.count)} .kui--tab-content:not([hidden])`

  console.log('MF1')
  const selector = `${container} .monaco-editor-wrapper`
  const wrapper = await res.app.client.$(selector)
  await wrapper.waitForExist({ timeout: CLI.waitTimeout })

  console.log('MF2')
  const marginOverlaysSelector = `.margin-view-overlays > div:nth-child(${lineIdx + 1})` // css is 1-indexed
  const foldingSelector = `${marginOverlaysSelector} .codicon-folding-collapsed`
  const foldingClickable = await wrapper.$(foldingSelector)

  console.log('MF3')
  await foldingClickable.waitForExist({ timeout: CLI.waitTimeout })

  console.log('MF4')
  await foldingClickable.click()

  console.log('MF5')
  const unfoldingSelector = `${marginOverlaysSelector} .codicon-folding-expanded`
  const unfoldingClickable = await wrapper.$(unfoldingSelector)
  await unfoldingClickable.waitForExist({ timeout: CLI.waitTimeout })

  console.log('MF6')
}

/** get the monaco editor text */
export const getValueFromMonaco = async (res: AppAndCount, container?: string) => {
  if (!container) {
    container =
      res.splitIndex !== undefined
        ? `${Selectors.PROMPT_BLOCK_N_FOR_SPLIT(res.count, res.splitIndex)} .kui--tab-content:not([hidden])`
        : `${Selectors.PROMPT_BLOCK_N(res.count)} .kui--tab-content:not([hidden])`
  }

  const selector = `${container} .monaco-editor-wrapper`

  try {
    await res.app.client.$(selector).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
  } catch (err) {
    console.error('cannot find editor', err)
    await res.app.client
      .$(Selectors.SIDECAR(res.count, res.splitIndex))
      .then(_ => _.getHTML())
      .then(html => {
        console.log('here is the content of the sidecar:')
        console.log(html)
      })
    throw err
  }

  return res.app.client.execute(selector => {
    try {
      return (document.querySelector(selector) as any as { getValueForTests: () => string }).getValueForTests()
    } catch (err) {
      console.error('error in getValueFromMonaco1', err)
      // intentionally returning undefined
    }
  }, selector)
}

export const waitForXtermInput = (app: Application, N: number) => {
  const selector = `${Selectors.PROMPT_BLOCK_N(N)} .xterm-helper-textarea`
  return app.client.$(selector).then(_ => _.waitForExist())
}

export const expectText =
  (app: Application, expectedText: string, exact = true, timeout = CLI.waitTimeout) =>
  async (selector: string) => {
    let idx = 0
    await app.client.waitUntil(
      async () => {
        const actualText = await app.client.$(selector).then(_ => _.getText())
        if (++idx > 5) {
          console.error(
            `still waiting for text; actualText=${actualText} expectedText=${expectedText} selector=${selector}`
          )
        }
        if (exact) {
          return actualText === expectedText
        } else {
          if (actualText.indexOf(expectedText) < 0) {
            console.error(`Expected string not found: expected=${expectedText} actual=${actualText}`)
          }
          return actualText.indexOf(expectedText) >= 0
        }
      },
      { timeout }
    )
    return app
  }

/** @return the current number of tabs */
export async function tabCount(app: Application): Promise<number> {
  const topTabs = await app.client.$$(Selectors.TOP_TAB)
  return topTabs.length
}

/** Close all except the first tab */
export function closeAllExceptFirstTab(this: Common.ISuite, expectedInitialNTabs = 2) {
  it('should close all but first tab', async () => {
    try {
      await this.app.client.waitUntil(async () => {
        const currentCount = await tabCount(this.app)
        return currentCount === expectedInitialNTabs
      })

      let nTabs = await tabCount(this.app)

      while (nTabs > 1) {
        const N = nTabs--

        await this.app.client.$(Selectors.TOP_TAB_CLOSE_N(N)).then(_ => _.click())

        await this.app.client.waitUntil(async () => {
          const currentCount = await tabCount(this.app)
          return currentCount === N - 1
        })
      }
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
}

export function uniqueFileForSnapshot() {
  return `/tmp/${uuid()}.kui`
}

/** Click the specified button action button */
export async function clickBlockActionButton(res: AppAndCount, buttonSelector: string) {
  const N = res.count
  const prompt = await res.app.client.$(Selectors.PROMPT_N(N))
  await prompt.scrollIntoView()
  await prompt.moveTo()

  const removeButton = await res.app.client.$(buttonSelector)
  await removeButton.scrollIntoView()
  await removeButton.waitForDisplayed({ timeout: CLI.waitTimeout })
  await removeButton.moveTo()
  await removeButton.click()
}

/** Click the close button on a block, and expect it to be gone */
export async function removeBlock(res: AppAndCount) {
  return clickBlockActionButton(res, Selectors.BLOCK_REMOVE_BUTTON(res.count))
}

/** Click the block copy button */
export async function copyBlockLink(res: AppAndCount) {
  return clickBlockActionButton(res, Selectors.BLOCK_LINK_BUTTON(res.count))
}

/** Click the block run button */
export async function rerunCommand(res: AppAndCount) {
  return clickBlockActionButton(res, Selectors.COMMAND_RERUN_BUTTON(res.count))
}

/** Switch sidecar tab */
export function switchToTab(mode: string) {
  return async (res: AppAndCount) => {
    const tab = await res.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res.count, mode, res.splitIndex))
    await tab.waitForDisplayed()
    await tab.click()
    await res.app.client
      .$(Selectors.SIDECAR_MODE_BUTTON_SELECTED(res.count, mode, res.splitIndex))
      .then(_ => _.waitForDisplayed())
    return res
  }
}

/** Output of the given block */
export function outputOf(res: AppAndCount) {
  return res.app.client.$(Selectors.OUTPUT_N(res.count, res.splitIndex)).then(_ => _.getText())
}

/**
 * Execute `command` and expect a table with `name`
 *
 */
export async function doList(ctx: Common.ISuite, command: string, name: string) {
  try {
    const tableRes = await CLI.command(command, ctx.app)
    return ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })(tableRes)
  } catch (err) {
    await Common.oops(ctx, true)(err)
  }
}

export async function openSidecarByClick(
  ctx: Common.ISuite,
  selector: string,
  name: string,
  mode?: string,
  activationId?: string,
  splitIndex = 2, // after we click, we expect two splits
  inNotebook = false
) {
  const app = ctx.app

  // Note! if we already have 2 splits, we need to grab the count before we click! see https://github.com/IBM/kui/issues/6636
  const currentSplitCount = (await app.client.$$(Selectors.SPLITS)).length
  const currentLastBlockIdx =
    currentSplitCount === splitIndex ? (await CLI.lastBlock(app, splitIndex, 1, inNotebook)).count : -1

  // now click on the table row
  const clickOn = await app.client.$(selector)
  await clickOn.waitForExist({ timeout: CLI.waitTimeout })
  await clickOn.scrollIntoView(false)
  await clickOn.click()

  // expect 2 splits in total
  await ReplExpect.splitCount(splitIndex)(app)

  // expect sidecar shown in the last blck of the second split
  await app.client.waitUntil(async () => {
    const sidecarRes = await CLI.lastBlock(app, splitIndex, 1, inNotebook)
    return sidecarRes.count > currentLastBlockIdx
  })

  const sidecarRes = await CLI.lastBlock(app, splitIndex, 1, inNotebook)
  await SidecarExpect.open(sidecarRes).then(SidecarExpect.showing(name, activationId))

  if (mode) {
    await SidecarExpect.mode(mode)(sidecarRes)
  }

  return sidecarRes
}

/**
 * Execute `command` and expect a table with `name`,
 * and then open sidecar by clicking the `name`
 *
 */
export async function listAndOpenSidecarNoWait(ctx: Common.ISuite, command: string, name: string, mode?: string) {
  const selector = `${await doList(ctx, command, name)} [data-value="${name}"].clickable`
  return openSidecarByClick(ctx, selector, name, mode)
}

/**
 * Click sidecar mode button by `mode`
 *
 */
export async function clickSidecarModeButton(ctx: Common.ISuite, res: AppAndCount, mode: string) {
  return ctx.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res.count, mode, res.splitIndex)).then(async _ => {
    await _.waitForDisplayed()
    await _.click()
  })
}

/**
 * Click a sidecar button with `selector`
 *
 */
export async function clickSidecarButtonCustomized(ctx: Common.ISuite, res: AppAndCount, selector: string) {
  return ctx.app.client.$(`${Selectors.SIDECAR(res.count, res.splitIndex)} ${selector}`).then(async _ => {
    await _.waitForDisplayed()
    await _.click()
  })
}

export function doCancel(this: Common.ISuite, cmd = '') {
  return this.app.client
    .$(Selectors.CURRENT_PROMPT_BLOCK)
    .then(async _ => {
      await _.waitForExist()
      return _.getAttribute('data-input-count')
    })
    .then(count => parseInt(count, 10))
    .then(count =>
      this.app.client
        .keys(cmd)
        .then(() => this.app.client.keys(keys.ctrlC))
        .then(() => ({ app: this.app, count }))
        .then(ReplExpect.blank)
        .then(() => this.app.client.$(Selectors.PROMPT_N(count))) // make sure the cancelled command text is still there, in the previous block
        .then(_ => _.getText())
        .then(input => assert.strictEqual(input, cmd))
    )
    .catch(Common.oops(this, true))
}

export function switchToTopLevelTabViaClick(ctx: Common.ISuite, N: number) {
  return ctx.app.client
    .$(Selectors.TOP_TAB_N_CLICKABLE(N))
    .then(_ => _.click())
    .then(() => ctx.app.client.$(Selectors.TAB_SELECTED_N(N)))
    .then(_ => _.waitForDisplayed())
    .catch(Common.oops(ctx, true))
}

export function doClear(this: Common.ISuite, residualBlockCount = 1, splitIndex = 1) {
  return CLI.commandInSplit('clear', this.app, splitIndex)
    .then(() => ReplExpect.consoleToBeClear(this.app, residualBlockCount, splitIndex))
    .then(() => SidecarExpect.closed)
    .catch(Common.oops(this, true))
}

export function clickNewTabButton(ctx: Common.ISuite, expectedNewTabIndex: number) {
  return ctx.app.client
    .$(Selectors.tabButtonSelector)
    .then(_ => _.click())
    .then(() => ctx.app.client.$(Selectors.TAB_SELECTED_N(expectedNewTabIndex)))
    .then(_ => _.waitForDisplayed())
    .then(() => CLI.waitForRepl(ctx.app)) // should have an active repl
}

export async function getTabTitle(ctx: Common.ISuite, tabTitleSelector: string) {
  const tabTitle = await ctx.app.client.$(tabTitleSelector)
  await tabTitle.waitForDisplayed({ timeout: CLI.waitTimeout })
  const actualTabTitle = await tabTitle.getValue()
  return actualTabTitle
}

export function expectCurrentTabTitle(
  ctx: Common.ISuite,
  expectedTabTitle: string,
  tabTitleSelector = Selectors.CURRENT_TAB_TITLE
) {
  return ctx.app.client.waitUntil(
    async () => {
      const actualTabTitle = await getTabTitle(ctx, tabTitleSelector)
      return actualTabTitle === expectedTabTitle
    },
    { timeout: CLI.waitTimeout }
  )
}
