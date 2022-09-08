/*
 * Copyright 2018 The Kubernetes Authors
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

import { dirname, join } from 'path'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import { setValue } from './common'

const ROOT = dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/editor/package.json'))

/** click the save buttom */
const save = async (res: ReplExpect.AppAndCount) => {
  const button = await res.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res.count, 'Save'))
  await button.waitForExist()
  await button.click()

  // save button had better be gone after clicking Save
  await button.waitForExist({ timeout: 10000, reverse: true })
}

/** for some reason, monaco inserts a trailing view-line even for one-line files :( */
const verifyTextExist =
  (selector: string, expectedText: string) =>
  async (res: ReplExpect.AppAndCount): Promise<ReplExpect.AppAndCount> => {
    await res.app.client.waitUntil(
      async () => {
        const actualText = await res.app.client.$(selector).then(_ => _.getText())
        return actualText.replace(/\s+$/, '') === expectedText
      },
      { timeout: 20000 }
    )

    return res
  }

Common.pDescribe(`editor basics ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const TMP = '/tmp' // FIXME

  const nonExistFileName = 'editNonExistTest.txt'
  const nonExistFileName2 = 'editNonExistTest2.txt'
  const nonExistFilePath = join(TMP, nonExistFileName)
  const nonExistFilePath2 = join(TMP, nonExistFileName2)
  it('should create a new file when editing a non-existing file', () =>
    CLI.command(`edit ${nonExistFilePath}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showingNotClickable(nonExistFileName))
      .catch(Common.oops(this, true)))

  it(`should open ${nonExistFilePath}`, () => CLI.command(`open ${nonExistFilePath}`, this.app).then(ReplExpect.ok).then(SidecarExpect.open).then(SidecarExpect.showingNotClickable(nonExistFileName)).catch(Common.oops(this, true)))

  it(`should rm ${nonExistFilePath}`, () =>
    CLI.command(`rm -f ${nonExistFilePath}`, this.app) // note the -f here; it's ok if the file doesn't exist
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it(`should rm -f ${nonExistFilePath2}`, () =>
    CLI.command(`rm -f ${nonExistFilePath2}`, this.app) // note the -f here; it's ok if the file doesn't exist
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  // editor save not yet supported in proxy mode
  Common.localIt('should edit and save the content of a non-existing file', async () => {
    try {
      const res = await CLI.command(`edit --create ${nonExistFilePath2}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showingNotClickable(nonExistFileName2))

      await setValue(res, 'testing edit non-existing file')
      await save(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  Common.localIt(`should open ${nonExistFilePath2} and see changed content`, async () => {
    try {
      const res = await CLI.command(`open ${nonExistFilePath2}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showingNotClickable(nonExistFileName2))

      await verifyTextExist(
        `${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`,
        'testing edit non-existing file'
      )(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  Common.localIt(`should rm ${nonExistFilePath2}`, () =>
    CLI.command(`rm ${nonExistFilePath2}`, this.app) // note: no -f here, because we expect the file to be there
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true))
  )

  const initialFile = 'edit-file.txt'
  const initialFilepath = join(ROOT, initialFile)
  const tmpFilepath = join(TMP, initialFile)

  const initialContent = 'hello world'
  const updatedText = `testing edit ${new Date().getTime()}`

  it('should copy the edit input', () =>
    CLI.command(`cp ${initialFilepath} ${tmpFilepath}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should edit but not save the content of an existing file', async () => {
    try {
      const res = await CLI.command(`edit ${tmpFilepath}`, this.app).then(ReplExpect.ok).then(SidecarExpect.open)

      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, initialContent)(res)

      await setValue(res, 'should not be saved')
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should re-open the file and see the unchanged content', async () => {
    try {
      const res = await CLI.command(`open ${tmpFilepath}`, this.app).then(ReplExpect.ok).then(SidecarExpect.open)

      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, initialContent)(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  // editor save not yet supported in proxy mode
  Common.localIt('should edit and save the content', async () => {
    try {
      const res = await CLI.command('edit /tmp/edit-file.txt', this.app).then(ReplExpect.ok).then(SidecarExpect.open)

      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, initialContent)(res)
      await setValue(res, updatedText)
      await save(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  Common.localIt('should re-open the initial file and see the unchanged content', async () => {
    try {
      const res = await CLI.command(`open ${initialFilepath}`, this.app).then(ReplExpect.ok).then(SidecarExpect.open)

      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, initialContent)(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  Common.localIt('should re-open the edited file and see the updated content', async () => {
    try {
      const res = await CLI.command(`open ${tmpFilepath}`, this.app).then(ReplExpect.ok).then(SidecarExpect.open)

      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, updatedText)(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  /** reload the app, and wait for a repl prompt */
  const reload = () => Common.localIt('should reload the app', () => Common.refresh(this))
  // note on Common.localIt   ^^^^^^^ <-- because the following are all Common.localIt tests

  // make sure pasting text in the editor doesn't result in the editor losing focus
  const textToPaste = 'hello world'
  const textToTypeAfterPaste = ' and sun and moon'
  const finalTextAfterPasteTest = `${textToPaste}${textToTypeAfterPaste}`
  reload()
  Common.localIt('should edit, then paste, and still have focus', async () => {
    try {
      const res = await CLI.command(`edit ${tmpFilepath}`, this.app).then(ReplExpect.ok).then(SidecarExpect.open)

      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, updatedText)(res)
      await setValue(res, '')
      await this.app.electron.clipboard.writeText(textToPaste)
      await this.app.client.execute(() => document.execCommand('paste'))

      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, textToPaste)(res)

      await this.app.client.keys(textToTypeAfterPaste)
      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, finalTextAfterPasteTest)(res)
      await save(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  reload()
  Common.localIt('should have that pasted text after refresh', async () => {
    try {
      const res = await CLI.command(`edit ${tmpFilepath}`, this.app).then(ReplExpect.ok).then(SidecarExpect.open)
      await verifyTextExist(`${Selectors.SIDECAR(res.count)} .monaco-editor .view-lines`, finalTextAfterPasteTest)(res)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
