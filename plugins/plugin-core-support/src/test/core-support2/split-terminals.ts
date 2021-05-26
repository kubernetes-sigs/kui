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
  closeViaButton,
  clearViaButton,
  expectSplits,
  focusAndValidate,
  doSplitViaButton,
  splitViaButton,
  splitViaCommand
} from './split-helpers'

/** Report Version */
function version(this: Common.ISuite, splitIndex: number) {
  it(`should report proper version with splitIndex=${splitIndex}`, async () => {
    try {
      const res = await CLI.commandInSplit('version', this.app, splitIndex)
      await ReplExpect.okWithCustom({ expect: Common.expectedVersion })(res)
      await ReplExpect.splitCount(splitIndex)(res.app)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
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
      .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(2)))
      .then(_ => _.waitForDisplayed())
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  splitTheTerminalViaCommand(2)

  count(2)

  it('should close that new tab entirely, i.e. all splits plus the tab should be closed', () =>
    CLI.command('tab close -A', this.app)
      .then(() => this.app.client.$(Selectors.TAB_N(2)))
      .then(_ => _.waitForExist({ timeout: 5000, reverse: true }))
      .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(1)))
      .then(_ => _.waitForDisplayed())
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

      await this.app.client.$(Selectors.NEW_SPLIT_BUTTON).then(_ => _.click())
      await ReplExpect.splitCount(2)(this.app)

      await this.app.client.$(Selectors.NEW_SPLIT_BUTTON).then(_ => _.click())
      await ReplExpect.splitCount(3)(this.app)

      let idx = 0
      await this.app.client.waitUntil(
        async () => {
          console.error('test', `${Selectors.OUTPUT_N(N, 1)} .repl-result`)
          const actualVersion = await this.app.client.$(Selectors.OUTPUT_N(N, 1)).then(_ => _.getText())

          if (++idx > 5) {
            console.error(`still waiting for expected=${Common.expectedVersion}; actual=${actualVersion}`)
          }
          return actualVersion === Common.expectedVersion
        },
        { timeout: CLI.waitTimeout }
      )
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

  it('should refresh', () => Common.restart(this))

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

  const expectBlockCount = ReplExpect.blockCount.bind(this)
  const splitTheTerminalViaButton = splitViaButton.bind(this)
  const clearTheSplitViaButton = clearViaButton.bind(this)
  const count = expectSplits.bind(this)
  const arr = [close.bind(this), closeViaButton.bind(this)]

  arr.forEach(closeTheSplit => {
    it('should refresh', () => Common.refresh(this))
    Util.closeAllExceptFirstTab.bind(this)()
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

    clearTheSplitViaButton(3)
    closeTheSplit(2, 3)
    count(2)
    closeTheSplit(1, 2)
    count(1)
  })
})

describe('click and show in splits', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const splitTheTerminalViaButton = splitViaButton.bind(this)
  const count = expectSplits.bind(this)

  let selector: string

  const doClickAndValidate = (splitIndex: number) => {
    return this.app.client.waitUntil(async () => {
      await this.app.client.$(selector).then(_ => _.click())

      const text = await this.app.client.$(`${Selectors.OUTPUT_LAST_FOR_SPLIT(splitIndex)}`).then(_ => _.getText())

      return text === 'hi'
    })
  }

  const clickAndValidate = splitIndex => {
    it(`should click in the first split and show in split: ${splitIndex}`, async () => {
      try {
        await doClickAndValidate(splitIndex)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  it('should click in the first split and show in the second split', async () => {
    try {
      await CLI.command('echo hi', this.app).then(ReplExpect.okWithPtyOutput('hi'))

      selector = `${await Util.doList(this, 'history 1', 'echo hi')} [data-value="echo hi"].clickable`
      await doClickAndValidate(2)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  splitTheTerminalViaButton(3)
  count(3)
  clickAndValidate(3)

  splitTheTerminalViaButton(4)
  count(4)
  clickAndValidate(4)

  splitTheTerminalViaButton(5)
  count(5)
  clickAndValidate(5)

  splitTheTerminalViaButton(6)
  count(6)
  clickAndValidate(6)

  splitTheTerminalViaButton(7)
  count(7)
  clickAndValidate(7)

  splitTheTerminalViaButton(8)
  count(8)
  clickAndValidate(8)
})
