/*
 * Copyright 2019 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import {
  remotePodYaml,
  waitForGreen,
  waitForRed,
  createNS,
  waitTillNone
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const ns1 = createNS()
const ns2 = createNS()
const ns3 = createNS()
const ns4 = createNS()
const ns5 = Math.floor(Math.random() * 100) + (1).toString()

const synonyms = ['kubectl']

describe(`kubectl namespace CRUD ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    /** delete the given namespaces */
    const deleteIt = (names: string[], errOk = false) => {
      it(`should delete the namespaces ${names} via ${kubectl}`, async () => {
        try {
          const res = await CLI.command(`${kubectl} delete namespace ${names.join(' ')}`, this.app)

          await Promise.all(
            names.map(name => {
              return ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })(res)
                .then(selector => waitForRed(this.app, selector))
                .then(() => waitTillNone('namespace', undefined, name))
            })
          )
        } catch (err) {
          if (!errOk) {
            return Common.oops(this, true)(err)
          }
        }
      })
    }

    /** create the given namespace */
    const createIt = (name: string) => {
      it(`should create namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} create namespace ${name}`, this.app)
          .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) }))
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

      it('should initiate namespace switch via click', async () => {
        try {
          await CLI.command(`kubectl config set-context --current --namespace=${ns1}`, this.app).then(ReplExpect.ok)

          this.app.client.waitUntil(
            async () => {
              const currentNamespace = await this.app.client
                .$(Selectors.STATUS_STRIPE_WIDGET_LABEL('kui--plugin-kubeui--current-namespace'))
                .then(_ => _.getText())
              return currentNamespace === ns1
            },
            { timeout: CLI.waitTimeout }
          )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
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
        try {
          return this.app.client.waitUntil(
            async () => {
              const currentNamespace = await this.app.client
                .$(Selectors.STATUS_STRIPE_WIDGET_LABEL('kui--plugin-kubeui--current-namespace'))
                .then(_ => _.getText())
              return currentNamespace === 'default'
            },
            { timeout: CLI.waitTimeout }
          )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const switchNamespaceViaStatusStripe = (ns: string) => {
      it('should switch to default namespace via status stripe element', async () => {
        try {
          await this.app.client
            .$(Selectors.STATUS_STRIPE_WIDGET('kui--plugin-kubeui--current-namespace'))
            .then(_ => _.click())

          await this.app.client.$(Selectors.POPOVER_SELECT_OPTION(ns)).then(_ => _.click())

          await this.app.client.waitUntil(
            async () => {
              const newNamespace = await this.app.client
                .$(Selectors.STATUS_STRIPE_WIDGET('kui--plugin-kubeui--current-namespace'))
                .then(_ => _.getText())

              return newNamespace === ns
            },
            { timeout: CLI.waitTimeout }
          )

          // click again to close it
          await this.app.client
            .$(Selectors.STATUS_STRIPE_WIDGET('kui--plugin-kubeui--current-namespace'))
            .then(_ => _.click())
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    /** kubectl describe namespace <name> */
    const describeIt = (name: string) => {
      it(`should describe that namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} describe namespace ${name}`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(name))
          .then(SidecarExpect.mode('summary'))
          .then(SidecarExpect.descriptionList({ Name: name }))
          .catch(Common.oops(this, true))
      })
    }

    /** create a pod in the given namespace */
    const createPod = (ns: string) => {
      it(`should create sample pod in namespace ${ns} from URL via ${kubectl}`, () => {
        return CLI.command(`${kubectl} create -f ${remotePodYaml} -n ${ns}`, this.app)
          .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })

      it(`should show the sample pod in namespace ${ns} in sidecar via ${kubectl}`, () => {
        return CLI.command(`${kubectl} get pod nginx -n ${ns} -o yaml`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
          .catch(Common.oops(this, true))
      })
    }

    const deleteViaButton = (ns: string) => {
      it('should delete the namespace via clicking deletion button in the sidecar', () => {
        return CLI.command(`${kubectl} get ns ${ns} -o yaml`, this.app)
          .then(async res => {
            await ReplExpect.ok(res)
            await SidecarExpect.open(res)

            const deletionButton = await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res.count, 'delete'))
            await deletionButton.waitForExist()
            await deletionButton.click()

            await this.app.client.$(Selectors.CONFIRM_DIALOG).then(_ => _.waitForExist())
            await this.app.client.$(Selectors.CONFIRM_DIALOG_CONFIRM_BUTTON).then(_ => _.click())

            // exepct a deletion table
            const deletionEntitySelector = await ReplExpect.okWithCustom<string>({
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
    switchNamespaceViaStatusStripe(ns1)
    switchNamespaceViaStatusStripe('default')
    createIt(ns2)
    describeIt(ns2)
    createPod(ns1)
    createPod(ns2)
    createIt(ns3)
    createIt(ns4)
    createIt(ns5)
    deleteIt([ns1, ns3, ns4])
    deleteViaButton(ns2)
    deleteViaButton(ns5)
  })
})
