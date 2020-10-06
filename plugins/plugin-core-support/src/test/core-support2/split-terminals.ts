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

import { join } from 'path'
import { tmpdir } from 'os'
import { mkdir, rmdir } from 'fs-extra'

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'
import {
  close,
  expectSplits,
  focusAndValidate,
  doSplitViaButton,
  splitViaButton,
  splitViaCommand
} from './split-helpers'

import { doClear } from '../core-support/clear'

/** Report Version */
function version(this: Common.ISuite, splitIndex: number) {
  it(`should report proper version with splitIndex=${splitIndex}`, () =>
    CLI.commandInSplit('version', this.app, splitIndex)
      .then(ReplExpect.okWithCustom({ expect: Common.expectedVersion }))
      .then(ReplExpect.splitCount(splitIndex))
      .catch(Common.oops(this, true)))
}

/** Make a temporary directory, and return its full path */
function dir(basename: string) {
  const fullpath = join(tmpdir(), basename)
  it(`should create a tmp dir ${fullpath}`, async () => {
    await rmdir(fullpath).catch(err => {
      if (err.code !== 'ENOENT') {
        throw err
      }
    })
    return mkdir(fullpath)
  })

  return {
    fullpath,
    clean: () => it(`should remove tmp dir ${fullpath}`, () => rmdir(fullpath))
  }
}

function inDir(this: Common.ISuite, fullpath: string, splitIndex: number) {
  it(`should be in dir ${fullpath}`, () =>
    CLI.commandInSplit('pwd', this.app, splitIndex)
      .then(ReplExpect.okWithPtyOutput(fullpath))
      .catch(Common.oops(this, true)))
}

/** Change Kui's working directory */
function changeDir(this: Common.ISuite, dir: string, splitIndex: number) {
  it(`should cd to ${dir}`, () =>
    CLI.commandInSplit(`cd "${dir}"`, this.app, splitIndex)
      .then(ReplExpect.okWithString(dir))
      .catch(Common.oops(this, true)))
}

// ensure that the "created split" block disappears when the new split is closed
describe(`split terminals created split check ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const clear = doClear.bind(this)
  const count = expectSplits.bind(this)
  const closeTheSplit = close.bind(this)
  const verifyBlockCount = ReplExpect.blockCount
    .bind(this)()
    .inSplit(1)
  const splitTheTerminalViaCommand = splitViaCommand.bind(this)

  it('should clear the console', () => clear(1, 1))
  verifyBlockCount.is(1)
  splitTheTerminalViaCommand(2)
  count(2)

  it('should clear the console', () => clear(2, 1))
  verifyBlockCount.is(2) // the "created split" message should persist, since the split is still alive

  closeTheSplit(1, 2) // expect 1 residual split, and execute the `exit` command in split 2

  verifyBlockCount.is(1) // the "created split" message should be gone!
  it('should clear the console', () => clear())
  verifyBlockCount.is(1) // the "created split" message should be gone!
})

describe(`split terminals spliceIndex variant 1 ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const splitTheTerminalViaCommand = splitViaCommand.bind(this)
  const count = expectSplits.bind(this)

  splitTheTerminalViaCommand(2)
  count(2)

  splitTheTerminalViaCommand(3, undefined, undefined, { spliceIndex: 1, messageShouldAppearHere: 3 })
  count(3)
})

