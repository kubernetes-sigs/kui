/*
 * Copyright 2021 The Kubernetes Authors
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

import { Common, Util } from '@kui-shell/test'

import {
  close,
  closeViaButton,
  expectSplits,
  doToggleSplitPosition,
  isLeftStrip,
  isRightStrip,
  isDefault,
  splitViaButton
} from './split-helpers'

xdescribe(`right strip splits ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const splitTheTerminalViaButton = splitViaButton.bind(this)
  const togglePosition = doToggleSplitPosition.bind(this)
  const closeViaCommand = close.bind(this)
  const closeTheSplit = closeViaButton.bind(this)
  const leftStrip = isLeftStrip.bind(this)
  const rightStrip = isRightStrip.bind(this)
  const defaultSplit = isDefault.bind(this)
  const count = expectSplits.bind(this)

  // DEFAULT -> DEFAULT+DEFAULT
  count(1)
  splitTheTerminalViaButton(2)
  count(2)

  // DEFAULT+DEFAULT -> RIGHT+DEFAULT
  togglePosition('right-strip', 1)
  count(2)
  rightStrip(1)
  defaultSplit(2)

  // RIGHT+DEFAULT -> LEFT+DEFAULT
  togglePosition('left-strip', 1)
  count(2)
  leftStrip(1)
  defaultSplit(2)

  // LEFT+DEFAULT -> DEFAULT+DEFAULT
  togglePosition('default', 1)
  count(2)
  defaultSplit(1)
  defaultSplit(2)

  // (round robin!) DEFAULT+DEFAULT -> RIGHT+DEFAULT
  togglePosition('right-strip', 1)
  count(2)
  rightStrip(1)
  defaultSplit(2)

  splitTheTerminalViaButton(3)
  count(3)
  rightStrip(1)
  defaultSplit(2)
  defaultSplit(3)

  closeTheSplit(2, 2)
  count(2)
  rightStrip(1)
  defaultSplit(2)

  closeViaCommand(1, 1)
  count(1)
  defaultSplit(1)

  // now verify expected behavior when closing the non-right split in a default+right scenario
  // for good measure, do this a few times
  for (let idx = 0; idx < 3; idx++) {
    count(1)
    splitTheTerminalViaButton(2)
    count(2)
    togglePosition('right-strip', 2)
    defaultSplit(1)
    rightStrip(2)
    closeViaCommand(1, 1) // close the first split, which is the default split
    count(1)
    defaultSplit(1) // verify that the remaining split is a default split
  }

  // now for extra good measure, do the same, but closing the right strip
  for (let idx = 0; idx < 3; idx++) {
    count(1)
    splitTheTerminalViaButton(2)
    count(2)
    togglePosition('right-strip', 1) // 1 this time
    rightStrip(1)
    defaultSplit(2)
    closeViaCommand(1, 1) // close the first split, which is the right strip
    count(1)
    defaultSplit(1) // verify that the remaining split is a default split
  }
})
