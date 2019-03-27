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
import { cli, selectors, sidecar, expectYAML } from '@kui-shell/core/tests/lib/ui'
import { wipe, waitTillNone } from '@kui-shell/plugin-k8s/tests/lib/k8s/wipe'

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
const initialContent: Resource = safeLoad(readFileSync(initialFilepath))
const updatedContent: Resource = Object.assign({}, initialContent, { name: 'camera-shy', kind: 'hello there' })
// NOTE: the space in 'hello there' is intentional; it tests that the sidecar etc. logic can handle a kind with spaces!

const initialResourceName = initialContent.metadata.name
const updatedResourceName = updatedContent.metadata.name

/** get the monaco editor text */
const getValue = (app: Application) => {
  return app.client.execute(() => {
    return document.querySelector('.monaco-editor-wrapper')['editor'].getValue()
  }).then(_ => _.value)
}

// FROM plugin-editor/src/test/editor/edit.ts
/** set the monaco editor text */
const setValue = (app: Application, text: string) => {
  return app.client.execute(text => {
    document.querySelector('.monaco-editor-wrapper')['editor'].setValue(text)
  }, text)
}
/** click the save buttom */
const save = (app: Application) => () => {
  return app.client.click(selectors.SIDECAR_MODE_BUTTON('Save'))
    .then(() => app.client.waitForExist(`${selectors.SIDECAR}:not(.is-modified):not(.is-new) .is-up-to-date`))
    .then(() => app)
    .catch(err => { throw err })
}
/** for some reason, monaco inserts a trailing view-line even for one-line files :( */
const verifyYAML = (expected: object) => async (app: Application) => {
  const selector = `${selectors.SIDECAR} .monaco-editor .view-lines`

  await app.client.waitUntil(async () => {
    const ok: boolean = await getValue(app)
      .then(expectYAML(expected, false, false)) // false: not a subset; false: do not throw, instead return boolean

    return ok
  })

  return app
}
// done with clone

describe('electron kedit', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const makeACopy = () => {
    it('should copy the edit input', () => cli.do(`cp "${initialFilepath}" "${tmpFilepath}"`, this.app)
     .then(cli.expectJustOK)
     .catch(common.oops(this)))
  }

  /** switch to a given tab */
  const switchTo = (mode: string) => async () => {
    await this.app.client.click(selectors.SIDECAR_MODE_BUTTON(mode))
    return this.app
  }

  const switchToEdit = switchTo('edit')
  const switchToRaw = (cmd: string) => async () => {
    if (cmd !== 'edit') {
      await switchTo('raw')()
    }

    await this.app.client.waitForEnabled(`${selectors.SIDECAR} .monaco-editor`)

    return this.app
  }

  const editWithoutSaving = () => {
    it('should kedit but not save the content of an existing file', () => cli.do(`kedit "${tmpFilepath}"`, this.app)
       .then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(initialResourceName))
       .then(switchToRaw('kedit'))
       .then(() => setValue(this.app, 'should not be saved'))
       .then(() => this.app)
       .then(sidecar.expectShowing(initialResourceName))
       .catch(common.oops(this)))
  }

  const reopenWith = (cmd: string) => ({
    andExpect: (expected: Resource, displayedName = expected.metadata.name) => {
      it(`should re-open the file and see the ${expected.metadata.name} using "${cmd}"`, () => cli.do(`${cmd} "${tmpFilepath}"`, this.app)
         .then(cli.expectJustOK)
         .then(sidecar.expectOpen)
         .then(sidecar.expectShowing(displayedName))
         .then(switchToRaw(cmd))
         .then(verifyYAML(expected))
         .catch(common.oops(this)))
    }
  })

  const updateWith = (cmd: string) => {
    it(`should edit and save the content using "${cmd}"`, () => cli.do(`${cmd} "${tmpFilepath}"`, this.app)
       .then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(() => cmd === 'kedit' && sidecar.expectShowing(initialResourceName)(this.app))
       .then(switchToRaw(cmd))
       .then(() => setValue(this.app, safeDump(updatedContent)))
       .then(save(this.app))
       .then(() => cmd === 'kedit' && sidecar.expectShowing(updatedResourceName)(this.app))
       .catch(common.oops(this)))
  }

  const updateViaForm = () => {
    const cmd = 'kedit'
    const intermediateResourceName = 'funny-money'

    it(`should edit and save the content via form`, () => cli.do(`${cmd} "${tmpFilepath}"`, this.app)
       .then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(initialResourceName))
       .then(() => `${selectors.SIDECAR} .project-config-container .bx--text-input[data-form-label="name"]`)
       .then(selector => this.app.client.waitForVisible(selector).then(() => selector))
       .then(selector => this.app.client.setValue(selector, intermediateResourceName))
       .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('save')))
       .then(() => this.app)
       .then(sidecar.expectShowing(intermediateResourceName))
       .then(switchToRaw(cmd))
       .then(sidecar.expectShowing(intermediateResourceName))
       .then(() => setValue(this.app, safeDump(updatedContent)))
       .then(save(this.app))
       .then(sidecar.expectShowing(updatedResourceName))
       .catch(common.oops(this)))
  }

  //
  // here start the tests
  //

  // make sure editing without saving works
  makeACopy()
  editWithoutSaving()
  reopenWith('open').andExpect(initialContent)
  reopenWith('kedit').andExpect(initialContent)

  // now update via form with "kedit"
  makeACopy()
  updateViaForm()
  reopenWith('open').andExpect(updatedContent)
  reopenWith('kedit').andExpect(updatedContent)

  // now update with "kedit"
  updateWith('kedit')
  reopenWith('open').andExpect(updatedContent)
  reopenWith('kedit').andExpect(updatedContent)

  // now update with "edit"
  makeACopy()
  updateWith('edit')
  reopenWith('open').andExpect(updatedContent)
  reopenWith('kedit').andExpect(updatedContent)
})
