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

import { Application } from 'spectron'

import { UI } from '@kui-shell/core'
import { promiseEach } from '@kui-shell/core/util/async'

import * as Common from './common'
import * as CLI from './cli'
import * as ReplExpect from './repl-expect'
import * as SidecarExpect from './sidecar-expect'
import * as Selectors from './selectors'
import { keys as Keys } from './keys'

interface TestParam {
  command: string
  testName?: string
  metadata: {
    name: string
    namespace?: string
  }
}

export type MMRExpectMode = Label & (PlainTextContent | YamlContentWithEditor)

export class TestMMR {
  /**
   * new TestMMR() instantiates a class of multi-model-response tests
   * @param { TestParam } param includes: command, testName and metadata
   * @param { string } command is the command needs to be executed
   * @param { string } testName (optional) helps with filtering the Mocha Test Suites by description
   * @param { string } metadata is the metadata shown in Sidecar
   */
  public constructor(public readonly param: TestParam) {} // eslint-disable-line no-useless-constructor

  private testClickResult = (cmdIdx: number, command: string, expect: string) => async (app: Application) => {
    await CLI.expectInput(Selectors.PROMPT_N(cmdIdx), command)(app)
    if (typeof expect === 'string') {
      await ReplExpect.okWithString(expect, true)({ app: app, count: cmdIdx })
    }
  }

