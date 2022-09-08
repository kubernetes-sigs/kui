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

import { Common, CLI, ReplExpect } from '@kui-shell/test'
import { expectSplits, splitViaButton } from './split-helpers'

function doEcho(this: Common.ISuite, msg: string, splitIndex = 1) {
  const cmd = `echo ${msg}`

  it(`should ${cmd}`, () =>
    CLI.commandInSplit(cmd, this.app, splitIndex).then(ReplExpect.okWithPtyOutput(msg)).catch(Common.oops(this, true)))

  return cmd
}

function doValidate(this: Common.ISuite, num: number, msg: string, splitIndex = 1) {
  it(`should list history ${num} expecting ${msg}`, () =>
    CLI.commandInSplit(`history ${num}`, this.app, splitIndex).then(ReplExpect.okWith(msg)).catch(Common.oops(this)))
}

describe('command history with splits', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const echo = doEcho.bind(this)
  const split = splitViaButton.bind(this)
  const validate1 = doValidate.bind(this, 1)
  const validate2 = doValidate.bind(this, 3)
  const validate5 = doValidate.bind(this, 6)
  const count = expectSplits.bind(this)

  const msg1 = 'xxxx'
  const msg2 = 'yyyy'

  count(1)
  const cmd1 = echo(msg1)
  validate1(cmd1, 1)
  count(1)

  split(2)
  count(2)

  validate2(cmd1, 2) // history should have been copied over
  const cmd2 = echo(msg2, 2)
  count(2)
  validate1(cmd2, 2) // msg2 better be the very last history entry
  validate5(cmd1, 2) // msg1 had better be the fifth-last entry
  count(2)

  // msg2 better not be in the history for the first split
  validate2(cmd1, 1)
  count(2)
})
