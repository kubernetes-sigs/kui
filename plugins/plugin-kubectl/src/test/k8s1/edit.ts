/*
 * Copyright 2018-19 IBM Corporation
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
  describe(`${command} edit ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`

    const create = (name: string, source = 'pod.yaml') => {
      it(`should create sample pod ${name} from URL via ${command}`, async () => {
        try {
          const selector = await CLI.command(
            `${command} create -f ${ROOT}/data/k8s/headless/${source} ${inNamespace}`,
            this.app
          ).then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))

          // wait for the badge to become green
          await waitForGreen(this.app, selector)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const edit = (name: string, kind = 'Pod', nameAsShown = name, mode = 'raw') => {
      it(`should edit it via ${command} edit with name=${name || 'no-name'}`, async () => {
        try {
          await CLI.command(`${command} edit pod ${name || ''} ${inNamespace}`, this.app)
            .then(ReplExpect.justOK)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(nameAsShown, undefined, undefined, ns))
            .then(SidecarExpect.mode(mode))
            .then(
              SidecarExpect.yaml({
                kind
              })
            )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const modifyWithError = (title: string, where: string, expectedError: string, revert: false) => {
      it(`should modify the content, introducing a ${title}`, async () => {
        try {
          const actualText = await Util.getValueFromMonaco(this.app)
          const specLineIdx = actualText.split(/\n/).indexOf('spec:')

          // +1 here because nth-child is indexed from 1
          const lineSelector = `.view-lines > .view-line:nth-child(${specLineIdx + 1}) .mtk22`
          await this.app.client.click(lineSelector)

          // we'll inject some garbage that we expect to fail validation
          const garbage = 'zzzzzz'

          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.keys(`${where}${garbage}`) // <-- injecting garbage
          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('Save'))

          // an error state and the garbage text had better appear in the toolbar text
          await SidecarExpect.toolbarAlert({ type: 'error', text: expectedError || garbage, exact: false })(this.app)

          if (revert) {
            await this.app.client.click(lineSelector)
            await new Promise(resolve => setTimeout(resolve, 2000))
            await this.app.client.keys(
              where === Keys.Home
                ? `${where}${Keys.DELETE.repeat(garbage.length)}`
                : `${where}${Keys.BACKSPACE.repeat(garbage.length)}`
            )
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
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
    const modify = (name: string, key = 'foo', value = 'bar') => {
      it('should modify the content', async () => {
        try {
          const actualText = await Util.getValueFromMonaco(this.app)
          const labelsLineIdx = actualText.split(/\n/).indexOf('  labels:')

          // +2 here because nth-child is indexed from 1, and we want the line after that
          const lineSelector = `.view-lines > .view-line:nth-child(${labelsLineIdx + 2}) .mtk5:last-child`
          await this.app.client.click(lineSelector)

          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.keys(`${Keys.End}${Keys.ENTER}${key}: ${value}${Keys.ENTER}`)
          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('Save'))
          await SidecarExpect.toolbarAlert({ type: 'success', text: 'Successfully Applied', exact: false })(this.app)
          await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('Save'), 10000, true)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      it('should show the modified content in the current yaml tab', () => {
        return SidecarExpect.yaml({ metadata: { labels: { [key]: value } } })(this.app).catch(Common.oops(this, true))
      })
    }

    /** kubectl get pod ${name} */
    const get = (name: string) => {
      it(`should get pod ${name}`, () => {
        return CLI.command(`${command} get pod ${name} ${inNamespace} -o yaml`, this.app)
          .then(ReplExpect.justOK)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(name, undefined, undefined, ns))
          .catch(Common.oops(this, true))
      })
    }

    /** click Edit button */
    const clickToEdit = (name: string) => {
      it(`should click the edit button to edit ${name}`, async () => {
        try {
          // start with the default mode showing
          await SidecarExpect.mode(defaultModeForGet)

          // click the edit button
          await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('edit-button'))
          await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('edit-button'))

          console.error('1')
          await new Promise(resolve => setTimeout(resolve, 5000))

          // should still be showing pod {name}, but now with the yaml tab selected
          console.error('2')
          await SidecarExpect.showing(name, undefined, undefined, ns)
          console.error('3')
          await SidecarExpect.mode('raw')

          // also: no back/forward buttons should be visible
          console.error('4')
          await this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON, 5000, true)
          console.error('5')
          await this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON, 5000, true)
          console.error('6')
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      modify(name, 'clickfoo1', 'clickbar1')
      modify(name, 'clickfoo2', 'clickbar2') // after success, should re-modify the resource in the current tab successfully
      validationError(true) // do unsupported edits in the current tab, validate the error alert, and then undo the changes
      modify(name, 'clickfoo3', 'clickbar3') // after error, should re-modify the resource in the current tab successfully

      it('should switch to summary tab and see no alerts', async () => {
        try {
          await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('summary'))
          await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('summary'))
          await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('summary'))

          // toolbar alert should not exist
          await this.app.client.waitForExist(Selectors.SIDECAR_ALERT('success'), CLI.waitTimeout, true)
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
    edit('', 'List', '2 items', 'edit')

    edit(nginx)
    modify(nginx)
    modify(nginx, 'foo1', 'bar1') // successfully re-modify the resource in the current tab
    validationError(true) // do unsupported edits in the current tab, and then undo the changes
    modify(nginx, 'foo2', 'bar2') // after error, successfully re-modify the resource in the current tab
    parseError() // after sucess, do unsupported edits

    edit(nginx)
    validationError(true) // do unsupported edits in the current tab, then undo the changes
    parseError() // after error, do another unsupported edits in the current tab

    it('should refresh', () => Common.refresh(this))

    get(nginx)
    clickToEdit(nginx)

    deleteNS(this, ns)
  })
})
