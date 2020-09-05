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

describe(`split terminals ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

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
