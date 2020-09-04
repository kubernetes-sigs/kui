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

import { notStrictEqual } from 'assert'
import { CLI, Common, ReplExpect, Selectors } from '@kui-shell/test'

/** Split the terminal in the current tab by using the split button */
export function splitViaButton(this: Common.ISuite, splitCount: number) {
  it(`should split the terminal via button in the current tab and expect splitCount=${splitCount}`, async () => {
    try {
      await this.app.client.click(Selectors.NEW_SPLIT_BUTTON)
      await ReplExpect.splitCount(splitCount)(this.app)

      await this.app.client.waitUntil(
        () => this.app.client.hasFocus(Selectors.CURRENT_PROMPT_FOR_SPLIT(splitCount)),
        CLI.waitTimeout
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
}

/** Split the terminal in the current tab by using the "split" command */
export function splitViaCommand(this: Common.ISuite, splitCount: number, expectErr = false) {
  it(`should split the terminal via command in the current tab and expect splitCount=${splitCount}`, () => {
    return CLI.commandInSplit('split', this.app, splitCount - 1)
      .then(expectErr ? ReplExpect.error(500) : ReplExpect.elsewhere('Created a new split'))
      .then(ReplExpect.splitCount(splitCount))
      .catch(Common.oops(this, true))
  })
}

/** Close the split in the current tab by using the "exit" command */
export function close(this: Common.ISuite, splitCount: number, inSplit: number) {
  it(`should close the split via command in the current tab and expect splitCount=${splitCount}`, () =>
    CLI.commandInSplit('exit', this.app, inSplit)
      .then(() => ReplExpect.splitCount(splitCount)(this.app))
      .catch(Common.oops(this, true)))
}

async function clickToFocus(this: Common.ISuite, toSplitIndex: number) {
  console.error('1')
  await this.app.client.click(Selectors.SPLIT_N_FOCUS(toSplitIndex))
  console.error('2')
  await this.app.client.waitUntil(
    () => this.app.client.hasFocus(Selectors.CURRENT_PROMPT_FOR_SPLIT(toSplitIndex)),
    CLI.waitTimeout
  )
  console.error('3', await this.app.client.hasFocus(Selectors.CURRENT_PROMPT_FOR_SPLIT(toSplitIndex)))
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
      const res1 = await CLI.commandInSplit('split --debug', this.app, fromSplitIndex)
      const N1 = res1.count
      const id1 = await this.app.client.getText(Selectors.OUTPUT_N(N1))

      await clickToFocus.bind(this)(toSplitIndex)

      // last true: noFocus, since we want to do this ourselves
      const res2 = await CLI.commandInSplit('split --debug', this.app, toSplitIndex)
      const N2 = res2.count
      const id2 = await this.app.client.getText(Selectors.OUTPUT_N(N2))
      console.error('5')

      notStrictEqual(id1, id2, 'the split identifiers should differ')
    } catch (err) {
      await Common.oops(this, true)
    }
  })
}
