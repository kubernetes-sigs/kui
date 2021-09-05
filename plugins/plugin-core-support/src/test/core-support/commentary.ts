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

describe('commentary and replay', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const file = Util.uniqueFileForSnapshot()

  const verifyComment = () => {
    return this.app.client.waitUntil(
      async () => {
        await this.app.client.$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`).then(_ => _.waitForDisplayed())

        const title = await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD_TITLE}`)
          .then(_ => _.getText())
        const head1 = await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD} h1`)
          .then(_ => _.getText())
        const head2 = await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD} h2`)
          .then(_ => _.getText())

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
        .then(() => verifyComment())
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

  const file = Util.uniqueFileForSnapshot()

  const verifyComment = (expectedText: string) => {
    let idx = 0
    return this.app.client.waitUntil(
      async () => {
        await this.app.client.$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`).then(_ => _.waitForDisplayed())
        const actualText = await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`)
          .then(_ => _.getText())

        if (++idx > 5) {
          console.error(`still waiting for actual=${actualText} expected=${expectedText}`)
        }

        return actualText === expectedText
      },
      { timeout: CLI.waitTimeout }
    )
  }

  const verifyTextInMonaco = (expectedText: string) => {
    let idx = 0
    return this.app.client.waitUntil(
      async () => {
        const actualText = await Util.getValueFromMonaco({ app: this.app, count: -1 }, Selectors.OUTPUT_LAST)

        if (++idx > 5) {
          console.error(`still waiting for actual=${actualText} expected=${expectedText}`)
        }

        return actualText === expectedText
      },
      { timeout: CLI.waitTimeout }
    )
  }

  /** set the monaco editor text */
  const type = async (text: string): Promise<void> => {
    const selector = `${Selectors.OUTPUT_LAST} .monaco-editor-wrapper .view-lines`
    await this.app.client.$(selector).then(async _ => {
      await _.click()
      await _.waitForEnabled()
    })

    await this.app.client.keys(text)
  }
  const typeAndVerify = (text: string, expect: string) => {
    it(`should type ${text} and expect ${expect} in the comment`, async () => {
      try {
        await type(text)
        await verifyTextInMonaco(expect)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const openEditor = (expect: string) => {
    it('should open editor by clicking', async () => {
      try {
        await this.app.client.$(`${Selectors.OUTPUT_LAST} ${Selectors.TERMINAL_CARD}`).then(_ => _.doubleClick())
        await verifyTextInMonaco(expect)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const saveViaKeys = (keys: string[], expect: string) => {
    it(`should close the editor by typing ${keys}`, async () => {
      try {
        await this.app.client.keys(keys)
        await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed({ timeout: 500, reverse: true }))
        await verifyComment(expect)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const clickDone = (expect: string) => {
    it('should close the editor by clicking the Done button', async () => {
      try {
        await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.COMMENTARY_EDITOR_BUTTON_DONE}`)
          .then(_ => _.click())
        await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed({ timeout: 500, reverse: true }))
        await verifyComment(expect)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const clickRevert = (expect: string) => {
    it('should revert the editor by clicking the Revert button', async () => {
      try {
        await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.COMMENTARY_EDITOR_BUTTON_REVERT}`)
          .then(_ => _.click())
        await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed()) // still open!
        await verifyTextInMonaco(expect)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const clickCancel = (expect: string) => {
    it('should close the editor by clicking the Cancel button', async () => {
      try {
        await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.COMMENTARY_EDITOR_BUTTON_CANCEL}`)
          .then(_ => _.click())
        await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed({ timeout: 500, reverse: true }))
        await verifyComment(expect)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }
  const escapeCancel = (expect: string) => {
    it('should close the editor by typing Escape', async () => {
      try {
        await this.app.client.keys('Escape')
        await this.app.client
          .$(`${Selectors.OUTPUT_LAST} ${Selectors.COMMENTARY_EDITOR}`)
          .then(_ => _.waitForDisplayed({ timeout: 500, reverse: true }))
        await verifyComment(expect)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  /** Here comes the test */
  it('should add comment', () =>
    CLI.command(`# foo-shift-enter`, this.app)
      .then(() => verifyComment('foo-shift-enter'))
      .catch(Common.oops(this, true)))

  // test shift-enter to save
  openEditor('foo-shift-enter')
  typeAndVerify('1', 'foo-shift-enter1')
  saveViaKeys(['Shift', 'Enter'], 'foo-shift-enter1')

  // test cmdctrl+s to save
  openEditor('foo-shift-enter1')
  typeAndVerify('2', 'foo-shift-enter12')
  saveViaKeys([Keys.ctrlOrMeta, 's'], 'foo-shift-enter12')

  // test Escape to cancel
  openEditor('foo-shift-enter12')
  typeAndVerify('3', 'foo-shift-enter123')
  escapeCancel('foo-shift-enter12')

  /** Here comes the test */
  it('should add another comment', () =>
    CLI.command(`# foo`, this.app)
      .then(() => verifyComment('foo'))
      .catch(Common.oops(this, true)))

  openEditor('foo')
  typeAndVerify('1', 'foo1')
  clickDone('foo1')

  openEditor('foo1')
  typeAndVerify('2', 'foo12')
  clickCancel('foo1')

  openEditor('foo1')
  typeAndVerify('3', 'foo13')
  clickRevert('foo1')
  clickCancel('foo1')

  it('should snapshot', () =>
    CLI.command(`snapshot ${file}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should refresh', () => Common.refresh(this))

  it('should replay', () =>
    CLI.command(`replay ${file}`, this.app)
      .then(() => verifyComment('foo1'))
      .catch(Common.oops(this, true)))

  // Here comes the tests for snapshot --exec
  it('should sleep', () => new Promise(resolve => setTimeout(resolve, 4000)))
  openEditor('foo1')
  typeAndVerify(Keys.ENTER, 'foo1\n')
  typeAndVerify(Keys.ENTER, 'foo1\n\n')
  typeAndVerify('foo2', 'foo1\n\nfoo2')
  clickDone('foo1\nfoo2')

  it('should snapshot with --exec', () =>
    CLI.command(`snapshot ${file} --exec`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should refresh', () => Common.refresh(this))

  it('should replay', () =>
    CLI.command(`replay ${file}`, this.app)
      .then(() => verifyComment('foo1\nfoo2'))
      .catch(Common.oops(this, true)))
})
