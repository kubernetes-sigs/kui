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

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { dump, load as parseYAML } from 'js-yaml'
import * as path from 'path'
import * as assert from 'assert'

import { expandHomeDir } from '@kui-shell/core'
import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import { remotePodYaml, waitForGreen, createNS, defaultModeForGet } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']

const initialContext = execSync('kubectl config current-context')
  .toString()
  .trim()

enum Status {
  Offline = 'red-background',
  Online = 'green-background'
}

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
        return CLI.command(`${kubectl} create -f ${remotePodYaml} -n ${ns}`, this.app)
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
          console.log('temporary kubeconfig', newOnesFilepath)

          // smash in our namespace and contextName
          const currentContext = kconfig['contexts'].find(_ => _.name === kconfig['current-context'])
          currentContext.context.namespace = ns
          currentContext.name = contextName
          writeFileSync(newOnesFilepath, dump(kconfig))

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
          .then(SidecarExpect.descriptionList({ Status: 'Running' }))
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

    const showCurrentNamespace = (ns: string) => {
      it(`should show ${ns} as current namespace`, () => {
        return CLI.command(`namespace current`, this.app)
          .then(ReplExpect.okWithString(ns))
          .catch(Common.oops(this, true))
      })
    }

    const createNewTab = () => {
      it('should create a new tab via command', () =>
        CLI.command('tab new', this.app)
          .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(2)))
          .then(_ => _.waitForDisplayed())
          .then(() => CLI.waitForSession(this)) // should have an active repl
          .catch(Common.oops(this, true)))
    }

    const switchToTab1 = () => {
      it(`switch back to first tab via command`, () =>
        CLI.command('tab switch 1', this.app)
          .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(1)))
          .then(_ => _.waitForDisplayed())
          .catch(Common.oops(this, true)))
    }

    const switchToTab2 = () => {
      it(`switch back to the second tab tab via command`, () =>
        CLI.command('tab switch 2', this.app)
          .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(2)))
          .then(_ => _.waitForDisplayed())
          .catch(Common.oops(this, true)))
    }

    const switchNamespaceViaCommand = (ns: string) => {
      it(`should switch to the namespace ${ns} by command`, async () => {
        try {
          await CLI.command(`${kubectl} config set-context --current --namespace=${ns}`, this.app).then(ReplExpect.ok)
          await CLI.command(`namespace current`, this.app).then(ReplExpect.okWithString(ns))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const showCurrentNamespaceViaWidget = (ns: string) => {
      it(`should show namespace ${ns} in status strip widget`, async () => {
        try {
          await this.app.client.waitUntil(
            async () => {
              const namespaceText = await this.app.client
                .$(Selectors.STATUS_STRIPE_WIDGET('kui--plugin-kubeui--current-namespace'))
                .then(_ => _.getText())

              return namespaceText === ns
            },
            { timeout: CLI.waitTimeout }
          )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    //
    // now start the tests
    //
    Util.closeAllExceptFirstTab.bind(this)()
    const ns: string = createNS()
    const ns2: string = createNS()
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

    // now start tab-state tests
    switchToContextByCommand(initialContext)
    createIt(ns2)
    switchNamespaceViaCommand(ns2)
    listPodsAndExpectNone(ns2)
    let ns2WatcherBadgeInTab1: string
    it(`should watch namespace in tab 1 and expect ${ns2} online`, () =>
      CLI.command(`${kubectl} get ns -w`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(ns2) })
        )
        .then(selector => waitForGreen(this.app, selector))
        .then(selector => {
          ns2WatcherBadgeInTab1 = selector
        })
        .catch(Common.oops(this, true)))
    createNewTab()
    switchToContextByCommand('holla')
    showCurrentNamespace(ns)
    showCurrentNamespaceViaWidget(ns)
    listPodsAndExpectOne('nginx')
    let nsWatcherBadgeInTab2: string
    it(`should watch namespace in tab 2 and expect ${ns} online`, () =>
      CLI.command(`${kubectl} get ns -w`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(ns) })
        )
        .then(selector => waitForGreen(this.app, selector))
        .then(selector => {
          nsWatcherBadgeInTab2 = selector
        })
        .catch(Common.oops(this, true)))
    switchToTab1()
    listContextsAndExpectDefault()
    showCurrentNamespace(ns2)
    showCurrentNamespaceViaWidget(ns2)
    listPodsAndExpectNone(ns2)
    switchToTab2()
    showCurrentNamespace(ns)
    showCurrentNamespaceViaWidget(ns)
    listPodsAndExpectOne('nginx')

    deleteIt(ns, initialContext, initialKubeConfig)
    it(`should expect ${ns} to be offline in tab  2`, async () => {
      try {
        const offlineBadge = nsWatcherBadgeInTab2.replace(Status.Online, Status.Offline)
        await this.app.client.$(offlineBadge).then(_ => _.waitForExist())
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
    switchToTab1()
    deleteIt(ns2, initialContext, initialKubeConfig)
    it(`should expect ${ns2} to be offline in tab 1`, async () => {
      try {
        const offlineBadge = ns2WatcherBadgeInTab1.replace(Status.Online, Status.Offline)
        await this.app.client.$(offlineBadge).then(_ => _.waitForExist())
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  })
})
