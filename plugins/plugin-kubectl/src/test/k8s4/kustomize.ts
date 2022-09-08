/*
 * Copyright 2020 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import {
  doHelp,
  waitForGreen,
  waitForRed,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { basename, dirname, join } from 'path'
const BASE = join(dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json')), 'data/k8s/kustomize/base')

const commands = ['kubectl']
const dashKs = ['-k', '--kustomize']

commands.forEach(command => {
  describe(`${command} apply kustomize ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    it(`should present an error for just "${command} kustomize"`, () =>
      CLI.command(`${command} kustomize`, this.app)
        .then(ReplExpect.error(500, 'unable to find one of'))
        .catch(Common.oops(this, true)))

    const kustomize = doHelp.bind(this)
    kustomize(
      `${command} kustomize "${BASE}"`,
      ['kustomize', basename(BASE)],
      ['ConfigMap', 'Service', 'Deployment.v1.apps', 'Raw Data']
    )

    dashKs.forEach(dashK => {
      const ns: string = createNS()
      const inNamespace = `-n ${ns}`

      allocateNS(this, ns, command)

      const doExpecting = (verb: 'apply' | 'delete', status: 'green' | 'red', expecting: string) => {
        it(`should create deployment from local kustomize directory via ${command} ${verb} ${dashK} expecting ${expecting}`, () => {
          return CLI.command(`${command} ${verb} ${dashK} "${BASE}" ${inNamespace}`, this.app)
            .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(expecting) }))
            .then(selector => (status === 'green' ? waitForGreen(this.app, selector) : waitForRed(this.app, selector)))
            .catch(Common.oops(this))
        })
      }
      const applyExpecting = doExpecting.bind(this, 'apply', 'green')
      const deleteExpecting = doExpecting.bind(this, 'delete', 'red')

      applyExpecting('the-deployment')
      applyExpecting('the-service')
      applyExpecting('the-map')
      deleteExpecting('the-deployment')

      deleteNS(this, ns, command)
    })
  })
})
