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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import { close, expectSplits, focusAndValidate, splitViaButton, splitViaCommand } from './split-helpers'

/** Report Version */
function version(this: Common.ISuite, splitIndex: number) {
  it(`should report proper version with splitIndex=${splitIndex}`, () =>
    CLI.commandInSplit('version', this.app, splitIndex)
      .then(ReplExpect.okWithCustom({ expect: Common.expectedVersion }))
      .then(ReplExpect.splitCount(splitIndex))
      .catch(Common.oops(this, true)))
}

describe(`split terminals ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const showVersion = version.bind(this)
  const splitTheTerminalViaButton = splitViaButton.bind(this)
  const splitTheTerminalViaCommand = splitViaCommand.bind(this)
  const closeTheSplit = close.bind(this)
  const focusOnSplit = focusAndValidate.bind(this)
  const count = expectSplits.bind(this)

  // here come the tests

  count(1)
  splitTheTerminalViaCommand(2)
  count(2)
  focusOnSplit(1, 2)
  count(2)
  showVersion(2)
  count(2)
  focusOnSplit(2, 1)
  count(2)
  closeTheSplit(1, 2)
  count(1)

  it('should still show version as the command, not exit', () => {
    return CLI.expectPriorInput(Selectors.PROMPT_N(1), 'version')
  })

  it('should refresh', () => Common.refresh(this))

  count(1)
  showVersion(1)
  count(1)
  splitTheTerminalViaButton(2)
  count(2)
  showVersion(2)
  count(2)

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

  closeTheSplit(1, 2)
  count(1)
  splitTheTerminalViaCommand(2)
  count(2)
  closeTheSplit(1, 2)
  count(1)

  splitTheTerminalViaCommand(2)
  count(2)
  focusOnSplit(1, 2)
  count(2)

  /* if (MAX_TERMINALS === 3) {
    splitTheTerminalViaCommand(3)
    focusOnSplit(2, 1)
    focusOnSplit(1, 2)
    focusOnSplit(2, 3)
  } */
})