  /**
   * name() starts a Mocha Test Suite
   * name() executes `command` in REPL and expects `name` is shown in Sidecar
   */
  public name(opt?: {
    nameHash?: string
    onclick?: {
      name: ClickExpect
      nameHash?: ClickExpect
    }
  }) {
    const { command, testName, metadata } = this.param
    const testClickResult = this.testClickResult

    describe(`mmr name ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const { nameHash, onclick } = opt

      it(`should show name ${nameHash ? 'and namehash' : ''} in sidecar header`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.name(metadata.name))
          .then(app => (nameHash ? SidecarExpect.namehash(nameHash) : app))
          .catch(Common.oops(this, true)))

      let cmdIdx = 0 // keep track of the command execution number

      if (onclick.name) {
        it('should click the name part of sidecar and expect the command shows in repl', async () => {
          try {
            await this.app.client.click(Selectors.SIDECAR_TITLE)
            await testClickResult(++cmdIdx, onclick.name.command, onclick.name.expect)(this.app)
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      }

      if (onclick.nameHash) {
        it('should click the namehash part of sidecar and expect the command shows in repl', async () => {
          try {
            await this.app.client.click(Selectors.SIDECAR_ACTIVATION_TITLE)
            await testClickResult(++cmdIdx, onclick.nameHash.command, onclick.nameHash.expect)(this.app)
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      }
    })
  }

  /**
   * namespace() starts a Mocha Test Suite
   * namespace() executes `command` in REPL and expects `namespace` is shown in Sidecar
   *
   */
  public namespace(opt?: { onclick: ClickExpect }) {
    const { command, testName, metadata } = this.param
    const testClickResult = this.testClickResult

    describe(`mmr namespace ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const onclick = opt && opt.onclick

      it(`should show namespace ${metadata.namespace} in sidecar`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.namespace(metadata.namespace))
          .catch(Common.oops(this, true)))

      if (onclick) {
        it(`should click the namespace part of sidecar and expect the command shows in repl`, async () => {
          try {
            await this.app.client.click(Selectors.SIDECAR_PACKAGE_NAME_TITLE)
            await testClickResult(1, onclick.command, onclick.expect)(this.app)
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      }
    })
  }

  /**
   * kind() starts a Mocha Test Suite
   * kind() executes `command` in REPL and expects `kind` is showin in Sidecar
   * @param { string } kind is the expected kind text shown in the Sidecar
   *
   */
  public kind(kind: string) {
    const { command, testName } = this.param
    describe(`mmr kind ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show kind ${kind} in sidecar`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.kind(kind.toUpperCase()))
          .catch(Common.oops(this, true)))
    })
  }

  /**
   * badges() starts a Mocha Test Suite
   * badges() executes `command` in REPL and expects `badges` are showin in Sidecar
   * @param { UI.Badge[] } badges is the expected badges shown in the Sidecar
   *
   */
  public badges(badges: UI.BadgeSpec[]) {
    const { command, testName } = this.param

    describe(`mmr badges ${testName || ''} ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show badges in sidecar`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(app => Promise.all(badges.map(badge => SidecarExpect.badge(badge.title)(app)))))
    })
  }

  /**
   * modes() starts a Mocha Test Suite
   * modes() executes `command` in REPL and expects `modes` are showin in Sidecar
   * @param { MMRExpectMode[] } expectModes is the expected modes shown as Sidecar Tabs
   * @param { MMRExpectMode } defaultMode is the expected default Sidecar Tab
   * @param  options includes: testWindowButtons
   * @param { boolean } testWindowButtons indicates whether modes() will test the sidecar window buttons as well
   *
   */
  public modes(expectModes: MMRExpectMode[], defaultMode: MMRExpectMode, options?: { testWindowButtons?: boolean }) {
    const { command, testName } = this.param

    describe(`mmr modes ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const showModes = () => {
        it(`should show sidecar tabs`, () =>
          CLI.command(command, this.app)
            .then(ReplExpect.ok)
            .then(SidecarExpect.open)
            .then(SidecarExpect.defaultMode(defaultMode))
            .then(SidecarExpect.modes(expectModes))
            .catch(Common.oops(this, true)))
      }

      const cycleTheTabs = () =>
        expectModes.forEach(expectMode => {
          it(`should switch to the ${expectMode.mode} tab`, async () => {
            try {
              if (await this.app.client.isVisible(Selectors.SIDECAR_MODE_BUTTON(expectMode.mode))) {
                await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(expectMode.mode))
                await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON_SELECTED(expectMode.mode))
              }
            } catch (err) {
              return Common.oops(this)(err)
            }
          })

          if (expectMode.contentType === 'text/plain') {
            it(`should show plain text content in the ${expectMode.mode} tab`, async () => {
              try {
                await SidecarExpect.textPlainContent(expectMode.content)(this.app)
              } catch (err) {
                return Common.oops(this)(err)
              }
            })
          } else if (expectMode.contentType === 'yaml') {
            if (expectMode.editor === true) {
              it(`should open editor and show yaml content in the ${expectMode.mode} tab`, async () => {
                try {
                  await SidecarExpect.yaml(expectMode.content)(this.app)
                } catch (err) {
                  return Common.oops(this)(err)
                }
              })
            } else {
              it(`should show plain yaml content in the ${expectMode.mode} tab`, async () => {
                try {
                  await SidecarExpect.textPlainContent(expectMode.content)(this.app)
                } catch (err) {
                  return Common.oops(this)(err)
                }
              })
            }
          }
        })

      showModes()
      cycleTheTabs()
      cycleTheTabs()

      if (options && options.testWindowButtons === true) {
        const toggleSidecarWithESC = (expectOpen = false) =>
          it(`should hit ESCAPE key and expect sidecar ${expectOpen ? 'open' : 'closed'}`, async () => {
            try {
              await this.app.client.keys(Keys.ESCAPE)
              expectOpen ? await SidecarExpect.open(this.app) : await SidecarExpect.closed(this.app)
            } catch (err) {
              await Common.oops(this, true)(err)
            }
          })

        const quit = () =>
          it('should fully close the sidecar', async () => {
            try {
              await this.app.client.waitForVisible(Selectors.SIDECAR_FULLY_CLOSE_BUTTON)
              await this.app.client.click(Selectors.SIDECAR_FULLY_CLOSE_BUTTON)
              await SidecarExpect.fullyClosed(this.app)
            } catch (err) {
              await Common.oops(this, true)(err)
            }
          })

        const maximize = () =>
          it('should maximize the sidecar', async () => {
            try {
              await this.app.client.waitForVisible(Selectors.SIDECAR_MAXIMIZE_BUTTON)
              await this.app.client.click(Selectors.SIDECAR_MAXIMIZE_BUTTON)
              await SidecarExpect.fullscreen(this.app)
            } catch (err) {
              await Common.oops(this, true)(err)
            }
          })

        const minimize = () => {
          it('should toggle the sidebar closed with close button click', async () => {
            try {
              await this.app.client.waitForVisible(Selectors.SIDECAR_CLOSE_BUTTON)
              await this.app.client.click(Selectors.SIDECAR_CLOSE_BUTTON)
              await SidecarExpect.closed(this.app)
            } catch (err) {
              await Common.oops(this, true)
            }
          })
        }

        const backToOpen = (backFromMinimized: boolean) => {
          const button = backFromMinimized
            ? Selectors.SIDECAR_RESUME_FROM_CLOSE_BUTTON
            : Selectors.SIDECAR_MAXIMIZE_BUTTON

          it(`should resume the sidecar from ${backFromMinimized ? 'minimized' : 'maximized'} to open`, async () => {
            try {
              await this.app.client.waitForVisible(button)
              await this.app.client.click(button)
              await SidecarExpect.open(this.app)
            } catch (err) {
              await Common.oops(this, true)
            }
          })
        }

        showModes()
        toggleSidecarWithESC()
        toggleSidecarWithESC(true)

        toggleSidecarWithESC()
        showModes()

        minimize()
        backToOpen(true)

        minimize()
        showModes()

        maximize()
        backToOpen(false)
        showModes()

        quit()
        showModes()
      }
    })
  }

  /**
   * toolbarButtons() starts a Mocha Test Suite
   * toolbarButtons() executes `command` and expects the `buttons` shown in Sidecar having correct labels and drildown handlers
   *
   * @param buttons is the expected array of `button` shown in the Sidecar Toolbar
   *
   */
  public toolbarButtons(
    buttons: {
      mode: string
      label?: string
      command: string | Function
      kind: 'drilldown' | 'view'
      confirm?: boolean
      expectError?: 404
    }[]
  ) {
    const { command, testName } = this.param

    describe(`mmr toolbar buttons ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show toolbar buttons in sidecar `, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(app => Promise.all(buttons.map(button => SidecarExpect.button(button)(app))))
          .catch(Common.oops(this, true)))

      const drilldownButtons = buttons.filter(_ => _.kind === 'drilldown')
      if (drilldownButtons.length > 0) {
        it(`should drilldown toolbar buttons in sidecar`, async () => {
          try {
            const { app, count } = await CLI.command(command, this.app)
            await ReplExpect.ok({ app, count })
            await SidecarExpect.open(app)

            await promiseEach(drilldownButtons, async (button, index) => {
              // the button should be clickable
              const buttonSelector = Selectors.SIDECAR_TOOLBAR_BUTTON(button.mode)
              await app.client.waitForVisible(buttonSelector)
              await app.client.click(buttonSelector)

              if (button.confirm) {
                const dialog = '#confirm-dialog'
                const denyIt = `${dialog} .bx--btn--secondary`
                const confirmIt = `${dialog} .bx--btn--danger`
                await Promise.all([app.client.waitForVisible(denyIt), app.client.waitForVisible(confirmIt)])

                // first click deny, and expect the confirm dialog to be gone
                await app.client.click(denyIt)
                await app.client.waitForExist(denyIt, 5000, true)

                // after clicking deny, the next prompt should *not* exist
                const nextPromptSelector = Selectors.PROMPT_N(count + 1 + index + 1)
                await app.client.waitForExist(nextPromptSelector, 5000, true)

                // now click the button again, then click confirm
                await app.client.click(buttonSelector)
                await Promise.all([app.client.waitForVisible(denyIt), await app.client.waitForVisible(confirmIt)])
                await app.client.click(confirmIt)
              }

              // after clicking the button, a command should show up in the next prompt
              const promptSelector = Selectors.PROMPT_N(count + 1 + index)

              if (!button.expectError) {
                await ReplExpect.ok({ app, count: count + 1 + index })
              } else {
                await ReplExpect.error(button.expectError)
              }

              if (typeof button.command === 'string') {
                await CLI.expectInput(promptSelector, button.command)(app)
              }
            })
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      }
    })
  }

  /**
   * toolbarText() starts a Mocha Test Suite
   * toolbarText() executes `command` and expects Sidecar Toolbar has correct `text` and `type`
   *
   * @param  toolbarText is the expected text content and type shown in the Sidecar Toolbar
   */
  public toolbarText(toolbarText: { type: string; text: string }) {
    const { command, testName } = this.param

    describe(`mmr toolbar text ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show toolbar text in sidecar `, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.toolbarText(toolbarText))
          .catch(Common.oops(this, true)))
    })
  }
}

interface Label {
  mode: string
  label?: string
}

interface PlainTextContent {
  content?: string
  contentType: 'text/plain' | 'text/markdown' | 'text/html' | 'yaml'
  editor?: false
}

interface YamlContentWithEditor {
  content: object
  contentType: 'yaml'
  editor: true
}

interface ClickExpect {
  command: string
  expect?: string
}
