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

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar, expectYAML, getValueFromMonaco, waitTimeout } from '@kui-shell/core/tests/lib/ui'

import { Application } from 'spectron'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { safeLoad, safeDump } from 'js-yaml'

const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))

const TMP = '/tmp' // FIXME
const initialFile = 'deployment.yaml'
const initialFilepath = join(ROOT, 'data', 'k8s', initialFile)
const tmpFilepath = join(TMP, initialFile)

interface Resource {
  kind: string
  metadata: {
    name: string
  }
}

const initialContentRaw = readFileSync(initialFilepath).toString()
const initialContent: Resource = safeLoad(initialContentRaw)
const updatedContent: Resource = Object.assign({}, initialContent, {
  metadata: { name: 'camera-shy' },
  kind: 'hello there'
})
// NOTE: the space in 'hello there' is intentional; it tests that the sidecar etc. logic can handle a kind with spaces!

const initialResourceName = initialContent.metadata.name
// const updatedResourceName = updatedContent.metadata.name

const singleParagraphFilepath = join(ROOT, 'data', 'k8s', 'single-paragraph.yaml')
const trailingEmptyFilepath = join(ROOT, 'data', 'k8s', 'trailing-dash-dash-dash.yaml')
const noMetadataFilepath = join(ROOT, 'data', 'k8s', 'multi-no-metadata.yaml')

/** get the monaco editor text */
const getValue = async (app: Application): Promise<string> => {
  const response = await app.client.execute(() => {
    return document.querySelector('.monaco-editor-wrapper')['editor'].getValue()
  })

  return response.value
}

// FROM plugin-editor/src/test/editor/edit.ts
/** set the monaco editor text */
const setValue = async (app: Application, text: string): Promise<void> => {
  await app.client.execute((text: string) => {
    document.querySelector('.monaco-editor-wrapper')['editor'].setValue(text)
  }, text)
}
/** click the save buttom */
const save = (app: Application) => async (): Promise<void> => {
  await app.client.click(selectors.SIDECAR_MODE_BUTTON('Save'))
  await app.client.waitForExist(`${selectors.SIDECAR}:not(.is-modified):not(.is-new) .is-up-to-date`)
}
/** for some reason, monaco inserts a trailing view-line even for one-line files :( */
const verifyYAML = (expected: object) => async (app: Application): Promise<void> => {
  await app.client.waitUntil(async () => {
    const ok: boolean = await getValue(app).then(expectYAML(expected, false, false)) // false: not a subset; false: do not throw, instead return boolean

    return ok
  })
}
// done with clone

