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

/**
 * Test terminal splits
 *
 */

import { notStrictEqual } from 'assert'
import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

/** Report Version */
function version(this: Common.ISuite, splitCount: number) {
  it(`should report proper version with splitCount=${splitCount}`, () =>
    CLI.command('version', this.app)
      .then(ReplExpect.okWithCustom({ expect: Common.expectedVersion }))
      .then(ReplExpect.splitCount(splitCount))
      .catch(Common.oops(this)))
}

/** Split the terminal in the current tab by using the split button */
function splitViaButton(this: Common.ISuite, splitCount: number) {
  it(`should split the terminal via button in the current tab and expect splitCount=${splitCount}`, async () => {
    try {
      await this.app.client.click(Selectors.NEW_SPLIT_BUTTON)
      await ReplExpect.splitCount(splitCount)(this.app)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
}

/** Split the terminal in the current tab by using the "split" command */
function splitViaCommand(this: Common.ISuite, splitCount: number, expectErr = false) {
  it(`should split the terminal via command in the current tab and expect splitCount=${splitCount}`, () =>
    CLI.command('split', this.app)
      .then(expectErr ? ReplExpect.error(500) : ReplExpect.justOK)
      .then(ReplExpect.splitCount(splitCount))
      .catch(Common.oops(this, true)))
}

/** Close the split in the current tab by using the "exit" command */
function close(this: Common.ISuite, splitCount: number) {
  it(`should close the split via command in the current tab and expect splitCount=${splitCount}`, () =>
    CLI.command('exit', this.app)
      .then(() => ReplExpect.splitCount(splitCount)(this.app))
      .catch(Common.oops(this, true)))
}

/** Click to focus the given split */
function focus(this: Common.ISuite, fromSplitIndex: number, toSplitIndex: number) {
  it(`should click to focus from split ${fromSplitIndex} to split ${toSplitIndex}`, async () => {
    try {
      const res1 = await CLI.command(
        'split --debug',
        this.app,
        undefined,
        undefined,
        true,
        Selectors.CURRENT_PROMPT_BLOCK_FOR_SPLIT(fromSplitIndex),
        Selectors.CURRENT_PROMPT_FOR_SPLIT(fromSplitIndex)
      )
      const N1 = res1.count
      const id1 = await this.app.client.getText(Selectors.OUTPUT_N(N1))

      console.error('1')
      await this.app.client.click(Selectors.SPLIT_N(toSplitIndex))
      console.error('2')
      await this.app.client.waitUntil(
        () => this.app.client.hasFocus(Selectors.CURRENT_PROMPT_FOR_SPLIT(toSplitIndex)),
        CLI.waitTimeout
      )
      console.error('3')

      // last true: noFocus, since we want to do this ourselves
      const res2 = await CLI.command(
        'split --debug',
        this.app,
        undefined,
        undefined,
        true,
        Selectors.CURRENT_PROMPT_BLOCK_FOR_SPLIT(toSplitIndex),
        Selectors.CURRENT_PROMPT_FOR_SPLIT(toSplitIndex)
      )
      const N2 = res2.count
      const id2 = await this.app.client.getText(Selectors.OUTPUT_N(N2))
      console.error('5')

      notStrictEqual(id1, id2, 'the split identifiers should differ')
    } catch (err) {
      await Common.oops(this, true)
    }
  })
}

describe(`split terminals ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const showVersion = version.bind(this)
  const splitTheTerminalViaButton = splitViaButton.bind(this)
  const splitTheTerminalViaCommand = splitViaCommand.bind(this)
  const closeTheSplit = close.bind(this)
  const focusOnSplit = focus.bind(this)

  // here come the tests

  splitTheTerminalViaCommand(2)
  focusOnSplit(1, 2)
  showVersion(2)
  focusOnSplit(2, 1)
  closeTheSplit(1)
  it('should still show version as the command, not exit', () => {
    return CLI.expectPriorInput(Selectors.PROMPT_N(1), 'version')
  })

  it('should refresh', () => Common.refresh(this))

  showVersion(1)
  splitTheTerminalViaButton(2)
  showVersion(2)

  /* if (MAX_TERMINALS === 3) {
    splitTheTerminalViaButton(3)
    showVersion(3)
    splitTheTerminalViaCommand(3, true)

    closeTheSplit(2)
    showVersion(2)
    splitTheTerminalViaButton(3)
    showVersion(3)
    closeTheSplit(2)
  } */

  closeTheSplit(1)
  splitTheTerminalViaCommand(2)
  closeTheSplit(1)

  splitTheTerminalViaCommand(2)
  focusOnSplit(1, 2)

  /* if (MAX_TERMINALS === 3) {
    splitTheTerminalViaCommand(3)
    focusOnSplit(2, 1)
    focusOnSplit(1, 2)
    focusOnSplit(2, 3)
  } */
})