describe(`split terminals spliceIndex variant 2 ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const splitTheTerminalViaCommand = splitViaCommand.bind(this)
  const count = expectSplits.bind(this)

  splitTheTerminalViaCommand(2, undefined, undefined, { spliceIndex: 0, messageShouldAppearHere: 2 })
  count(2)
})

describe(`split terminals close all ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const splitTheTerminalViaCommand = splitViaCommand.bind(this)
  const count = expectSplits.bind(this)
  const showVersion = version.bind(this)

  it('should create a new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  splitTheTerminalViaCommand(2)

  count(2)

  it('should close that new tab entirely, i.e. all splits plus the tab should be closed', () =>
    CLI.command('tab close -A', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  showVersion(1)
})

describe(`split terminals output ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('verify the version still shown in the first split', async () => {
    try {
      const res = await CLI.command('version', this.app)
      await ReplExpect.okWithCustom({ expect: Common.expectedVersion })(res)
      const N = res.count

      await this.app.client.click(Selectors.NEW_SPLIT_BUTTON)
      await ReplExpect.splitCount(2)(this.app)

      await this.app.client.click(Selectors.NEW_SPLIT_BUTTON)
      await ReplExpect.splitCount(3)(this.app)

      let idx = 0
      await this.app.client.waitUntil(async () => {
        console.error('test', `${Selectors.OUTPUT_N(N, 1)} .repl-result`)
        const actualVersion = await this.app.client.getText(Selectors.OUTPUT_N(N, 1))

        if (++idx > 5) {
          console.error(`still waiting for expected=${Common.expectedVersion}; actual=${actualVersion}`)
        }
        return actualVersion === Common.expectedVersion
      }, CLI.waitTimeout)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})

describe(`split terminals general ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const showVersion = version.bind(this)
  const splitTheTerminalViaButton = splitViaButton.bind(this)
  const splitTheTerminalViaCommand = splitViaCommand.bind(this)
  const closeTheSplit = close.bind(this)
  const focusOnSplit = focusAndValidate.bind(this)
  const count = expectSplits.bind(this)
  const cd = changeDir.bind(this)
  const cwdIs = inDir.bind(this)

  // here come the tests

  const { fullpath: dir1, clean: clean1 } = dir('aaa')
  const { fullpath: dir2, clean: clean2 } = dir('bbb')

  cd(dir1, 1)
  cwdIs(dir1, 1)
  count(1)
  splitTheTerminalViaCommand(2, false, true)
  count(2)
  focusOnSplit(1, 2)
  cwdIs(dir1, 2)
  cd(dir2, 2)
  cwdIs(dir2, 2)
  count(2)
  showVersion(2)
  count(2)
  focusOnSplit(2, 1)
  count(2)
  cwdIs(dir1, 1)
  closeTheSplit(1, 2)
  count(1)

  it('should still show version as the command, not exit', () => {
    return CLI.expectPriorInput(Selectors.PROMPT_N(1), 'version')
  })

  clean1()
  clean2()

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

describe('split an active split', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const expectBlockCount = ReplExpect.blockCount.bind(this)

  it('should sleep for a few seconds in Kui, then click the split button before the sleep is finished', async () => {
    try {
      await CLI.command('sleep 5', this.app)
      await ReplExpect.splitCount(1)(this.app)

      console.error('A')
      await doSplitViaButton(this, 2)
      await ReplExpect.splitCount(2)(this.app)

      console.error('B')
      await doSplitViaButton(this, 3)
      await ReplExpect.splitCount(3)(this.app)

      console.error('C')
      await expectBlockCount()
        .inSplit(1)
        .is(3)
      await ReplExpect.splitCount(3)(this.app)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})

describe('split close and reopen', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const expectBlockCount = ReplExpect.blockCount.bind(this)
  const splitTheTerminalViaButton = splitViaButton.bind(this)
  const closeTheSplit = close.bind(this)
  const count = expectSplits.bind(this)

  count(1)
  splitTheTerminalViaButton(2)
  count(2)
  splitTheTerminalViaButton(3)
  count(3)
  closeTheSplit(2, 3)
  count(2)
  splitTheTerminalViaButton(3)
  count(3)

  it('should add a command and have only one more block', async () => {
    try {
      await expectBlockCount()
        .inSplit(3)
        .is(1)

      await CLI.commandInSplit('# hello', this.app, 3).then(ReplExpect.okWithString('hello'))

      await expectBlockCount()
        .inSplit(3)
        .is(2)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
