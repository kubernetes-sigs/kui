/*
 * Copyright 2019 IBM Corporation
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

import { Common, CLI, ReplExpect, Selectors, Keys, Util } from '@kui-shell/test'

import { tabButtonSelector } from '../../lib/cmds/tab-management'

describe('core new tab switch tabs', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it(`switch back to first tab via command`, () =>
    CLI.command('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it(`switch back to second tab via command`, () =>
    CLI.command('tab switch 2', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should close tab via "tab close" command', () =>
    CLI.command('tab close', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))
})

describe('core new tab conditional', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('should NOT open a new tab with if on false condition', async () => {
    try {
      await CLI.command('tab new --if "kuiconfig is set yoyoyo"', this.app)
      await this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true)
      await this.app.client.waitForExist(Selectors.TAB_N(3), 5000, true)
      await this.app.client.waitForExist(Selectors.TAB_N(4), 5000, true)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  it('should YES open a new tab with ifnot on false condition', async () => {
    try {
      await CLI.command('tab new --ifnot "kuiconfig is set yoyoyo"', this.app)
      await this.app.client.waitForExist(Selectors.TAB_N(2))
      await this.app.client.waitForExist(Selectors.TAB_N(3), 5000, true)
      await this.app.client.waitForExist(Selectors.TAB_N(4), 5000, true)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  // start from scratch...
  Util.closeAllExceptFirstTab.bind(this)()

  it('should set condition', () =>
    CLI.command('kuiconfig set yoyoyo 333', this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))
  it('should validate set condition', () =>
    CLI.command('kuiconfig get yoyoyo', this.app)
      .then(ReplExpect.okWithString('333'))
      .catch(Common.oops(this, true)))

  it('should NOT open a new tab with ifnot on true condition', async () => {
    try {
      await CLI.command('tab new --ifnot "kuiconfig is set yoyoyo"', this.app)
      await this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true)
      await this.app.client.waitForExist(Selectors.TAB_N(3), 5000, true)
      await this.app.client.waitForExist(Selectors.TAB_N(4), 5000, true)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  it('should NOT open a new tab with if on false condition using config not yet', async () => {
    try {
      await CLI.command('tab new --if "kuiconfig not set yoyoyo"', this.app)
      await this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true)
      await this.app.client.waitForExist(Selectors.TAB_N(3), 5000, true)
      await this.app.client.waitForExist(Selectors.TAB_N(4), 5000, true)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  it('should YES open a new tab with if on true condition', async () => {
    try {
      await CLI.command('tab new --if "kuiconfig is set yoyoyo"', this.app)
      await this.app.client.waitForExist(Selectors.TAB_N(2))
      await this.app.client.waitForExist(Selectors.TAB_N(3), 5000, true)
      await this.app.client.waitForExist(Selectors.TAB_N(4), 5000, true)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})

describe('core new tab onClose', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const closers = [
    // Variant 1: execute `tab close` command
    () =>
      it('should close tab via "tab close" command', () =>
        CLI.command('tab close', this.app)
          .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
          .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
          .then(() => CLI.waitForRepl(this.app)) // should have an active repl
          .catch(Common.oops(this, true))),

    // Variant 2: click on the tab closer button in the UI
    () =>
      it('should close by clicking on the tab closer button', async () => {
        try {
          await this.app.client.click(Selectors.CURRENT_TAB_CLOSE)
          await this.app.client
            .waitForExist(Selectors.TAB_N(2), 5000, true)
            .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
          await CLI.waitForRepl(this.app) // should have an active repl
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
  ]

  closers.forEach((closeNewTab, idx) => {
    // the value doesn't matter, but we will validate that, whatever it
    // is, the kuiconfig has this value set onClose
    const key = 'foo-' + idx
    const value = '999999-' + idx

    Util.closeAllExceptFirstTab.bind(this)()
    it(`should successfully open a new tab with onClose handler ${key}=${value}`, async () => {
      try {
        await CLI.command(`tab new --onClose "kuiconfig set ${key} ${value}"`, this.app)
        await CLI.waitForRepl(this.app) // should have an active repl
        await this.app.client.waitForExist(Selectors.TAB_N(2))
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    closeNewTab()
    it(`should show the effect of the onClose handler, now that the tab is closed: ${key}=${value}`, async () => {
      try {
        let idx = 0
        await this.app.client.waitUntil(async () => {
          const res = await CLI.command(`kuiconfig get ${key}`, this.app)

          const actualValue = await this.app.client.getText(Selectors.OUTPUT_N(res.count))
          if (++idx > 5) {
            console.error(`still waiting for kuiconfig value actualValue=${actualValue} expectedValue=${value}`)
          }
          return actualValue === value
        }, CLI.waitTimeout)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  })
})

describe('core new tab with custom title', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  /** Create a new tab; again=true means that we expect to visit a tab already created */
  const newTabWithTitle = (title: string, N: number, again = false, expectedTitle = title) => {
    it(`new tab via command with custom title: ${title}`, () =>
      CLI.command(`tab new --title ${/s/.test(title) ? `"${title}"` : title}`, this.app)
        .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(N)))
        .then(() => (again ? Promise.resolve() : CLI.waitForSession(this))) // should have an active repl
        .then(() =>
          this.app.client.waitUntil(async () => {
            const actualTitle = await this.app.client.getText(Selectors.CURRENT_TAB_TITLE)
            return actualTitle === expectedTitle
          }, CLI.waitTimeout)
        )
        .catch(Common.oops(this, true)))
  }

  // single word title
  newTabWithTitle('smurf', 2)

  // repeat the first, and expect to be in the second tab (i.e. we should re-use the first 'smurf')
  newTabWithTitle('smurf', 2, true)

  it(`switch back to first tab via command`, () =>
    CLI.command('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  // do that again, after switching back to the first tab; we should be back in the second tab again
  newTabWithTitle('smurf', 2, true)

  // title with whitespace
  newTabWithTitle('space cadet', 3)

  // title with markdown, plus test semicolon parsing
  newTabWithTitle('splash &mdash; bros', 4, false, 'splash — bros')
  //                                                       ^ unicode!
})

