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
import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, waitForRed, createNS, waitTillNone } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const ns1: string = createNS()
const ns2: string = createNS()
const synonyms = ['kubectl']

describe(`kubectl namespace ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    /** delete the given namespace */
    const deleteIt = (name: string, errOk = false) => {
      it(`should delete the namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} delete namespace ${name}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))
          .then(selector => waitForRed(this.app, selector))
          .then(() => waitTillNone('namespace', undefined, name))
          .catch(err => {
            if (!errOk) {
              return Common.oops(this, true)(err)
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
          .catch(Common.oops(this, true))
      })
    }

    /** switch to default context via command */
    const switchToDefault = () => {
      it('should switch back to default via command', () => {
        return CLI.command(`kubectl config set-context --current --namespace=default`, this.app)
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
        const radioButton = Selectors.RADIO_BUTTON
        const radioButtonSelected = Selectors.RADIO_BUTTON_SELECTED

        return CLI.command(`${kubectl} get ns ${ns1}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: radioButton }))
          .then(selector =>
            this.app.client.waitUntil(async () => {
              console.error('1', selector)
              await this.app.client.click(selector)
              console.error('2')
              const actualNamespace = await this.app.client.getText(
                Selectors.STATUS_STRIPE_WIDGET_LABEL('kui--plugin-kubeui--current-namespace')
              )
              console.error('3', actualNamespace)
              await this.app.client.waitForExist(selector.replace(radioButton, radioButtonSelected))
              console.error('4')
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

        await this.app.client.click(Selectors.STATUS_STRIPE_WIDGET('kui--plugin-kubeui--current-namespace'))

        // await ReplExpect.okWith('default')({ app: this.app, count: res.count + 1 })
        await this.app.client.waitForExist(`${Selectors.OUTPUT_N(res.count + 1)} .kui--data-table-title`)
        const title = await this.app.client.getText(`${Selectors.OUTPUT_N(res.count + 1)} .kui--data-table-title`)
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
          .then(SidecarExpect.yaml({ Name: name }))
          .catch(Common.oops(this, true))
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
          .catch(Common.oops(this, true))
      })

      it(`should show the sample pod in namespace ${ns} in sidecar via ${kubectl}`, () => {
        return CLI.command(`${kubectl} get pod nginx -n ${ns} -o yaml`, this.app)
          .then(ReplExpect.justOK)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
          .catch(Common.oops(this, true))
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
          .catch(Common.oops(this, true))
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
