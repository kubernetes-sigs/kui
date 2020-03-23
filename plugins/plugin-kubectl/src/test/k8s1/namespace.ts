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

import { strictEqual } from 'assert'
import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import {
  waitForGreen,
  waitForRed,
  createNS,
  waitTillNone,
  RADIO_BUTTON,
  RADIO_BUTTON_SELECTED
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const ns1: string = createNS()
const ns2: string = createNS()
const synonyms = ['kubectl']

describe(`kubectl namespace ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    /** return the editor text */
    const getText = () => {
      return Util.getValueFromMonaco(this.app)
    }

    /** expect to see some familiar bits of a pod in the editor under the Describe tab */
    const expectDescribeText = (name: string) => () => {
      return this.app.client.waitUntil(async () => {
        const actualText = await getText()
        return new RegExp(`NAME:\\s+${name}`).test(actualText)
      })
    }

    /** delete the given namespace */
    const deleteIt = (name: string, errOk = false) => {
      it(`should delete the namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} delete namespace ${name}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))
          .then(selector => waitForRed(this.app, selector))
          .then(() => waitTillNone('namespace', undefined, name))
          .catch(err => {
            if (!errOk) {
              return Common.oops(this)(err)
            }
          })
      })
    }

    /** create the given namespace */
    const createIt = (name: string) => {
      it(`should create namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} create namespace ${name}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this))
      })
    }

    /** switch to default context via command */
    const switchToDefault = () => {
      it('should switch back to default via command', () => {
        return CLI.command(`namespace switch default`, this.app)
          .then(ReplExpect.okWithAny)
          .catch(Common.oops(this, true))
      })

      it('should show default as current namespace', () => {
        return CLI.command(`namespace current`, this.app)
          .then(ReplExpect.okWithString('default'))
          .catch(Common.oops(this, true))
      })
    }

    /** kubectl get namespace and show clickable table */
    const listIt = (ns1: string) => {
      it('should show default as current namespace', () => {
        return CLI.command(`namespace current`, this.app)
          .then(ReplExpect.okWithString('default'))
          .catch(Common.oops(this, true))
      })

      it(`should list the namespace default`, () => {
        return CLI.command(`${kubectl} get ns default`, this.app)
          .then(ReplExpect.okWith('default'))
          .catch(Common.oops(this, true))
      })

      it(`should list the namespace ${ns1}`, () => {
        return CLI.command(`${kubectl} get ns ${ns1}`, this.app)
          .then(ReplExpect.okWith(ns1))
          .catch(Common.oops(this, true))
      })

      it(`should initiate namespace switch via click`, () => {
        const radioButton = `${Selectors.BY_NAME('')} ${RADIO_BUTTON}`
        const radioButtonSelected = `${Selectors.BY_NAME('')}${RADIO_BUTTON_SELECTED}`

        return CLI.command(`${kubectl} get ns ${ns1}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: radioButton }))
          .then(selector =>
            this.app.client.waitUntil(async () => {
              await this.app.client.click(selector)
              const actualNamespace = await this.app.client.getText(
                '#kui--status-stripe .kui--plugin-kubeui--current-namespace .kui--status-stripe-text'
              )
              await this.app.client.waitForExist(selector.replace(radioButton, radioButtonSelected))
              return actualNamespace === ns1
            })
          )
          .catch(Common.oops(this, true))
      })

      it(`should show ${ns1} as current namespace`, () => {
        return CLI.command(`namespace current`, this.app)
          .then(ReplExpect.okWithString(ns1))
          .catch(Common.oops(this, true))
      })

      switchToDefault()
    }

    /** click on status stripe namespace widget */
    const listItViaStatusStripe = () => {
      it('should list namespaces by clicking on status stripe widget', async () => {
        const res = await CLI.command('echo hi', this.app)
        await ReplExpect.okWithPtyOutput('hi')(res)

        await this.app.client.click('#kui--status-stripe .kui--plugin-kubeui--current-namespace .clickable')

        // await ReplExpect.okWith('default')({ app: this.app, count: res.count + 1 })
        await this.app.client.waitForExist(`${Selectors.OUTPUT_N(res.count + 1)} .bx--data-table-header__title`)
        const title = await this.app.client.getText(
          `${Selectors.OUTPUT_N(res.count + 1)} .bx--data-table-header__title`
        )
        strictEqual(title, 'Namespaces')
      })
    }

    /** kubectl describe namespace <name> */
    const describeIt = (name: string) => {
      it(`should describe that namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} describe namespace ${name}`, this.app)
          .then(ReplExpect.justOK)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(name))
          .then(SidecarExpect.mode('summary'))
          .then(expectDescribeText(name))
          .catch(Common.oops(this))
      })
    }

    /** create a pod in the given namespace */
    const createPod = (ns: string) => {
      it(`should create sample pod in namespace ${ns} from URL via ${kubectl}`, () => {
        return CLI.command(
          `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`,
          this.app
        )
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this))
      })

      it(`should show the sample pod in namespace ${ns} in sidecar via ${kubectl}`, () => {
        return CLI.command(`${kubectl} get pod nginx -n ${ns} -o yaml`, this.app)
          .then(ReplExpect.justOK)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
          .catch(Common.oops(this))
      })
    }

    const deleteViaButton = (ns: string) => {
      it('should delete the namespace via clicking deletion button in the sidecar', () => {
        return CLI.command(`${kubectl} get ns ${ns} -o yaml`, this.app)
          .then(async res => {
            await ReplExpect.justOK(res)
            await SidecarExpect.open(this.app)

            const deletionButton = Selectors.SIDECAR_MODE_BUTTON('delete')
            await this.app.client.waitForExist(deletionButton)
            await this.app.client.click(deletionButton)

            await this.app.client.waitForExist('#confirm-dialog')
            await this.app.client.click('#confirm-dialog .bx--btn--danger')

            // exepct a deletion table
            const deletionEntitySelector = await ReplExpect.okWithCustom({
              selector: Selectors.BY_NAME(ns)
            })({ app: this.app, count: res.count + 1 })

            return waitForRed(this.app, deletionEntitySelector)
          })
          .catch(Common.oops(this))
      })
    }

    //
    // now start the tests
    //
    switchToDefault()
    createIt(ns1)
    listItViaStatusStripe()
    listIt(ns1)
    describeIt(ns1)
    createIt(ns2)
    describeIt(ns2)
    createPod(ns1)
    createPod(ns2)
    deleteIt(ns1)
    deleteViaButton(ns2)
  })
})
