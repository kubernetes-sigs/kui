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
import {
  ISuite,
  before as commonBefore,
  after as commonAfter,
  oops,
  refresh,
  localDescribe
} from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'

import { dirname, join } from 'path'
const { cli, sidecar } = ui
const ROOT = dirname(require.resolve('@kui-shell/plugin-editor/tests/package.json'))

/** grab focus for the editor */
const grabFocus = async (app: Application) => {
  const selector = `${ui.selectors.SIDECAR} .monaco-editor-wrapper .view-lines`
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
  await app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('Save'))
  await app.client.waitForExist(`${ui.selectors.SIDECAR}:not(.is-modified):not(.is-new) .is-up-to-date`)
}

/** for some reason, monaco inserts a trailing view-line even for one-line files :( */
const verifyTextExist = (selector: string, expectedText: string) => async (app: Application): Promise<Application> => {
  await app.client.waitUntil(async () => {
    const actualText = await app.client.getText(selector)
    return actualText.replace(/\s+$/, '') === expectedText
  })

  return app
}

localDescribe('editor basics', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  /* not yet implemented
     it('should create a new file when editing a non-existing file', () => cli.do('edit editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(sidecar.expectShowing('editNonExistTest.txt'))
     .catch(oops(this)))

     it('should open editNonExistTest.txt', () => cli.do('open editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(sidecar.expectShowing('editNonExistTest.txt'))
     .catch(oops(this)))

     it('should rm editNonExistTest.txt', () => cli.do('rm editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .catch(oops(this)))

     it('should edit and save the content of a non-existing file', () => cli.do('edit editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(() => setValue(this.app.client, 'testing edit non-existing file'))
     .then(save(this.app))
     .catch(oops(this)))

     it('should open editNonExistTest.txt and see changed content', () => cli.do('open editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .language-txt`, 'testing edit non-existing file'))
     .catch(oops(this)))
  */

  const TMP = '/tmp' // FIXME
  const initialFile = 'edit-file.txt'
  const initialFilepath = join(ROOT, 'data', initialFile)
  const tmpFilepath = join(TMP, initialFile)

  const initialContent = 'hello world'
  const updatedText = `testing edit ${new Date().getTime()}`

  it('should copy the edit input', () =>
    cli
      .do(`cp ${initialFilepath} ${tmpFilepath}`, this.app)
      .then(cli.expectJustOK)
      .catch(oops(this)))

  it('should edit but not save the content of an existing file', () =>
    cli
      .do(`edit ${tmpFilepath}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
      .then(() => setValue(this.app, 'should not be saved'))
      .catch(oops(this)))

  it('should re-open the file and see the unchanged content', () =>
    cli
      .do(`open ${tmpFilepath}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
      .catch(oops(this)))

  it('should edit and save the content', () =>
    cli
      .do('edit /tmp/edit-file.txt', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
      .then(() => setValue(this.app, updatedText))
      .then(save(this.app))
      .catch(oops(this)))

  it('should re-open the initial file and see the unchanged content', () =>
    cli
      .do(`open ${initialFilepath}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
      .catch(oops(this)))

  it('should re-open the edited file and see the updated content', () =>
    cli
      .do(`open ${tmpFilepath}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, updatedText))
      .catch(oops(this)))

  /** reload the app, and wait for a repl prompt */
  const reload = () => it('should reload the app', () => refresh(this))

  // make sure pasting text in the editor doesn't result in the editor losing focus
  const textToPaste = 'hello world'
  const textToTypeAfterPaste = ' and sun and moon'
  const finalTextAfterPasteTest = `${textToPaste}${textToTypeAfterPaste}`
  reload()
  it('should edit, then paste, and still have focus', () =>
    cli
      .do(`edit ${tmpFilepath}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, updatedText))
      .then(() => setValue(this.app, ''))
      .then(() => this.app.electron.clipboard.writeText(textToPaste))
      .then(() => this.app.client.execute(() => document.execCommand('paste')))
      .then(() => this.app)
      .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, textToPaste))
      .then(async () => {
        await this.app.client.keys(textToTypeAfterPaste)
        return Promise.resolve(this.app)
          .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, finalTextAfterPasteTest))
          .then(save(this.app))
      }))
  reload()
  it('should have that pasted text after refresh', () =>
    cli
      .do(`edit ${tmpFilepath}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, finalTextAfterPasteTest))
      .catch(oops(this)))
})
