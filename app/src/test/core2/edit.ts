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

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@test/lib/ui'
import * as assert from 'assert'
const { cli, selectors, sidecar } = ui

import { join } from 'path'

/** set the monaco editor text */
const setValue = (client, text) => {
  return client.execute(text => {
    document.querySelector('.monaco-editor-wrapper')['editor'].setValue(text)
  }, text)
}

/** click the save buttom */
const save = (app, action) => () => {
  return app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('Save'))
    .then(() => app.client.waitForExist(`${ui.selectors.SIDECAR}:not(.is-modified):not(.is-new) .is-up-to-date`))
    .then(() => app)
    .catch(err => { throw err })
}

const verifyTextExist = (selector, expectedText) => app => {
  return app.client.waitUntil(() => app.client.getText(selector)
    .then(actualText => actualText === expectedText))
    .then(() => app)
}

describe('editor', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

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
    .then(save(this.app, 'expectNonExist'))
    .catch(common.oops(this)))

  it('should open editNonExistTest.txt and see changed content', () => cli.do('open editNonExistTest.txt', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(verifyTextExist(`${ui.selectors.SIDECAR} .language-txt`, 'testing edit non-existing file'))
    .catch(common.oops(this)))
  */

  const TMP = '/tmp' // FIXME
  const initialFile = 'edit-file.txt'
  const initialFilepath = join('./data/core', initialFile)
  const tmpFilepath = join(TMP, initialFile)

  const initialContent = 'hello world'
  const updatedText = `testing edit ${new Date().getTime()}`

  it('should copy the edit input', () => cli.do(`cp ${initialFilepath} ${tmpFilepath}`, this.app)
    .then(cli.expectJustOK)
    .catch(common.oops(this)))

  it('should edit but not save the content of an existing file', () => cli.do(`edit ${tmpFilepath}`, this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(() => setValue(this.app.client, 'should not be saved'))
     .catch(common.oops(this)))

  it('should re-open the file and see the unchanged content', () => cli.do(`open ${tmpFilepath}`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(verifyTextExist(`${ui.selectors.SIDECAR} .language-txt`, initialContent))
     .catch(common.oops(this)))

  it('should edit and save the content', () => cli.do('edit /tmp/edit-file.txt', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(() => setValue(this.app.client, updatedText))
    .then(save(this.app, 'expectNonExist'))
    .catch(common.oops(this)))

  it('should re-open the initial file and see the unchanged content', () => cli.do(`open ${initialFilepath}`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(verifyTextExist(`${ui.selectors.SIDECAR} .language-txt`, initialContent))
     .catch(common.oops(this)))

  it('should re-open the edited file and see the updated content', () => cli.do(`open ${tmpFilepath}`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(verifyTextExist(`${ui.selectors.SIDECAR} .language-txt`, updatedText))
     .catch(common.oops(this)))
})
