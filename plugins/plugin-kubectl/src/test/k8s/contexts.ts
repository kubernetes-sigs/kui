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
import { waitForGreen, createNS, defaultModeForGet } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

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
    const deleteIt = (name: string, context: string, kubeconfig: string) => {
      it(`should delete the namespace ${name} via ${kubectl}`, () => {
        execSync(`kubectl delete namespace ${name} --context ${context} --kubeconfig ${kubeconfig}`)
      })
    }

    /** create the given namespace */
    const createIt = (name: string) => {
      it(`should create namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} create namespace ${name}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })
          )
          .then(selector => waitForGreen(this.app, selector))
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
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
          )
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })

      it(`should show the sample pod in namespace ${ns} in sidecar via ${kubectl}, then close the sidecar`, () => {
        return CLI.command(`${kubectl} get pod nginx -n ${ns} -o yaml`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
          .catch(Common.oops(this, true))
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

          kconfig['contexts'][0].context.namespace = ns
          kconfig['contexts'][0].name = contextName
          writeFileSync(newOnesFilepath, safeDump(kconfig))

          await this.app.client.execute(
            (defaultFilepath: string, newOnesFilepath: string) => {
              process.env.KUBECONFIG = `${process.env.KUBECONFIG || defaultFilepath}:${newOnesFilepath}`
            },
            defaultFilepath,
            newOnesFilepath
          )
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    }

    /** list contexts and expect the current context */
    const listContextsAndExpectDefault = () => {
      it('should list contexts and show the default context', async () => {
        try {
          const currentContext = await CLI.command(`context`, this.app)
            .then(
              ReplExpect.okWithCustom<string>({ selector: ' ' })
            )
            .then(selector => this.app.client.$(selector))
            .then(_ => _.getText())

          const currentContextAsIndicatedByContextsTable = await CLI.command(`contexts -o wide`, this.app)
            .then(
              ReplExpect.okWithCustom<string>({
                selector: `${Selectors.TABLE_CELL('*', 'NAME')}`
              })
            )
            .then(selector => this.app.client.$(selector))
            .then(_ => _.getText())

          assert.strictEqual(currentContextAsIndicatedByContextsTable, currentContext)
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    }

    /** list contexts and expect the given context */
    const listContextsAndExpectGiven = (contextName: string) => {
      it(`should list contexts and show the context ${contextName}`, async () => {
        try {
          const allContextNames = await CLI.command(`contexts -o wide`, this.app)
            .then(async res => {
              const nameCellSelector = Selectors.BY_KEY('NAME')
              const selector = await ReplExpect.okWithCustom<string>({ selector: nameCellSelector })(res)
              return this.app.client.$$(selector)
            })
            .then(elements => Promise.all(elements.map(_ => _.getText())))

          assert.ok(allContextNames.find(_ => _ === contextName))
        } catch (err) {
          return Common.oops(this, true)(err)
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
    const listPodsAndExpectOne = (name: string, ns?: string, kubeconfig = '') => {
      it(`should list pods and show ${name} maybe in namespace ${ns || 'nope'} and kubeconfig ${kubeconfig ||
        'nope'}`, () => {
        return CLI.command(`${kubectl} get pods ${ns ? '-n ' + ns : ''} ${kubeconfig}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })
          )
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    const getPodInSidecar = (name: string, ns?: string, kubeconfig = '') => {
      it(`should open pod ${name} in sidecar, and maybe in namespace ${ns || 'nope'} and kubeconfig ${kubeconfig ||
        'nope'}`, () => {
        return CLI.command(`${kubectl} get pod ${name} ${ns ? '-n ' + ns : ''} ${kubeconfig} -o yaml`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.mode(defaultModeForGet))
          .then(SidecarExpect.yaml({ Name: 'nginx' }))
          .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
          .catch(Common.oops(this, true))
      })
    }

    /* switch to the given context */
    const switchToContextByCommand = (contextName: string) => {
      it(`should switch to the context ${contextName} by command`, async () => {
        try {
          await CLI.command(`${kubectl} config use-context ${contextName}`, this.app).then(ReplExpect.ok)

          // and if we request a new contexts table, it'd better be selected there, too
          const currentContext = await CLI.command(`contexts -o wide`, this.app)
            .then(
              ReplExpect.okWithCustom<string>({
                selector: `${Selectors.TABLE_CELL('*', 'NAME')}`
              })
            )
            .then(selector => this.app.client.$(selector))
            .then(_ => _.getText())

          assert.strictEqual(contextName, currentContext)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    //
    // now start the tests
    //
    const ns: string = createNS()
    const initialKubeConfig = getKUBECONFIGFilepath()
    listContextsAndExpectDefault()
    createIt(ns)
    addNamespaceToKUBECONFIG(ns, 'holla') // add holla to the KUBECONFIG contexts
    listContextsAndExpectGiven('holla')
    listPodsAndExpectNone(ns)
    createPod(ns) // create a pod in holla
    listPodsAndExpectOne('nginx', ns)
    listPodsAndExpectOne('nginx', ns, `--kubeconfig ${initialKubeConfig}`)
    getPodInSidecar('nginx', ns, `--kubeconfig ${initialKubeConfig}`)
    switchToContextByCommand('holla')
    listPodsAndExpectOne('nginx')
    deleteIt(ns, initialContext, initialKubeConfig)
  })
})
