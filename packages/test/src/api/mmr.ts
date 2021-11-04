/*
 * Copyright 2019 The Kubernetes Authors
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

import { ok } from 'assert'
import { Application } from 'spectron'
import { BadgeSpec, Util } from '@kui-shell/core'

import * as Common from './common'
import * as CLI from './cli'
import * as ReplExpect from './repl-expect'
import * as SidecarExpect from './sidecar-expect'
import * as Selectors from './selectors'

interface TestParam {
  command: string
  testName?: string
  metadata: {
    name: string
    namespace?: string
  }
}

export type MMRExpectMode = Label & (PlainTextContent | YamlContentWithEditor | TableContent | ReactContent)

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
    await CLI.expectPriorInput(Selectors.PROMPT_N(cmdIdx), command)(app)
    if (typeof expect === 'string') {
      await ReplExpect.okWithString(expect, true)({ app: app, count: cmdIdx })
    }
  }

  /**
   * name() starts a Mocha Test Suite
   * name() executes `command` in REPL and expects `prettyName` or `name` is shown in Sidecar
   */
  public name(opt?: {
    nameHash?: string
    prettyName?: string
    onclick?: {
      name?: ClickExpect
      nameHash?: ClickExpect
    }
    heroName?: boolean
  }) {
    const { command, testName, metadata } = this.param
    const testClickResult = this.testClickResult

    describe(`mmr name ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const { nameHash, prettyName, onclick, heroName } = opt

      let cmdIdx = 0 // keep track of the command execution number

      const showName = prettyName || metadata.name
      it(`should show name ${showName} ${nameHash ? ' and namehash ' + nameHash : ''} in sidecar header`, () =>
        CLI.command(command, this.app)
          .then(res => {
            cmdIdx = res.count
            return res
          })
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(async res => {
            if (heroName) {
              await SidecarExpect.heroName(res.count, showName)
            } else {
              await SidecarExpect.name(res.count, showName)
            }

            if (nameHash) {
              await SidecarExpect.namehash(res.count, nameHash)
            }
          })
          .catch(Common.oops(this, true)))

      if (onclick && onclick.name) {
        it('should click the name part of sidecar and expect the command shows in repl', async () => {
          try {
            await this.app.client.$(Selectors.SIDECAR_TITLE(cmdIdx)).then(_ => _.click())
            await testClickResult(++cmdIdx, onclick.name.command, onclick.name.expect)(this.app)
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      }

      if (onclick && onclick.nameHash) {
        it('should click the namehash part of sidecar and expect the command shows in repl', async () => {
          try {
            await this.app.client.$(Selectors.SIDECAR_ACTIVATION_TITLE(cmdIdx)).then(_ => _.click())
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
      let cmdIdx = 0 // keep track of the command execution number

      it(`should show namespace ${metadata.namespace} in sidecar`, () =>
        CLI.command(command, this.app)
          .then(res => {
            cmdIdx = res.count
            return res
          })
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.namespace(metadata.namespace))
          .catch(Common.oops(this, true)))

      if (onclick) {
        it(`should click the namespace part of sidecar and expect the command shows in repl`, async () => {
          try {
            await this.app.client.$(Selectors.SIDECAR_PACKAGE_NAME_TITLE(cmdIdx)).then(_ => _.click())
            await testClickResult(++cmdIdx, onclick.command, onclick.expect)(this.app)
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
          .then(SidecarExpect.kind(kind))
          .catch(Common.oops(this, true)))
    })
  }

  /**
   * badges() starts a Mocha Test Suite
   * badges() executes `command` in REPL and expects `badges` are showin in Sidecar
   * @param { BadgeSpec[] } badges is the expected badges shown in the Sidecar
   *
   */
  public badges(badges: BadgeSpec[]) {
    const { command, testName } = this.param

    describe(`mmr badges ${testName || ''} ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show badges in sidecar`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(res => Promise.all(badges.map(badge => SidecarExpect.badge(badge.title, badge.css)(res)))))
    })
  }

  /**
   * modes() starts a Mocha Test Suite
   * modes() executes `command` in REPL and expects `modes` are showin in Sidecar
   * @param { MMRExpectMode[] } expectModes is the expected modes shown as Sidecar Tabs
   * @param { MMRExpectMode } defaultMode is the expected default Sidecar Tab
   *
   *
   */
  public modes(expectModes: MMRExpectMode[], defaultMode: MMRExpectMode) {
    const { command, testName } = this.param

    describe(`mmr modes ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      let cmdIdx: number
      const showModes = () => {
        it(`should show sidecar tabs with command=${command}`, () =>
          CLI.command(command, this.app)
            .then(ReplExpect.ok)
            .then(SidecarExpect.open)
            .then(SidecarExpect.defaultMode(defaultMode))
            .then(SidecarExpect.modes(expectModes))
            .then(res => {
              cmdIdx = res.count
              return res
            })
            .catch(Common.oops(this, true)))
      }

      const clickToActivateTab = async (mode: string) => {
        const sel = Selectors.SIDECAR_MODE_BUTTON(cmdIdx, mode)
        await this.app.client.$(sel).then(_ => _.waitForExist())

        await this.app.client.execute(sel => {
          ;(document.querySelector(sel) as HTMLElement).focus()
        }, sel)

        const elt = await this.app.client.$(sel)
        ok(await elt.isDisplayedInViewport())
        await elt.click()
        await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON_SELECTED(cmdIdx, mode)).then(_ => _.waitForExist())
      }

      const cycleTheTabs = () =>
        expectModes.forEach(expectMode => {
          it(`should switch to the ${expectMode.mode} tab`, async () => {
            try {
              await clickToActivateTab(expectMode.mode)
            } catch (err) {
              return Common.oops(this, true)(err)
            }
          })

          if (expectMode.contentType === 'text/plain') {
            it(`should show plain text content via monaco in the ${expectMode.mode} tab`, async () => {
              try {
                if (
                  await this.app.client
                    .$(Selectors.SIDECAR_MODE_BUTTON(cmdIdx, expectMode.mode))
                    .then(_ => _.isDisplayed())
                ) {
                  await SidecarExpect.textPlainContentFromMonaco(expectMode.content)({ app: this.app, count: cmdIdx })
                }
              } catch (err) {
                return Common.oops(this, true)(err)
              }
            })
          } else if (expectMode.contentType === 'react') {
            it(`should show react content`, async () => {
              if (
                await this.app.client
                  .$(Selectors.SIDECAR_MODE_BUTTON(cmdIdx, expectMode.mode))
                  .then(_ => _.isDisplayed())
              ) {
                const selector = `${Selectors.SIDECAR_TAB_CONTENT(cmdIdx)} ${expectMode.selector}`
                await this.app.client.waitUntil(async () => {
                  const elt = await this.app.client.$(selector)
                  await elt.waitForDisplayed()
                  return expectMode.innerText === (await elt.getText())
                })
              }
            })
          } else if (expectMode.contentType === 'table') {
            it(`should show ${expectMode.nRows} table rows in the ${expectMode.mode} tab`, async () => {
              try {
                if (
                  await this.app.client
                    .$(Selectors.SIDECAR_MODE_BUTTON(cmdIdx, expectMode.mode))
                    .then(_ => _.isDisplayed())
                ) {
                  let idx = 0
                  await this.app.client.waitUntil(
                    async () => {
                      const rows = await this.app.client.$$(`${Selectors.SIDECAR_TAB_CONTENT(cmdIdx)} tbody tr`)
                      const actualRows = rows.length
                      const expectedRows = expectMode.nRows
                      if (++idx > 5) {
                        console.error(
                          `still waiting for table rows actualRows=${actualRows} expectedRows=${expectedRows}`,
                          `${Selectors.SIDECAR_TAB_CONTENT(cmdIdx)} tbody tr`
                        )
                      }
                      return actualRows === expectedRows
                    },
                    { timeout: CLI.waitTimeout }
                  )
                }
              } catch (err) {
                return Common.oops(this, true)(err)
              }
            })
            it(`should show ${expectMode.nCells} table cells in the ${expectMode.mode} tab`, async () => {
              try {
                if (
                  await this.app.client
                    .$(Selectors.SIDECAR_MODE_BUTTON(cmdIdx, expectMode.mode))
                    .then(_ => _.isDisplayed())
                ) {
                  await this.app.client.waitUntil(
                    async () => {
                      const cells = await this.app.client.$$(`${Selectors.SIDECAR_TAB_CONTENT(cmdIdx)} td`)
                      return cells.length === expectMode.nCells
                    },
                    { timeout: CLI.waitTimeout }
                  )
                }
              } catch (err) {
                return Common.oops(this, true)(err)
              }
            })
          } else if (expectMode.contentType === 'yaml') {
            if (expectMode.editor === true) {
              it(`should open editor and show yaml content via monaco in the ${expectMode.mode} tab`, async () => {
                try {
                  if (
                    await this.app.client
                      .$(Selectors.SIDECAR_MODE_BUTTON(cmdIdx, expectMode.mode))
                      .then(_ => _.isDisplayed())
                  ) {
                    await SidecarExpect.yaml(expectMode.content)({ app: this.app, count: cmdIdx })
                  }
                } catch (err) {
                  return Common.oops(this, true)(err)
                }
              })
            } else {
              it(`should show random content in the ${expectMode.mode} tab`, async () => {
                try {
                  if (
                    await this.app.client
                      .$(Selectors.SIDECAR_MODE_BUTTON(cmdIdx, expectMode.mode))
                      .then(_ => _.isDisplayed())
                  ) {
                    await SidecarExpect.textPlainContent(expectMode.content)({ app: this.app, count: cmdIdx })
                  }
                } catch (err) {
                  return Common.oops(this, true)(err)
                }
              })
            }
          }
        })

      showModes()
      cycleTheTabs()
      cycleTheTabs()
    })
  }

  public diffPlainText(mode: string, textB: string) {
    const { command, testName } = this.param

    describe(`diff ${testName} ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it('should should open sidecar with diff view', () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.mode(mode))
          .then(SidecarExpect.textPlainContentFromMonaco(textB))
          .catch(Common.oops(this, true)))
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
      expectError?: 127
    }[]
  ) {
    const { command, testName } = this.param

    describe(`mmr toolbar buttons ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      let res: ReplExpect.AppAndCount
      it(`should show toolbar buttons in sidecar `, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(appAndCount => {
            res = appAndCount
            return appAndCount
          })
          .then(res => Promise.all(buttons.map(button => SidecarExpect.button(button)(res))))
          .catch(Common.oops(this, true)))

      const drilldownButtons = buttons.filter(_ => _.kind === 'drilldown')
      if (drilldownButtons.length > 0) {
        it(`should drilldown toolbar buttons in sidecar`, async () => {
          try {
            const { app, count } = await CLI.command(command, this.app)
            await ReplExpect.ok({ app, count })
            await SidecarExpect.open({ app, count })

            await Util.promiseEach(drilldownButtons, async (button, index) => {
              // the button should be clickable
              const buttonSelector = Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, button.mode)
              const buttonElt = await app.client.$(buttonSelector)
              await CLI.waitForRepl(this.app)
              await buttonElt.waitForDisplayed()
              await buttonElt.click()

              if (button.confirm) {
                // const dialog = Selectors.CONFIRM_DIALOG
                const denyItSel = Selectors.CONFIRM_DIALOG_CANCEL_BUTTON
                const confirmItSel = Selectors.CONFIRM_DIALOG_CONFIRM_BUTTON
                const [denyIt, confirmIt] = await Promise.all([app.client.$(denyItSel), app.client.$(confirmItSel)])

                await Promise.all([denyIt, confirmIt].map(_ => _.waitForDisplayed()))

                // first click deny, and expect the confirm dialog to be gone
                await denyIt.click()
                await denyIt.waitForExist({ timeout: 5000, reverse: true })

                // after clicking deny, the next prompt should *not* exist
                const nextPromptSelector = Selectors.PROMPT_N(count + 1 + index + 1)
                await app.client.$(nextPromptSelector).then(_ => _.waitForExist({ timeout: 5000, reverse: true }))

                // now click the button again, then click confirm
                await buttonElt.click()
                const [denyIt2, confirmIt2] = await Promise.all([app.client.$(denyItSel), app.client.$(confirmItSel)])
                await Promise.all([denyIt2, confirmIt2].map(_ => _.waitForDisplayed()))
                await confirmIt2.click()
              }

              // after clicking the button, a command should show up in the next prompt
              const promptSelector = Selectors.PROMPT_N(count + 1 + index)

              if (!button.expectError) {
                await ReplExpect.ok({ app, count: count + 1 + index })
              } else {
                await ReplExpect.error(button.expectError)
              }

              if (typeof button.command === 'string') {
                await CLI.expectPriorInput(promptSelector, button.command)(app)
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
  public toolbarText(toolbarText: { type: string; text: string; exact?: boolean }) {
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

  public toolbarNotExist() {
    const { command, testName } = this.param
    describe(`mmr toolbar ${testName || command || ''} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should not show toolbar in sidecar `, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(res =>
            this.app.client
              .$(Selectors.SIDECAR_TOOLBAR(res.count))
              .then(_ => _.waitForExist({ timeout: CLI.waitTimeout, reverse: true }))
          )
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

interface ReactContent {
  selector: string
  innerText: string
  contentType: 'react'
}

interface TableContent {
  nRows: number
  nCells: number
  contentType: 'table'
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
