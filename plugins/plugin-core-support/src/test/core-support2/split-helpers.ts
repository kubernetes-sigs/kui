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

import { notStrictEqual, strictEqual, ok } from 'assert'
import { SplitPosition } from '@kui-shell/plugin-client-common'
import { CLI, Common, ReplExpect, Selectors } from '@kui-shell/test'

/** The actual split terminal via button impl; splitViaButton is the mocha test wrapper */
export async function doSplitViaButton(ctx: Common.ISuite, splitCount: number) {
  const button = await ctx.app.client.$(Selectors.NEW_SPLIT_BUTTON)
  await button.waitForExist()
  await button.click()
  await ReplExpect.splitCount(splitCount)(ctx.app)

  await ctx.app.client.waitUntil(() => ctx.app.client['isActive'](Selectors.CURRENT_PROMPT_FOR_SPLIT(splitCount)), {
    timeout: CLI.waitTimeout
  })
}

/** Split the terminal in the current tab by using the split button */
export function splitViaButton(this: Common.ISuite, splitCount: number) {
  it(`should split the terminal via button in the current tab and expect splitCount=${splitCount}`, async () => {
    return doSplitViaButton(this, splitCount).catch(Common.oops(this, true))
  })
}

/** Split the terminal in the current tab by using the "split" command */
export function splitViaCommand(
  this: Common.ISuite,
  splitCount: number,
  expectErr = false,
  inverseColors = false,
  where?: { spliceIndex: number; messageShouldAppearHere: number }
) {
  it(`should split the terminal via command in the current tab and expect splitCount=${splitCount}`, async () => {
    try {
      // if we were asked to splice in at a specific position, we will
      // need to remember the split ids before... and check this
      // against the id array after (which we do, just below **)
      const splitIdsBefore =
        where === undefined
          ? undefined
          : await this.app.client
              .$$(Selectors.SPLITS)
              .then(elements => Promise.all(elements.map(_ => _.getAttribute(Selectors.SPLIT_ID))))
      if (where) {
        console.error('before', splitIdsBefore)
      }

      const messageShouldAppearHere = where === undefined ? undefined : where.messageShouldAppearHere

      await CLI.commandInSplit(
        `split ${inverseColors ? ' --inverse' : ''} ${where !== undefined ? ` --index ${where.spliceIndex}` : ''}`,
        this.app,
        splitCount - 1
      )
        .then(
          expectErr
            ? ReplExpect.error(500)
            : ReplExpect.elsewhere(
                inverseColors ? 'Created a split with inverted colors' : 'Created a split',
                messageShouldAppearHere
              )
        )
        .then(ReplExpect.splitCount(splitCount, inverseColors, messageShouldAppearHere))

      if (where !== undefined) {
        // ** now we check that the new split was spliced in at the expected location
        const splitIdsAfter = await this.app.client
          .$$(Selectors.SPLITS)
          .then(elements => Promise.all(elements.map(_ => _.getAttribute(Selectors.SPLIT_ID))))
        const before = !splitIdsBefore ? [] : splitIdsBefore
        const after = !splitIdsAfter ? [] : splitIdsAfter
        console.error('after', splitIdsAfter)

        strictEqual(after.length, before.length + 1, 'expect one more split')
        ok(
          before.every(id => after.indexOf(id) >= 0),
          'all previous splits still exist'
        )
        strictEqual(before.indexOf(after[where.spliceIndex]), -1, 'new split id should not be found in before list')
      }
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
}

/** Close the split in the current tab by using the "exit" command */
export function close(this: Common.ISuite, splitCount: number, inSplit: number) {
  it(`should close the split via command in the current tab and expect splitCount=${splitCount}`, () =>
    CLI.commandInSplit('exit', this.app, inSplit)
      .then(() => ReplExpect.splitCount(splitCount)(this.app))
      .catch(Common.oops(this, true)))
}

/** Close the split in the current tab by clicking the close button */
export function closeViaButton(this: Common.ISuite, splitCount: number, inSplit: number) {
  it(`should close the split via button in the current tab and expect splitCount=${splitCount}`, () =>
    this.app.client
      .$(Selectors.SPLIT_N_CLOSE(inSplit))
      .then(_ => _.click())
      .then(() => ReplExpect.splitCount(splitCount)(this.app))
      .catch(Common.oops(this, true)))
}

/** Clear the split in the current tab by clicking the clear button */
export function clearViaButton(this: Common.ISuite, inSplit: number) {
  const expectBlockCount = ReplExpect.blockCount.bind(this)

  it(`should close the split via button in the current tab and expect blockCount=1`, () =>
    this.app.client
      .$(Selectors.SPLIT_N_CLEAR(inSplit))
      .then(_ => _.click())
      .then(async () => {
        await expectBlockCount()
          .inSplit(inSplit)
          .is(1)
      })
      .catch(Common.oops(this, true)))
}

async function clickToFocus(this: Common.ISuite, toSplitIndex: number) {
  console.error('1')
  await this.app.client.$(Selectors.SPLIT_N_FOCUS(toSplitIndex)).then(_ => _.click())
  console.error('2')
  await this.app.client.waitUntil(
    () => this.app.client.$(Selectors.CURRENT_PROMPT_FOR_SPLIT(toSplitIndex)).then(_ => _.isFocused()),
    { timeout: CLI.waitTimeout }
  )
  console.error('3', await this.app.client.$(Selectors.CURRENT_PROMPT_FOR_SPLIT(toSplitIndex)).then(_ => _.isFocused()))
}

export function focus(this: Common.ISuite, toSplitIndex: number) {
  const clickOn = clickToFocus.bind(this)
  it(`should click to focus on split ${toSplitIndex}`, () => clickOn(toSplitIndex).catch(Common.oops(this, true)))
}

export function expectSplits(this: Common.ISuite, nSplits: number) {
  it(`should have ${nSplits} split${nSplits === 1 ? '' : 's'}`, () => ReplExpect.splitCount(nSplits)(this.app))
}

/** Click to focus the given split */
export function focusAndValidate(this: Common.ISuite, fromSplitIndex: number, toSplitIndex: number) {
  it(`should click to focus from split ${fromSplitIndex} to split ${toSplitIndex}`, async () => {
    try {
      const res1 = await CLI.commandInSplit('split-debug', this.app, fromSplitIndex)
      const N1 = res1.count
      const id1 = await this.app.client.$(Selectors.OUTPUT_N(N1, fromSplitIndex)).then(_ => _.getText())

      await clickToFocus.bind(this)(toSplitIndex)

      // last true: noFocus, since we want to do this ourselves
      const res2 = await CLI.commandInSplit('split-debug', this.app, toSplitIndex)
      const N2 = res2.count
      const id2 = await this.app.client.$(Selectors.OUTPUT_N(N2, toSplitIndex)).then(_ => _.getText())
      console.error('5')

      notStrictEqual(id1, id2, 'the split identifiers should differ')
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
}

function checkIsLeftStrip(ctx: Common.ISuite, N: number) {
  return ctx.app.client.$(Selectors.SPLIT_N_AS_LEFT_STRIP(N)).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
}

function checkIsBottomStrip(ctx: Common.ISuite, N: number) {
  return ctx.app.client.$(Selectors.SPLIT_N_AS_BOTTOM_STRIP(N)).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
}

function checkIsDefault(ctx: Common.ISuite, N: number) {
  return ctx.app.client.$(Selectors.SPLIT_N_AS_DEFAULT(N)).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
}

export function isLeftStrip(this: Common.ISuite, N: number) {
  it(`should show split ${N} as being a left strip`, () => checkIsLeftStrip(this, N).catch(Common.oops(this, true)))
}

export function isBottomStrip(this: Common.ISuite, N: number) {
  it(`should show split ${N} as being a bottom strip`, () => checkIsBottomStrip(this, N).catch(Common.oops(this, true)))
}

export function isDefault(this: Common.ISuite, N: number) {
  it(`should show split ${N} as being a default strip`, () => checkIsDefault(this, N).catch(Common.oops(this, true)))
}

/** Toggle the position of the given split */
export function doToggleSplitPosition(
  this: Common.ISuite,
  expectedPosition: SplitPosition = 'bottom-strip',
  inSplit: number,
  expectedSplitCount = 2
) {
  it(`should turn split ${inSplit} into a ${expectedPosition} strip`, async () => {
    try {
      await this.app.client.$(Selectors.SPLIT_N_POSITION_TOGGLE(inSplit)).then(_ => _.click())

      if (expectedPosition === 'bottom-strip') {
        await checkIsBottomStrip(this, inSplit)
      } else if (expectedPosition === 'left-strip') {
        await checkIsLeftStrip(this, inSplit)
      } else {
        await checkIsDefault(this, inSplit)
      }

      // we better not have lost a split
      await ReplExpect.splitCount(expectedSplitCount)(this.app)

      // and the other splits had better still be default/regular splits
      for (let idx = 1; idx <= expectedSplitCount; idx++) {
        if (idx !== inSplit) {
          await checkIsDefault(this, idx)
        }
      }
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
}
