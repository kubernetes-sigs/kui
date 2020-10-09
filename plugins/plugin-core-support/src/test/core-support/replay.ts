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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect, Util } from '@kui-shell/test'

import { splitViaButton, focus } from '../core-support2/split-helpers'

import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const base64Input = 'hi'
const base64Output = Buffer.from(base64Input).toString('base64')

describe(`snapshot and replay with title ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const file = Util.uniqueFileForSnapshot()
  const testTabLabel1 = 'test1'
  const testTabLabel2 = 'test2'

  const doReplay = (testTabLabel: string) => {
    it('should replay', async () => {
      try {
        await CLI.command(`replay ${file}`, this.app)

        await this.app.client.waitForExist(Selectors.TOP_TAB_WITH_TITLE(testTabLabel), CLI.waitTimeout)

        let idx = 0
        await this.app.client.waitUntil(async () => {
          const txt = await this.app.client.getText(Selectors.OUTPUT_LAST)
          if (++idx > 5) {
            console.error(`still waiting for expected=${base64Output}; actual=${txt}`)
          }
          return txt === base64Output
        }, CLI.waitTimeout)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  it(`should open new tab with title ${testTabLabel1}`, () =>
    CLI.command(`tab new --title ${testTabLabel1}`, this.app)
      .then(() => CLI.waitForSession(this))
      .catch(Common.oops(this)))

  it(`should base64 ${base64Input}`, () =>
    CLI.command(`base64 ${base64Input}`, this.app)
      .then(ReplExpect.okWithString(base64Output))
      .catch(Common.oops(this, true)))

  it('should snapshot without specifying title', () =>
    CLI.command(`snapshot ${file}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  // clear the tabs so there isn't a tab naming `testTabLabel1`
  it('should refresh', () => Common.refresh(this))
  doReplay(testTabLabel1)

  it(`should snapshot with title ${testTabLabel2}`, () =>
    CLI.command(`snapshot ${file} --title ${testTabLabel2}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  // clear the tabs so there isn't a tab naming `testTabLabel2`
  it('should refresh', () => Common.refresh(this))
  doReplay(testTabLabel2)

  it('should snapshot again but without specifying title', () =>
    CLI.command(`snapshot ${file}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  // Currently, The replay command will display the notebook in a new tab.
  // Without refreshing, the second tab can't be opened due to tab name duplication.
  it('should refresh', () => Common.refresh(this))

  doReplay(testTabLabel2)
})

describe(`snapshot and replay ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const file = Util.uniqueFileForSnapshot()

  it(`should base64 ${base64Input}`, () =>
    CLI.command(`base64 ${base64Input}`, this.app)
      .then(ReplExpect.okWithString(base64Output))
      .catch(Common.oops(this, true)))

  // do something to open the sidecar, so we can verify it's not open on replay
  it('should open sidecar', () =>
    CLI.command(`open ${(join(ROOT), 'package.json')}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .catch(Common.oops(this, true)))

  it('should snapshot', () =>
    CLI.command(`snapshot ${file}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should refresh', () => Common.refresh(this))

  it('should replay', async () => {
    try {
      await CLI.command(`replay ${file} --status-stripe blue`, this.app)

      await this.app.client.waitForExist(Selectors.STATUS_STRIPE_TYPE('blue'), CLI.waitTimeout)

      const res = await CLI.command('version', this.app)

      // verify the base64 command replay
      let idx = 0
      await this.app.client.waitUntil(async () => {
        const txt = await this.app.client.getText(Selectors.OUTPUT_N(res.count - 2))
        if (++idx > 5) {
          console.error(`still waiting for expected=${base64Output}; actual=${txt}`)
        }
        return txt === base64Output
      }, CLI.waitTimeout)

      // verify the about replay
      await SidecarExpect.notOpen(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should clear and show default status stripe', async () => {
    await CLI.command('clear', this.app).then(() => ReplExpect.consoleToBeClear(this.app))

    await this.app.client.waitForExist(Selectors.STATUS_STRIPE_TYPE('default'))
  })
})

describe(`split-snapshot-replay ${process.env.MOCHA_RUN_TARGET || ''}`, async function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const file = Util.uniqueFileForSnapshot()
  const splitTheTerminalViaButton = splitViaButton.bind(this)
  const clickToFocus = focus.bind(this)

  const doBase64 = (splitIdx: number) => {
    clickToFocus(splitIdx)
    it(`should base64 ${base64Input}`, () =>
      CLI.commandInSplit(`base64 ${base64Input}`, this.app, splitIdx)
        .then(ReplExpect.okWithString(base64Output))
        .catch(Common.oops(this, true)))
  }

  const doSnapShot = (splitIdx: number) => {
    it('should snapshot with exec', () =>
      CLI.commandInSplit(`snapshot ${file} --exec`, this.app, splitIdx)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this, true)))
  }

  doBase64(1)
  splitTheTerminalViaButton(2)
  clickToFocus(2)
  doBase64(2)
  splitTheTerminalViaButton(3)
  doBase64(3)

  doSnapShot(3)

  it('should refresh', () => Common.refresh(this))
  it('should replay', () => CLI.command(`replay ${file}`, this.app).catch(Common.oops(this, true)))
  it('should validate replay', async () => {
    try {
      let idx = 0
      await this.app.client.waitUntil(async () => {
        // commands in split1: [session connect in browser],base64, split, version
        const base64InSplit1 = await this.app.client.getText(Selectors.OUTPUT_LAST_FOR_SPLIT(1))
        // commands in split2: base64,version
        const base64InSplit2 = await this.app.client.getText(Selectors.OUTPUT_LAST_FOR_SPLIT(2))

        const base64InSplit3 = await this.app.client.getText(Selectors.OUTPUT_LAST_FOR_SPLIT(3))

        if (++idx > 5) {
          console.error(
            `still waiting for expected=${base64Output}; actual=${base64InSplit1}, ${base64InSplit2}, ${base64InSplit3}`
          )
        }
        return base64InSplit1 === base64Output && base64InSplit2 === base64Output && base64InSplit3 === base64Output
      }, CLI.waitTimeout)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})

Common.proxyDescribe(`core snapshot and replay by query ${process.env.MOCHA_RUN_TARGET || ''}`, function(
  this: Common.ISuite
) {
  before(Common.before(this))
  after(Common.after(this))

  const file = Util.uniqueFileForSnapshot()

  it(`should base64 ${base64Input}`, () =>
    CLI.command(`base64 ${base64Input}`, this.app)
      .then(ReplExpect.okWithString(base64Output))
      .catch(Common.oops(this, true)))

  const title = 'replay-by-query'

  it('should snapshot', () =>
    CLI.command(`snapshot ${file} --title ${title}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should replay by query', async () => {
    try {
      await this.app.client.url(`${process.env.WEBPACK_CLIENT_URL}?command=replay ${file}`)
      await this.app.client.waitForExist(Selectors.TOP_TAB_WITH_TITLE(title), CLI.waitTimeout)

      // verify the base64 command replay
      let idx = 0
      await this.app.client.waitUntil(async () => {
        const txt = await this.app.client.getText(Selectors.OUTPUT_LAST)
        if (++idx > 5) {
          console.error(`still waiting for expected=${base64Output}; actual=${txt}`)
        }
        return txt === base64Output
      }, CLI.waitTimeout)

      // back to the original url, without this line, the following tests will fail at `before` state
      await this.app.client.url(process.env.WEBPACK_CLIENT_URL)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
