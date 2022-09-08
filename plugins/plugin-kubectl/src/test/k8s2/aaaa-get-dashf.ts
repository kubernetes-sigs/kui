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

import { CLI, ReplExpect, Common, Selectors } from '@kui-shell/test'
import { waitForRed, waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const commands = ['kubectl']

commands.forEach(command => {
  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  describe(`${command} get dashF ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    allocateNS(this, ns)

    const file = `${ROOT}/data/k8s/headless/pod.yaml`
    it('should get an offline table when getting offline file', () => {
      return CLI.command(`${command} get -f ${file} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForRed(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should create sample pod from local file via ${command}`, () => {
      return CLI.command(`${command} create --filename ${file} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should get sample pod from local file via ${command}`, () => {
      return CLI.command(`${command} get --filename ${file} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should watch sample pod from local file and delete it via ${command}`, () => {
      return CLI.command(`${command} get -f ${file} ${inNamespace} -w`, this.app)
        .then(async res => {
          const watchSelector = await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })(res)
          await waitForGreen(this.app, watchSelector)

          await CLI.command(`${command} delete -f ${file} ${inNamespace}`, this.app)
            .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
            .then(selector => waitForRed(this.app, selector))

          await waitForRed(this.app, watchSelector)
        })
        .catch(Common.oops(this, true))
    })

    const dir = `${ROOT}/data/k8s/bunch`
    const firstResource = 'nginx'
    it('should get an offline table when getting offline directory', () => {
      return CLI.command(`${command} get --filename ${dir} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(firstResource) }))
        .then(selector => waitForRed(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should create sample application from local directory via ${command}`, () => {
      return CLI.command(`${command} apply -f ${dir} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(firstResource) }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should get sample application from local directory via ${command}`, () => {
      return CLI.command(`${command} get -f ${dir} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(firstResource) }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    const duplicatedName = 'nginx'
    const duplicatedResource1 = 'deployment'
    const duplicatedResource2 = 'pod'
    let watchSelector: string

    it(`should watch sample application from local directory and delete it via ${command}`, () => {
      return CLI.command(`${command} get -f ${dir} ${inNamespace} -w`, this.app)
        .then(async res => {
          watchSelector = await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(duplicatedName) })(res)
          return watchSelector
        })
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should should delete ${duplicatedName} ${duplicatedResource2} via ${command}`, () => {
      return CLI.command(`${command} delete ${duplicatedResource2} ${duplicatedName} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(duplicatedName) }))
        .then(selector => waitForRed(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should watch ${duplicatedName} deployment still green`, () => {
      return waitForGreen(this.app, watchSelector).catch(Common.oops(this, true))
    })

    it(`should should delete ${duplicatedName} ${duplicatedResource1} via ${command}`, () => {
      return CLI.command(`${command} delete ${duplicatedResource1} ${duplicatedName} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(duplicatedName) }))
        .then(selector => waitForRed(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should watch ${duplicatedName} ${duplicatedResource1} to be red`, () => {
      return waitForRed(this.app, watchSelector).catch(Common.oops(this, true))
    })

    deleteNS(this, ns)
  })
})
