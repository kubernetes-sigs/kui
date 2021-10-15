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

import { dirname } from 'path'

import { Common, CLI, ReplExpect, Selectors, Util, Keys } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/plugin-core-support/package.json'))

/* xit has been added to most tests because of recent changes to notebooks opening in read only mode.
  These changes make commentaries incapable of being edited for now until more changes are made */
describe('commentary and replay', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const file = Util.uniqueFileForSnapshot()

  const verifyComment = (inNotebook = true) => {
    return this.app.client.waitUntil(
      async () => {
        const lastOutput = inNotebook ? Selectors.OUTPUT_LAST_IN_NOTEBOOK() : Selectors.OUTPUT_LAST

        await this.app.client.$(`${lastOutput} ${Selectors.TERMINAL_CARD}`).then(_ => _.waitForDisplayed())

        const title = await this.app.client.$(`${lastOutput} ${Selectors.TERMINAL_CARD_TITLE}`).then(_ => _.getText())
        const head1 = await this.app.client.$(`${lastOutput} ${Selectors.TERMINAL_CARD} h1`).then(_ => _.getText())
        const head2 = await this.app.client.$(`${lastOutput} ${Selectors.TERMINAL_CARD} h2`).then(_ => _.getText())

        return (
          title === 'hello there' && head1 === 'The Kui Framework for Graphical Terminals' && head2 === 'Installation'
        )
      },
      { timeout: CLI.waitTimeout }
    )
  }

  const addComment = () => {
    it('should show comment with file', () =>
      CLI.command(`commentary --title "hello there" -f=${ROOT}/tests/data/comment.md`, this.app)
        .then(() => verifyComment(false))
        .catch(Common.oops(this, true)))
  }

  addComment()
  it('should show version', () =>
    CLI.command('version', this.app)
      .then(ReplExpect.okWithCustom({ expect: Common.expectedVersion }))
      .catch(Common.oops(this, true)))
  addComment()

  it('should snapshot', () =>
    CLI.command(`snapshot ${file}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should refresh', () => Common.refresh(this))

  it('should replay', () =>
    CLI.command(`replay ${file}`, this.app)
      .then(() => verifyComment())
      .catch(Common.oops(this, true)))
})

describe('edit commentary and replay', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const file = Util.uniqueFileForSnapshot()

  const lastOutput = (inNotebook: boolean) => (inNotebook ? Selectors.OUTPUT_LAST_IN_NOTEBOOK() : Selectors.OUTPUT_LAST)
  const verifyComment = (expectedText: string, inNotebook: boolean) => {
    const output = lastOutput(inNotebook)

    let idx = 0
    return this.app.client.waitUntil(
      async () => {
        await this.app.client.$(`${output} ${Selectors.TERMINAL_CARD}`).then(_ => _.waitForDisplayed())
        const actualText = await this.app.client.$(`${output} ${Selectors.TERMINAL_CARD}`).then(_ => _.getText())

        if (++idx > 5) {
          console.error(`still waiting for actual=${actualText} expected=${expectedText}`)
        }

        return actualText === expectedText
      },
      { timeout: CLI.waitTimeout }
    )
  }

  const verifyTextInMonaco = (expectedText: string, inNotebook: boolean) => {
    let idx = 0
    return this.app.client.waitUntil(
      async () => {
        const actualText = await Util.getValueFromMonaco({ app: this.app, count: -1 }, lastOutput(inNotebook))

        if (++idx > 5) {
          console.error(`still waiting for actual=${actualText} expected=${expectedText}`)
        }

        return actualText === expectedText
      },
      { timeout: CLI.waitTimeout }
    )
  }

  /** set the monaco editor text */
  const type = async (text: string, inNotebook: boolean): Promise<void> => {
    const selector = `${lastOutput(inNotebook)} .monaco-editor-wrapper .view-lines`
    await this.app.client.$(selector).then(async _ => {
      await _.click()
      await _.waitForEnabled()
    })

    await this.app.client.keys(text)
  }
  const typeAndVerify = (text: string, expect: string, inNotebook: boolean) => {
    it(`should type ${text} and expect ${expect} in the comment`, async () => {
      try {
        await type(text, inNotebook)
        await verifyTextInMonaco(expect, inNotebook)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const openEditor = (expect: string, inNotebook: boolean) => {
    it('should open editor by clicking', async () => {
      try {
        await this.app.client.$(`${lastOutput(inNotebook)} ${Selectors.TERMINAL_CARD}`).then(_ => _.doubleClick())
        await verifyTextInMonaco(expect, inNotebook)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const saveViaKeys = (keys: string[], expect: string, inNotebook: boolean) => {
    it(`should close the editor by typing ${keys}`, async () => {
      try {
        await this.app.client.keys(keys)
        await this.app.client
          .$(`${lastOutput(inNotebook)} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed({ timeout: 500, reverse: true }))
        await verifyComment(expect, inNotebook)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const clickDone = (expect: string, inNotebook: boolean) => {
    it('should close the editor by clicking the Done button', async () => {
      try {
        await this.app.client
          .$(`${lastOutput(inNotebook)} ${Selectors.COMMENTARY_EDITOR_BUTTON_DONE}`)
          .then(_ => _.click())
        await this.app.client
          .$(`${lastOutput(inNotebook)} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed({ timeout: 500, reverse: true }))
        await verifyComment(expect, inNotebook)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const clickRevert = (expect: string, inNotebook: boolean) => {
    it('should revert the editor by clicking the Revert button', async () => {
      try {
        await this.app.client
          .$(`${lastOutput(inNotebook)} ${Selectors.COMMENTARY_EDITOR_BUTTON_REVERT}`)
          .then(_ => _.click())
        await this.app.client
          .$(`${lastOutput(inNotebook)} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed()) // still open!
        await verifyTextInMonaco(expect, inNotebook)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const clickCancel = (expect: string, inNotebook: boolean) => {
    it('should close the editor by clicking the Cancel button', async () => {
      try {
        await this.app.client
          .$(`${lastOutput(inNotebook)} ${Selectors.COMMENTARY_EDITOR_BUTTON_CANCEL}`)
          .then(_ => _.click())
        await this.app.client
          .$(`${lastOutput(inNotebook)} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed({ timeout: 500, reverse: true }))
        await verifyComment(expect, inNotebook)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const escapeCancel = (expect: string, inNotebook: boolean) => {
    it('should close the editor by typing Escape', async () => {
      try {
        await this.app.client.keys('Escape')
        await this.app.client
          .$(`${lastOutput(inNotebook)} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed({ timeout: 500, reverse: true }))
        await verifyComment(expect, inNotebook)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  /** Here comes the test */
  it('should add comment', () =>
    CLI.command(`# foo-shift-enter`, this.app)
      .then(() => verifyComment('foo-shift-enter', false))
      .catch(Common.oops(this, true)))

  // test shift-enter to save
  openEditor('foo-shift-enter', false)
  typeAndVerify('1', 'foo-shift-enter1', false)
  saveViaKeys(['Shift', 'Enter'], 'foo-shift-enter1', false)

  // test cmdctrl+s to save
  openEditor('foo-shift-enter1', false)
  typeAndVerify('2', 'foo-shift-enter12', false)
  saveViaKeys([Keys.ctrlOrMeta, 's'], 'foo-shift-enter12', false)

  // test Escape to cancel
  openEditor('foo-shift-enter12', false)
  typeAndVerify('3', 'foo-shift-enter123', false)
  escapeCancel('foo-shift-enter12', false)

  /** Here comes the test */
  it('should add another comment', () =>
    CLI.command(`# foo`, this.app)
      .then(() => verifyComment('foo', false))
      .catch(Common.oops(this, true)))

  openEditor('foo', false)
  typeAndVerify('1', 'foo1', false)
  clickDone('foo1', false)

  openEditor('foo1', false)
  typeAndVerify('2', 'foo12', false)
  clickCancel('foo1', false)

  openEditor('foo1', false)
  typeAndVerify('3', 'foo13', false)
  clickRevert('foo1', false)
  clickCancel('foo1', false)

  it('should snapshot', () =>
    CLI.command(`snapshot ${file}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should refresh', () => Common.refresh(this))

  it('should replay', () =>
    CLI.command(`replay ${file}`, this.app)
      .then(() => verifyComment('foo1', true))
      .catch(Common.oops(this, true)))

  it('should sleep', () => new Promise(resolve => setTimeout(resolve, 4000)))

  // in order to make more changes to the notebook, we need to execute
  // a command to toggle its editability; so we switch back to the
  // first to do so
  it('should switch to the first tab', () => Util.switchToTopLevelTabViaClick(this, 1))
  it('should make the second tab editable', () =>
    CLI.command('tab edit toggle 2', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true)))
  it('should switch back to the second tab', () => Util.switchToTopLevelTabViaClick(this, 2))

  // it('should sleep', () => new Promise(resolve => setTimeout(resolve, 4000)))
  it('should wait for the edit toggle to take effect', () => CLI.waitForRepl(this.app).catch(Common.oops(this, true)))

  // Here comes the tests for snapshot --exec
  openEditor('foo1', false)
  typeAndVerify(Keys.ENTER, 'foo1\n', false)
  typeAndVerify(Keys.ENTER, 'foo1\n\n', false)
  typeAndVerify('foo2', 'foo1\n\nfoo2', false)
  clickDone('foo1\nfoo2', false)

  it('should snapshot with --exec', () =>
    CLI.command(`snapshot ${file} --exec`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should refresh', () => Common.refresh(this))

  it('should replay', () =>
    CLI.command(`replay ${file}`, this.app)
      .then(() => verifyComment('foo1\nfoo2', true))
      .catch(Common.oops(this, true)))
})