describe('core new tab with status stripe decoration', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const validateDecorations = async () => {
    // blue status stripe
    await this.app.client.waitForExist(Selectors.STATUS_STRIPE_TYPE('blue'), CLI.waitTimeout)

    // and our hello world message
    await this.app.client.waitUntil(async () => {
      const actualText = await this.app.client.getText(Selectors.STATUS_STRIPE_MESSAGE)
      return actualText === 'hello world'
    }, CLI.waitTimeout)
  }

  it('should create a new tab with special status stripe decoration', async () => {
    try {
      await CLI.command('tab new --status-stripe-type blue --status-stripe-message "hello world"', this.app)
      await this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2))
      await CLI.waitForSession(this) // should have an active repl
      await validateDecorations()
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it(`switch back to first tab via command`, () =>
    CLI.command('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it('should show a status stripe with default decoration', async () => {
    await this.app.client.waitForExist(Selectors.STATUS_STRIPE_TYPE('default'), CLI.waitTimeout)
  })

  it(`switch back to second tab via command`, () =>
    CLI.command('tab switch 2', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should show a status stripe with blue decoration', async () => {
    await validateDecorations()
  })
})

Common.localDescribe('core new tab switch tabs via keyboard shortcuts', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  if (process.platform === 'darwin') {
    it(`switch back to first tab via keyboard shortcut: meta+1`, () =>
      this.app.client
        .keys([Keys.META, Keys.Numpad1, 'NULL'])
        .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
        .catch(Common.oops(this, true)))

    it(`switch back to second tab via keyboard shortcut: meta+2`, () =>
      this.app.client
        .keys([Keys.META, Keys.Numpad2, 'NULL'])
        .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
        .catch(Common.oops(this, true)))
  }

  it(`switch back to first tab via keyboard shortcut: control+pageUp`, () =>
    this.app.client
      .keys([Keys.CONTROL, Keys.PageUp, 'NULL'])
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it(`switch back to second tab via keyboard shortcut: control+pageDown`, () =>
    this.app.client
      .keys([Keys.CONTROL, Keys.PageDown, 'NULL'])
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should close tab via "tab close" command', () =>
    CLI.command('tab close', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))
})

