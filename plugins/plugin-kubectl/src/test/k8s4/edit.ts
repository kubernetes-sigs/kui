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

import * as assert from 'assert'
import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Keys, Util } from '@kui-shell/test'
import {
  waitForGreen,
  createNS,
  allocateNS,
  deleteNS,
  defaultModeForGet
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const commands = ['kubectl']

commands.forEach(command => {
  describe(`${command} edit ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`

    let res: ReplExpect.AppAndCount
    const create = (name: string, source = 'pod.yaml') => {
      it(`should create sample pod ${name} from URL via ${command}`, async () => {
        try {
          const res = await CLI.command(
            `${command} create -f ${ROOT}/data/k8s/headless/${source} ${inNamespace}`,
            this.app
          )

          const selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })(res)

          // wait for the badge to become green
          await waitForGreen(this.app, selector)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const edit = (
      name: string,
      kind: string | RegExp = 'Pod',
      nameAsShown = name,
      mode = 'raw',
      clickable?: boolean
    ) => {
      it(`should edit it via ${command} edit with name=${name || 'no-name'}`, async () => {
        try {
          console.error('E1')
          res = await CLI.command(`${command} edit pod ${name || ''} ${inNamespace}`, this.app)

          console.error('E2')
          await ReplExpect.ok(res)

          console.error('E3')
          await SidecarExpect.open(res)

          console.error('E4')
          await SidecarExpect.showing(
            nameAsShown,
            undefined,
            undefined,
            ns,
            undefined,
            undefined,
            undefined,
            clickable
          )(res)

          console.error('E5')
          await SidecarExpect.mode(mode)(res)

          console.error('E6')
          await SidecarExpect.yaml({
            kind
          })(res)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const modifyWithError = (title: string, where: string, expectedError: string, revert: false) => {
      it(`should modify the content, introducing a ${title}`, async () => {
        try {
          const actualText = await Util.getValueFromMonaco(res)
          const labelsLineIdx = actualText.split(/\n/).indexOf('  labels:')

          // +1 here because nth-child is indexed from 1
          const lineSelector = `${Selectors.SIDECAR(res.count)} .view-lines > .view-line:nth-child(${
            labelsLineIdx + 1
          }) .mtk22`
          await this.app.client.$(lineSelector).then(_ => _.click())

          // we'll inject some garbage that we expect to fail validation
          const garbage = 'zzzzzz'

          console.error('ME1')
          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.keys(`${where}${garbage}`) // <-- injecting garbage
          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.$(Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, 'Save')).then(_ => _.click())
          console.error('ME2')

          // an error state and the garbage text had better appear in the toolbar text
          await SidecarExpect.toolbarAlert({ type: 'error', text: expectedError || garbage, exact: false })(res)
          console.error('ME3')

          // expect line number to be highlighted, and for that line to be visible
          await this.app.client
            .$(`${Selectors.SIDECAR_TAB_CONTENT(res.count)} .kui--editor-line-highlight`)
            .then(_ => _.waitForDisplayed())
          console.error('ME4')

          if (revert) {
            await this.app.client.$(Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, 'Revert')).then(_ => _.click())
            console.error('ME5')
            let idx = 0
            await this.app.client.waitUntil(
              async () => {
                const revertedText = await Util.getValueFromMonaco(res)
                if (++idx > 5) {
                  console.error(`still waiting for revertedText=${revertedText} actualText=${actualText}`)
                }
                return revertedText === actualText
              },
              { timeout: CLI.waitTimeout }
            )
          }
          console.error('ME6')
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    // go to spec: line, insert garbage at the beginning (Keys.Home),
    // expect to find garbage text in error message; the last
    // "undefined" means use garbage text as the expected error
    const validationError = modifyWithError.bind(undefined, 'validation error', Keys.Home, undefined)

    // go to spec: line, insert garbage at the end (Keys.End), expect
    // to find "could not find expected..." in error message
    const parseError = modifyWithError.bind(undefined, 'parse error', Keys.End, 'could not find expected')

    /** modify pod {name} so as to add a label of key=value */
    const modify = (name: string, key = 'foo', value = 'bar', needsUnfold = true) => {
      it(`should modify the content by adding label ${key}=${value}`, async () => {
        try {
          const actualText = await Util.getValueFromMonaco(res)
          const labelsLineIdx = actualText.split(/\n/).indexOf('  labels:')

          if (needsUnfold) {
            await Util.clickToExpandMonacoFold(res, labelsLineIdx)
          }

          // +2 here because nth-child is indexed from 1, and we want the line after that
          const lineSelector = `${Selectors.SIDECAR(res.count)} .view-lines > .view-line:nth-child(${
            labelsLineIdx + 2
          }) .mtk5:last-child`
          await this.app.client.$(lineSelector).then(_ => _.click())

          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.keys(`${Keys.End}${Keys.ENTER}${key}: ${value}${Keys.ENTER}`)
          await new Promise(resolve => setTimeout(resolve, 2000))

          const saveButton = await this.app.client.$(Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, 'Save'))
          await saveButton.click()
          // await SidecarExpect.toolbarAlert({ type: 'success', text: 'Successfully Applied', exact: false })(res)
          console.error('M1')
          await saveButton.waitForExist({ timeout: 10000, reverse: true })
          console.error('M2')
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      it('should show the modified content in the current yaml tab', () => {
        return SidecarExpect.yaml({ metadata: { labels: { [key]: value } } })(res).catch(Common.oops(this, true))
      })
    }

    /** kubectl get pod ${name} */
    const get = (name: string) => {
      it(`should get pod ${name}`, async () => {
        try {
          res = await CLI.command(`${command} get pod ${name} ${inNamespace} -o yaml`, this.app)
            .then(ReplExpect.ok)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(name, undefined, undefined, ns))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    /** click Edit button */
    const clickToEdit = (name: string) => {
      it(`should click the edit button to edit ${name}`, async () => {
        try {
          // start with the default mode showing
          await SidecarExpect.mode(defaultModeForGet)(res)

          // click the edit button
          await this.app.client.$(Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, 'edit-button')).then(async _ => {
            await _.waitForDisplayed()
            await _.click()
          })

          console.error('CE1')
          await new Promise(resolve => setTimeout(resolve, 5000))

          // edit button should not exist
          await this.app.client
            .$(Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, 'edit-button'))
            .then(_ => _.waitForExist({ timeout: 5000, reverse: true }))

          // should still be showing pod {name}, but now with the yaml tab selected
          console.error('CE2')
          await SidecarExpect.showing(name, undefined, undefined, ns)(res)
          console.error('CE3')
          await SidecarExpect.mode('raw')(res)

          // also: no back/forward buttons should be visible
          console.error('CE4')
          await this.app.client
            .$(Selectors.SIDECAR_BACK_BUTTON(res.count))
            .then(_ => _.waitForExist({ timeout: 5000, reverse: true }))
          console.error('CE5')
          await this.app.client
            .$(Selectors.SIDECAR_FORWARD_BUTTON(res.count))
            .then(_ => _.waitForExist({ timeout: 5000, reverse: true }))
          console.error('CE6')
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      modify(name, 'clickfoo1', 'clickbar1')
      modify(name, 'clickfoo2', 'clickbar2') // after success, should re-modify the resource in the current tab successfully
      validationError(true) // do unsupported edits in the current tab, validate the error alert, and then undo the changes
      modify(name, 'clickfoo3', 'clickbar3', false) // after error, should re-modify the resource in the current tab successfully

      // no longer needed, with DescriptionList summary
      xit('should switch to summary tab, expect no alerts and not editable', async () => {
        try {
          await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res.count, 'summary')).then(async _ => {
            await _.waitForDisplayed()
            await _.click()
          })
          await this.app.client
            .$(Selectors.SIDECAR_MODE_BUTTON_SELECTED(res.count, 'summary'))
            .then(_ => _.waitForDisplayed())

          // toolbar alert should not exist
          await this.app.client
            .$(Selectors.SIDECAR_ALERT(res.count, 'success'))
            .then(_ => _.waitForExist({ timeout: CLI.waitTimeout, reverse: true }))

          // edit button should not exist
          await this.app.client
            .$(Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, 'edit-button'))
            .then(_ => _.waitForExist({ timeout: 5000, reverse: true }))

          // try editing the summary mode
          const actualText = await Util.getValueFromMonaco(res)
          const labelsLineIdx = actualText.split(/\n/).indexOf('Name:')

          // +2 here because nth-child is indexed from 1, and we want the line after that
          const lineSelector = `${Selectors.SIDECAR(res.count)} .view-lines > .view-line:nth-child(${
            labelsLineIdx + 2
          }) .mtk5:last-child`
          await this.app.client.$(lineSelector).then(_ => _.click())

          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.keys('x') // random key
          await new Promise(resolve => setTimeout(resolve, 2000))

          // should have same text
          const actualText2 = await Util.getValueFromMonaco(res)
          assert.ok(actualText === actualText2)

          await this.app.client
            .$(Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, 'Save'))
            .then(_ => _.waitForExist({ timeout: 10000, reverse: true })) // should not have apply button
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    //
    // here come the tests
    //
    allocateNS(this, ns)

    const nginx = 'nginx'
    create(nginx)

    const name2 = 'nginx2'
    create(name2, 'pod2.yaml')
    edit('', /List$/, '2 items', 'edit', false)

    edit(nginx)
    modify(nginx)
    modify(nginx, 'foo1', 'bar1') // successfully re-modify the resource in the current tab
    validationError(true) // do unsupported edits in the current tab, and then undo the changes
    modify(nginx, 'foo2', 'bar2', false) // after error, successfully re-modify the resource in the current tab
    parseError() // after sucess, do unsupported edits

    it('should refresh', () => Common.refresh(this))

    // FIXME: after this, the test is not working
    edit(nginx)
    validationError(true) // do unsupported edits in the current tab, then undo the changes
    parseError() // after error, do another unsupported edits in the current tab

    it('should refresh', () => Common.refresh(this))

    get(nginx)
    clickToEdit(nginx)

    deleteNS(this, ns)
  })
})