common.localDescribe(`kedit ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const makeACopy = (filepath = initialFilepath, tmp = tmpFilepath) => {
    it('should copy the edit input', () =>
      cli
        .do(`cp "${filepath}" "${tmp}"`, this.app)
        .then(cli.expectJustOK)
        .catch(common.oops(this)))
  }

  /** switch to a given tab */
  const switchTo = (mode: string) => async () => {
    await this.app.client.click(selectors.SIDECAR_MODE_BUTTON(mode))
    return this.app
  }

  switchTo('edit')
  const switchToRaw = (cmd: string) => async () => {
    if (cmd !== 'edit') {
      await switchTo('raw')()
    }

    await this.app.client.waitForEnabled(`${selectors.SIDECAR} .monaco-editor`)

    return this.app
  }

  const editWithoutSaving = (filepath = tmpFilepath, expectedResource = initialContent) => {
    it('should kedit but not save the content of an existing file', () =>
      cli
        .do(`kedit "${filepath}"`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(initialResourceName))
        .then(switchToRaw('kedit'))
        .then(verifyYAML(expectedResource))
        .then(() => setValue(this.app, 'should not be saved'))
        .then(() => this.app)
        .then(sidecar.expectShowing(initialResourceName))
        .then(() =>
          this.app.client.waitUntil(async () => {
            const actualText = await getValueFromMonaco(this.app)
            return actualText === 'should not be saved'
          }, waitTimeout)
        )
        .catch(common.oops(this, true)))
  }

  const reopenWith = (cmd: string, tmp = tmpFilepath) => ({
    andExpect: (expected: Resource, displayedName = expected.metadata.name) => {
      it(`should re-open the file and see resource named ${expected.metadata.name} using "${cmd}"`, () =>
        cli
          .do(`${cmd} "${tmp}"`, this.app)
          .then(cli.expectJustOK)
          .then(sidecar.expectOpen)
          .then(sidecar.expectShowing(displayedName))
          .then(switchToRaw(cmd))
          .then(verifyYAML(expected))
          .catch(common.oops(this)))
    }
  })

  const updateWith = (cmd: string, tmp = tmpFilepath) => {
    it(`should edit and save the content using "${cmd}"`, () =>
      cli
        .do(`${cmd} "${tmp}"`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(() => cmd === 'kedit' && sidecar.expectShowing(initialResourceName)(this.app))
        .then(switchToRaw(cmd))
        .then(() => setValue(this.app, safeDump(updatedContent)))
        .then(save(this.app))
        // .then(() => cmd === 'kedit' && sidecar.expectShowing(updatedResourceName)(this.app))
        .catch(common.oops(this)))
  }

  const updateViaForm = (tmp = tmpFilepath) => {
    const cmd = 'kedit'
    const intermediateResourceName = 'funny-money'

    it(`should edit and save the content via form`, () =>
      cli
        .do(`${cmd} "${tmp}"`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(initialResourceName))
        .then(() => `${selectors.SIDECAR} .project-config-container .bx--text-input[data-form-label="name"]`)
        .then(async selector => {
          await this.app.client.waitForVisible(selector)
          return this.app.client.setValue(selector, intermediateResourceName)
        })
        .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('save')))
        .then(() => this.app)
        //        .then(sidecar.expectShowing(intermediateResourceName))
        .then(switchToRaw(cmd))
        //        .then(sidecar.expectShowing(intermediateResourceName))
        .then(() => setValue(this.app, safeDump(updatedContent)))
        .then(save(this.app))
        //        .then(() => sidecar.expectShowing(updatedResourceName)(this.app))
        .catch(common.oops(this)))
  }

  //
  // here start the tests
  //

  // single-paragraph yaml
  it('should kedit a single-paragraph yaml', () =>
    cli
      .do(`kedit "${singleParagraphFilepath}"`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('reviews'))
      .catch(common.oops(this)))

  // trailing empty paragraph
  it('should kedit a multi-paragraph yaml with trailing empty paragraph', () =>
    cli
      .do(`kedit "${trailingEmptyFilepath}"`, this.app)
      .then(cli.expectOKWith('details-v1'))
      .catch(common.oops(this)))

  // multi-paragraph yaml where one paragraph has no metadata
  it('should kedit a multi-paragraph yaml with no metadata', () =>
    cli
      .do(`kedit "${noMetadataFilepath}"`, this.app)
      .then(cli.expectOKWith('test-release-mysql-test'))
      .catch(common.oops(this)))

  // make sure editing without saving works
  makeACopy()
  editWithoutSaving()
  reopenWith('open').andExpect(initialContent)
  reopenWith('kedit').andExpect(initialContent)

  // now update via form with "kedit"
  // makeACopy() <-- note no copy, this will double-check that the editWithoutSaving truly did not save
  updateViaForm()
  reopenWith('open').andExpect(updatedContent)
  reopenWith('kedit').andExpect(updatedContent)

  // now update with "kedit"
  makeACopy()
  updateWith('kedit')
  reopenWith('open').andExpect(updatedContent)
  reopenWith('kedit').andExpect(updatedContent)

  // now update with "edit"
  makeACopy()
  updateWith('edit')
  reopenWith('open').andExpect(updatedContent)
  reopenWith('kedit').andExpect(updatedContent)
})
