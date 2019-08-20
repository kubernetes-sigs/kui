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

import expandHomeDir from '@kui-shell/core/util/home'
import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import { waitForGreen, waitForRed, createNS, waitTillNone } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const synonyms = ['kubectl']

const initialContext = execSync('kubectl config current-context')
  .toString()
  .trim()

// TODO: enable this once proxy can find $HOME on travis
common.localDescribe('electron context switching', function(this: common.ISuite) {
  before(common.before(this))
  after(
    common.after(this, () => {
      console.log(`switching back to initial context ${initialContext}`)
      execSync(`kubectl config use-context ${initialContext}`)
      console.log(`switched to ${execSync('kubectl config current-context')}`)
    })
  )

  synonyms.forEach(kubectl => {
    /** delete the given namespace */
    const deleteIt = (name: string, errOk = false) => {
      it(`should delete the namespace ${name} via ${kubectl}`, () => {
        return cli
          .do(`${kubectl} delete namespace ${name}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name), errOk }))
          .then(selector => waitForRed(this.app, selector))
          .then(() => waitTillNone('namespace', undefined, name))
          .catch(err => {
            if (!errOk) {
              return common.oops(this)(err)
            }
          })
      })
    }

    /** create the given namespace */
    const createIt = (name: string) => {
      it(`should create namespace ${name} via ${kubectl}`, () => {
        return cli
          .do(`${kubectl} create namespace ${name}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })
    }

    /** create a pod in the given namespace */
    const createPod = (ns: string) => {
      it(`should create sample pod in namespace ${ns} from URL via ${kubectl}`, () => {
        return cli
          .do(
            `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`,
            this.app
          )
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })

      it(`should show the sample pod in namespace ${ns} in sidecar via ${kubectl}`, () => {
        return cli
          .do(`${kubectl} get pod nginx -n ${ns} -o yaml`, this.app)
          .then(cli.expectJustOK)
          .then(sidecar.expectOpen)
          .then(sidecar.expectShowing('nginx', undefined, undefined, ns))
          .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('status')))
          .then(() => `${selectors.SIDECAR} .result-table .entity[data-name="nginx"]`)
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
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
          return common.oops(this)(err)
        }
      })
    }

    /** list contexts and expect the current context */
    const listContextsAndExpectDefault = () => {
      it('should list contexts and show the default context', async () => {
        try {
          const currentContext = await cli
            .do(`context`, this.app)
            .then(cli.expectOKWithCustom({ selector: ' ' }))
            .then(selector => this.app.client.getText(selector))

          const currentContextAsIndicatedByContextsTable = await cli
            .do(`contexts`, this.app)
            .then(
              cli.expectOKWithCustom({
                selector: `.selected-row .entity-name[data-key="NAME"]`
              })
            )
            .then(selector => this.app.client.getText(selector))

          assert.strictEqual(currentContextAsIndicatedByContextsTable, currentContext)
        } catch (err) {
          return common.oops(this)(err)
        }
      })
    }

    /** list contexts and expect the given context */
    const listContextsAndExpectGiven = (contextName: string) => {
      it(`should list contexts and show the context ${contextName}`, async () => {
        try {
          const allContextNames = await cli
            .do(`contexts`, this.app)
            .then(cli.expectOKWithCustom({ selector: ' ' }))
            .then(selector => this.app.client.elements(`${selector} .entity-name[data-key="NAME"]`))
            .then(elements => elements.value.map(_ => _.ELEMENT))
            .then(elements => Promise.all(elements.map(element => this.app.client.elementIdText(element))))
            .then(texts => texts.map(_ => _.value))

          assert.ok(allContextNames.find(_ => _ === contextName))
        } catch (err) {
          return common.oops(this)(err)
        }
      })
    }

    /** list pods and expect an empty list */
    const listPodsAndExpectNone = (ns: string) => {
      it('should list pods and show nothing', () => {
        return cli.do(`${kubectl} get pods -n ${ns}`, this.app).then(cli.expectError(404))
      })
    }

    /** list pods and expect one entry */
    const listPodsAndExpectOne = (name: string, ns?: string) => {
      it(`should list pods and show ${name} maybe in namespace ${ns || 'nope'}`, () => {
        return cli
          .do(`${kubectl} get pods ${ns ? '-n ' + ns : ''}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })
    }

    /* switch to the given context */
    const switchToContext = (contextName: string) => {
      it(`should switch to the context ${contextName}`, async () => {
        try {
          const selector = await cli.do(`contexts`, this.app).then(
            cli.expectOKWithCustom({
              selector: selectors.BY_NAME(contextName)
            })
          )

          await this.app.client.click(`${selector} .entity-name.clickable`)

          // the row in that first table had better now be selected
          await this.app.client.waitForExist(`${selector} .selected-row`)

          // and if we request a new contexts table, it'd better be selected there, too
          const selector2 = await cli.do(`contexts`, this.app).then(
            cli.expectOKWithCustom({
              selector: selectors.BY_NAME(contextName)
            })
          )
          await this.app.client.waitForExist(`${selector2} .selected-row`)
        } catch (err) {
          return common.oops(this)(err)
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
