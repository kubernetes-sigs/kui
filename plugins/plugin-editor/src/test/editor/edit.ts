/*
 * Copyright 2018 IBM Corporation
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
import { dirname, join } from 'path'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/plugin-editor/tests/package.json'))

/** grab focus for the editor */
const grabFocus = async (app: Application) => {
  const selector = `${Selectors.SIDECAR} .monaco-editor-wrapper .view-lines`
  await app.client.click(selector).then(() => app.client.waitForEnabled(selector))
}

/** set the monaco editor text */
const setValue = async (app: Application, text: string): Promise<void> => {
  await app.client.execute(text => {
    document.querySelector('.monaco-editor-wrapper')['editor'].setValue(text)
  }, text)

  await grabFocus(app)
}

/** click the save buttom */
const save = (app: Application) => async (): Promise<void> => {
  await app.client.click(Selectors.SIDECAR_MODE_BUTTON('Save'))
  await app.client.waitForExist(`${Selectors.SIDECAR} .editor-status.is-up-to-date`)
}

/** for some reason, monaco inserts a trailing view-line even for one-line files :( */
const verifyTextExist = (selector: string, expectedText: string) => async (app: Application): Promise<Application> => {
  await app.client.waitUntil(async () => {
    const actualText = await app.client.getText(selector)
    return actualText.replace(/\s+$/, '') === expectedText
  }, 20000)

  return app
}

Common.pDescribe(`editor basics ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const TMP = '/tmp' // FIXME

  const nonExistFileName = 'editNonExistTest.txt'
  const nonExistFileName2 = 'editNonExistTest2.txt'
  const nonExistFilePath = join(TMP, nonExistFileName)
  const nonExistFilePath2 = join(TMP, nonExistFileName2)
  it('should create a new file when editing a non-existing file', () =>
    CLI.command(`edit ${nonExistFilePath}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(nonExistFileName))
      .catch(Common.oops(this, true)))

  it(`should open ${nonExistFilePath}`, () =>
    CLI.command(`open ${nonExistFilePath}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(nonExistFileName))
      .catch(Common.oops(this, true)))

  it(`should rm ${nonExistFilePath}`, () =>
    CLI.command(`rm -f ${nonExistFilePath}`, this.app) // note the -f here; it's ok if the file doesn't exist
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it(`should rm -f ${nonExistFilePath2}`, () =>
    CLI.command(`rm -f ${nonExistFilePath2}`, this.app) // note the -f here; it's ok if the file doesn't exist
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  // editor save not yet supported in proxy mode
  Common.localIt('should edit and save the content of a non-existing file', () =>
    CLI.command(`edit --create ${nonExistFilePath2}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(nonExistFileName2))
      .then(() => setValue(this.app, 'testing edit non-existing file'))
      .then(save(this.app))
      .catch(Common.oops(this, true))
  )
  Common.localIt(`should open ${nonExistFilePath2} and see changed content`, () =>
    CLI.command(`open ${nonExistFilePath2}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(nonExistFileName2))
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, 'testing edit non-existing file'))
      .catch(Common.oops(this, true))
  )
  Common.localIt(`should rm ${nonExistFilePath2}`, () =>
    CLI.command(`rm ${nonExistFilePath2}`, this.app) // note: no -f here, because we expect the file to be there
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true))
  )

  const initialFile = 'edit-file.txt'
  const initialFilepath = join(ROOT, 'data', initialFile)
  const tmpFilepath = join(TMP, initialFile)

  const initialContent = 'hello world'
  const updatedText = `testing edit ${new Date().getTime()}`

  it('should copy the edit input', () =>
    CLI.command(`cp ${initialFilepath} ${tmpFilepath}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it('should edit but not save the content of an existing file', () =>
    CLI.command(`edit ${tmpFilepath}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
      .then(() => setValue(this.app, 'should not be saved'))
      .catch(Common.oops(this, true)))

  it('should re-open the file and see the unchanged content', () =>
    CLI.command(`open ${tmpFilepath}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
      .catch(Common.oops(this, true)))

  // editor save not yet supported in proxy mode
  Common.localIt('should edit and save the content', () =>
    CLI.command('edit /tmp/edit-file.txt', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
      .then(() => setValue(this.app, updatedText))
      .then(save(this.app))
      .catch(Common.oops(this, true))
  )
  Common.localIt('should re-open the initial file and see the unchanged content', () =>
    CLI.command(`open ${initialFilepath}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
      .catch(Common.oops(this, true))
  )
  Common.localIt('should re-open the edited file and see the updated content', () =>
    CLI.command(`open ${tmpFilepath}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, updatedText))
      .catch(Common.oops(this, true))
  )

  /** reload the app, and wait for a repl prompt */
  const reload = () => Common.localIt('should reload the app', () => Common.refresh(this))
  // note on Common.localIt   ^^^^^^^ <-- because the following are all Common.localIt tests

  // make sure pasting text in the editor doesn't result in the editor losing focus
  const textToPaste = 'hello world'
  const textToTypeAfterPaste = ' and sun and moon'
  const finalTextAfterPasteTest = `${textToPaste}${textToTypeAfterPaste}`
  reload()
  Common.localIt('should edit, then paste, and still have focus', () =>
    CLI.command(`edit ${tmpFilepath}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, updatedText))
      .then(() => setValue(this.app, ''))
      .then(() => this.app.electron.clipboard.writeText(textToPaste))
      .then(() => this.app.client.execute(() => document.execCommand('paste')))
      .then(() => this.app)
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, textToPaste))
      .then(async () => {
        await this.app.client.keys(textToTypeAfterPaste)
        return Promise.resolve(this.app)
          .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, finalTextAfterPasteTest))
          .then(save(this.app))
      })
  )
  reload()
  Common.localIt('should have that pasted text after refresh', () =>
    CLI.command(`edit ${tmpFilepath}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(verifyTextExist(`${Selectors.SIDECAR} .monaco-editor .view-lines`, finalTextAfterPasteTest))
      .catch(Common.oops(this, true))
  )
})
