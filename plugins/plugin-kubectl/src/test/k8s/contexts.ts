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

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { safeDump, safeLoad as parseYAML } from 'js-yaml'
import * as path from 'path'
import * as assert from 'assert'

import { expandHomeDir } from '@kui-shell/core'
import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import {
  waitForGreen,
  waitForRed,
  createNS,
  waitTillNone,
  RADIO_BUTTON_BY_NAME,
  RADIO_BUTTON_SELECTED,
  RADIO_BUTTON_IS_SELECTED
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']

const initialContext = execSync('kubectl config current-context')
  .toString()
  .trim()

// TODO: enable this once proxy can find $HOME on travis
Common.localDescribe('kubectl context switching', function(this: Common.ISuite) {
  before(Common.before(this))
  after(
    Common.after(this, () => {
      console.log(`switching back to initial context ${initialContext}`)
      execSync(`kubectl config use-context ${initialContext}`)
      console.log(`switched to ${execSync('kubectl config current-context')}`)
    })
  )

  synonyms.forEach(kubectl => {
    /** delete the given namespace */
    const deleteIt = (name: string, errOk = false) => {
      it(`should delete the namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} delete namespace ${name}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name), errOk })) // FIXME
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

    const defaultFilepath = expandHomeDir('~/.kube/config')
    const getKUBECONFIGFilepath = (): string => {
      if (process.env.KUBECONFIG) {
        const kconfigEnv = process.env.KUBECONFIG.slice(0)
        return kconfigEnv.split(/:/)[0]
      } else {
        return defaultFilepath
      }
    }

    const getKUBECONFIG = (): Buffer => {
      if (process.env.KUBECONFIG) {
        return readFileSync(getKUBECONFIGFilepath())
      } else {
        return execSync('kubectl config view')
      }
    }

    const addNamespaceToKUBECONFIG = (ns: string, contextName: string) => {
      it('should add a new context', async () => {
        try {
          const kconfig = parseYAML(getKUBECONFIG().toString())
          const newOnesFilepath = path.join(path.dirname(getKUBECONFIGFilepath()), 'forTesting.yml')

          kconfig.contexts[0].context.namespace = ns
          kconfig.contexts[0].name = contextName
          writeFileSync(newOnesFilepath, safeDump(kconfig))

          await this.app.client.execute(
            (defaultFilepath: string, newOnesFilepath: string) => {
              process.env.KUBECONFIG = `${process.env.KUBECONFIG || defaultFilepath}:${newOnesFilepath}`
            },
            defaultFilepath,
            newOnesFilepath
          )
        } catch (err) {
          return Common.oops(this)(err)
        }
      })
    }

    /** list contexts and expect the current context */
    const listContextsAndExpectDefault = () => {
      it('should list contexts and show the default context', async () => {
        try {
          const currentContext = await CLI.command(`context`, this.app)
            .then(ReplExpect.okWithCustom({ selector: ' ' }))
            .then(selector => this.app.client.getText(selector))

          const currentContextAsIndicatedByContextsTable = await CLI.command(`contexts -o wide`, this.app)
            .then(
              ReplExpect.okWithCustom({
                selector: `${RADIO_BUTTON_SELECTED} [data-is-name]`
              })
            )
            .then(selector => this.app.client.getText(selector))

          assert.strictEqual(currentContextAsIndicatedByContextsTable, currentContext)
        } catch (err) {
          return Common.oops(this)(err)
        }
      })
    }

    /** list contexts and expect the given context */
    const listContextsAndExpectGiven = (contextName: string) => {
      it(`should list contexts and show the context ${contextName}`, async () => {
        try {
          const allContextNames = await CLI.command(`contexts -o wide`, this.app)
            .then(ReplExpect.okWithCustom({ selector: ' ' }))
            .then(selector => this.app.client.elements(`${selector} [data-is-name]`))
            .then(elements => elements.value.map(_ => _.ELEMENT))
            .then(elements => Promise.all(elements.map(element => this.app.client.elementIdText(element))))
            .then(texts => texts.map(_ => _.value))

          assert.ok(allContextNames.find(_ => _ === contextName))
        } catch (err) {
          return Common.oops(this)(err)
        }
      })
    }

    /** list pods and expect an empty list */
    const listPodsAndExpectNone = (ns: string) => {
      it('should list pods and show nothing', () => {
        return CLI.command(`${kubectl} get pods -n ${ns}`, this.app).then(ReplExpect.error(404))
      })
    }

    /** list pods and expect one entry */
    const listPodsAndExpectOne = (name: string, ns?: string) => {
      it(`should list pods and show ${name} maybe in namespace ${ns || 'nope'}`, () => {
        return CLI.command(`${kubectl} get pods ${ns ? '-n ' + ns : ''}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this))
      })
    }

    /* switch to the given context */
    const switchToContext = (contextName: string) => {
      it(`should switch to the context ${contextName}`, async () => {
        try {
          const selector = await CLI.command(`contexts -o wide`, this.app).then(
            ReplExpect.okWithCustom({
              selector: RADIO_BUTTON_BY_NAME(contextName)
            })
          )

          await this.app.client.click(selector)

          // the row in that first table had better now be selected
          await this.app.client.waitForExist(`${selector}${RADIO_BUTTON_IS_SELECTED}`)

          // and if we request a new contexts table, it'd better be selected there, too
          const selector2 = await CLI.command(`contexts -o wide`, this.app).then(
            ReplExpect.okWithCustom({
              selector: RADIO_BUTTON_BY_NAME(contextName)
            })
          )
          await this.app.client.waitForExist(`${selector2}${RADIO_BUTTON_IS_SELECTED}`)
        } catch (err) {
          return Common.oops(this)(err)
        }
      })
    }

    //
    // now start the tests
    //
    const ns: string = createNS()
    listContextsAndExpectDefault()
    createIt(ns)
    addNamespaceToKUBECONFIG(ns, 'holla') // add yoyo to the KUBECONFIG contexts
    listContextsAndExpectGiven('holla')
    listPodsAndExpectNone(ns)
    createPod(ns) // create a pod in yoyo
    listPodsAndExpectOne('nginx', ns)
    switchToContext('holla')
    listPodsAndExpectOne('nginx')
    deleteIt(ns)
  })
})