// test that new tab does not copy any output over from the cloned tab
Common.pDescribe('core new tab from pty active tab via click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  Common.proxyIt('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true))
  )

  it('should less README.md', async () => {
    try {
      const res = await CLI.command('less ../../README.md', this.app)

      const selector = `${Selectors.OUTPUT_N_STREAMING(res.count)} .xterm`
      await this.app.client.waitForExist(selector)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('click new tab button', () =>
    this.app.client
      .click(tabButtonSelector)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  // no xterm copied over!
  it('should have a clean tab', () =>
    this.app.client.waitForVisible(`${Selectors.CURRENT_TAB} .xterm`, 5000, true).catch(Common.oops(this, true)))
})

describe('core new tab from quiescent tab via command', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const CWD1 = process.cwd()
  const CWD2 = '/tmp'

  it(`cd to ${CWD1} in tab1`, () =>
    CLI.command(`cd ${CWD1}`, this.app)
      .then(ReplExpect.okWithString(CWD1))
      .catch(Common.oops(this, true)))

  it('new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD1 ${CWD1} in tab2`, () =>
    CLI.command(`pwd`, this.app)
      .then(ReplExpect.okWithPtyOutput(CWD1))
      .catch(Common.oops(this, true)))

  it(`cd to ${CWD2} in tab2`, () =>
    CLI.command(`cd ${CWD2}`, this.app)
      .then(ReplExpect.okWithString(CWD2))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD2 ${CWD2} in tab2`, () =>
    CLI.command(`pwd`, this.app)
      .then(ReplExpect.okWithPtyOutput(CWD2))
      .catch(Common.oops(this, true)))

  it('should close tab via "exit" command', () =>
    CLI.command('exit', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    CLI.command(`pwd`, this.app)
      .then(ReplExpect.okWithPtyOutput(CWD1))
      .catch(Common.oops(this, true)))

  it('new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it(`cd to ${CWD2} in tab2`, () =>
    CLI.command(`cd ${CWD2}`, this.app)
      .then(ReplExpect.okWithString(CWD2))
      .catch(Common.oops(this, true)))

  it(`switch back to first tab via command`, () =>
    CLI.command('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    CLI.command('pwd', this.app)
      .then(ReplExpect.okWithPtyOutput(CWD1))
      .catch(Common.oops(this, true)))

  it(`switch back to second tab via command`, () =>
    CLI.command('tab switch 2', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD2 ${CWD2} now that we are back in tab2`, () =>
    CLI.command('pwd', this.app)
      .then(ReplExpect.okWithPtyOutput(CWD2))
      .catch(Common.oops(this, true)))

  it(`switch back to first tab via command`, () =>
    CLI.command('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    CLI.command('pwd', this.app)
      .then(ReplExpect.okWithPtyOutput(CWD1))
      .catch(Common.oops(this, true)))
})

describe('core new tab from quiescent tab via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('new tab via button click', () =>
    this.app.client
      .click(tabButtonSelector)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should close tab via "tab close" command', () =>
    CLI.command('tab close', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in first tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))
})

describe('core new tab from active tab via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('start a sleep, then new tab via button click', () =>
    CLI.command('sleep 10000', this.app)
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))
})

describe('core new tab from pty active tab via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('start vi, then new tab via button click', () =>
    CLI.command('vi', this.app)
      .then(() => this.app.client.waitForExist(Selectors.ALT_BUFFER_N(1)))
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))
})

describe('core new tab from active tab that is emitting output via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('start an echo loop, then new tab via button click', () =>
    CLI.command('while true; do echo hi; sleep 1; done', this.app)
      .then(() => new Promise(resolve => setTimeout(resolve, 4000)))
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .then(() => this.app.client.waitForExist(`${Selectors.CURRENT_TAB} .xterm`, 5000, true)) // no xterm DOM in the new tab
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should close by clicking on the tab closer button', async () => {
    await this.app.client.click(Selectors.CURRENT_TAB_CLOSE)
    await this.app.client
      .waitForExist(Selectors.TAB_N(2), 5000, true)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
  })

  it('should execute echo in the new tab, and close the previous tab', async () => {
    try {
      await this.app.client.click(tabButtonSelector)
      await this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2))

      const echoRes = await CLI.command('echo hi', this.app)
      await ReplExpect.okWithPtyOutput('hi')(echoRes)

      await this.app.client.click(Selectors.TOP_TAB_CLOSE_N(1))
      await this.app.client
        .waitForExist(Selectors.TAB_N(2), 5000, true)
        .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))

      await ReplExpect.okWithPtyOutput('hi')(echoRes)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
