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

import { Application, SpectronClient } from 'spectron'
import { ISuite } from '@kui-shell/core/tests/lib/common'
import * as common from '@kui-shell/core/tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as assert from 'assert'
const { cli, selectors, sidecar } = ui
const { localDescribe } = common

import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-editor/tests/package.json'))

/** set the monaco editor text */
const setValue = async (app: Application, text: string) => {
  await app.client.execute(text => {
    document.querySelector('.monaco-editor-wrapper')['editor'].setValue(text)
  }, text)

  return grabFocus(app)
}

/** click the save buttom */
const save = (app: Application) => () => {
  return app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('Save'))
    .then(() => app.client.waitForExist(`${ui.selectors.SIDECAR}:not(.is-modified):not(.is-new) .is-up-to-date`))
    .then(() => app)
    .catch(err => { throw err })
}

/** for some reason, monaco inserts a trailing view-line even for one-line files :( */
const verifyTextExist = (selector: string, expectedText: string) => async (app: Application): Promise<Application> => {
  await app.client.waitUntil(async () => {
    const actualText = await app.client.getText(selector)
    return actualText.replace(/\s+$/, '') === expectedText
  })

  return app
}

/** grab focus for the editor */
const grabFocus = async (app: Application) => {
  const selector = `${ui.selectors.SIDECAR} .monaco-editor-wrapper .view-lines`
  await app.client.click(selector).then(() => app.client.waitForEnabled(selector))
}

localDescribe('editor basics', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  /* not yet implemented
     it('should create a new file when editing a non-existing file', () => cli.do('edit editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(sidecar.expectShowing('editNonExistTest.txt'))
     .catch(common.oops(this)))

     it('should open editNonExistTest.txt', () => cli.do('open editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(sidecar.expectShowing('editNonExistTest.txt'))
     .catch(common.oops(this)))

     it('should rm editNonExistTest.txt', () => cli.do('rm editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .catch(common.oops(this)))

     it('should edit and save the content of a non-existing file', () => cli.do('edit editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(() => setValue(this.app.client, 'testing edit non-existing file'))
     .then(save(this.app))
     .catch(common.oops(this)))

     it('should open editNonExistTest.txt and see changed content', () => cli.do('open editNonExistTest.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .language-txt`, 'testing edit non-existing file'))
     .catch(common.oops(this)))
  */

  const TMP = '/tmp' // FIXME
  const initialFile = 'edit-file.txt'
  const initialFilepath = join(ROOT, 'data', initialFile)
  const tmpFilepath = join(TMP, initialFile)

  const initialContent = 'hello world'
  const updatedText = `testing edit ${new Date().getTime()}`

  it('should copy the edit input', () => cli.do(`cp ${initialFilepath} ${tmpFilepath}`, this.app)
     .then(cli.expectJustOK)
     .catch(common.oops(this)))

  it('should edit but not save the content of an existing file', () => cli.do(`edit ${tmpFilepath}`, this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
     .then(() => setValue(this.app, 'should not be saved'))
     .catch(common.oops(this)))

  it('should re-open the file and see the unchanged content', () => cli.do(`open ${tmpFilepath}`, this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
     .catch(common.oops(this)))

  it('should edit and save the content', () => cli.do('edit /tmp/edit-file.txt', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
     .then(() => setValue(this.app, updatedText))
     .then(save(this.app))
     .catch(common.oops(this)))

  it('should re-open the initial file and see the unchanged content', () => cli.do(`open ${initialFilepath}`, this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, initialContent))
     .catch(common.oops(this)))

  it('should re-open the edited file and see the updated content', () => cli.do(`open ${tmpFilepath}`, this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, updatedText))
     .catch(common.oops(this)))

  /** reload the app, and wait for a repl prompt */
  const refresh = () => {
    it('should reload the app', () => this.app.restart())
  }

  // make sure pasting text in the editor doesn't result in the editor losing focus
  const textToPaste = 'hello world'
  const textToTypeAfterPaste = ' and sun and moon'
  const finalTextAfterPasteTest = `${textToPaste}${textToTypeAfterPaste}`
  refresh()
  it('should edit, then paste, and still have focus', () => cli.do(`edit ${tmpFilepath}`, this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, updatedText))
     .then(() => setValue(this.app, ''))
     .then(() => this.app.electron.clipboard.writeText(textToPaste))
     .then(() => this.app.client.execute(() => document.execCommand('paste')))
     .then(() => this.app)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, textToPaste))
     .then(() => this.app.client.keys(textToTypeAfterPaste))
     .then(() => this.app)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, finalTextAfterPasteTest))
     .then(save(this.app)))
  refresh()
  it('should have that pasted text after refresh', () => cli.do(`edit ${tmpFilepath}`, this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(verifyTextExist(`${ui.selectors.SIDECAR} .monaco-editor .view-lines`, finalTextAfterPasteTest))
     .catch(common.oops(this)))
})
