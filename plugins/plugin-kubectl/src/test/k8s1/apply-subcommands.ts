/*
 * Copyright 2020 IBM Corporation
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
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { mode as lastAppliedMode } from '../../lib/view/modes/last-applied'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

const podName = 'nginx'
const sourceFile = 'https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod'

commands.forEach(command => {
  describe(`${command} apply view-last-applied ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`

    allocateNS(this, ns, command)

    const doCreate = (verb: 'create' | 'apply') => {
      it(`should ${verb === 'create' ? 'create' : 'update'} sample pod from URL via ${command} ${verb}`, async () => {
        try {
          const selector = await CLI.command(`${command} ${verb} -f ${sourceFile} ${inNamespace}`, this.app).then(
            ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(podName) })
          )

          // wait for the badge to become green
          await waitForGreen(this.app, selector)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    doCreate('create')

    // no last applied configuration, yet
    it(`view last applied configuration and expect 404 via ${command}`, () =>
      CLI.command(`${command} apply view-last-applied pod ${podName} ${inNamespace}`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this, true)))

    // now use apply to get us a last applied configuration
    doCreate('apply')

    // check that we can view this last applied configuration via "apply view-last-applied"
    it(`view last applied configuration via ${command} apply view-last-applied`, () =>
      CLI.command(`${command} apply view-last-applied pod ${podName} ${inNamespace}`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(podName, undefined, undefined, ns))
        .then(SidecarExpect.mode(lastAppliedMode))
        .catch(Common.oops(this, true)))

    deleteNS(this, ns, command)
  })
})
