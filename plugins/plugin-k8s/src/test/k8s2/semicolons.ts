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

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import {
  waitForGreen,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const synonyms = ['kubectl']
const dashFs = ['-f']

const echoString = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

describe(`electron kubectl semicolons ${process.env.MOCHA_RUN_TARGET}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    dashFs.forEach(dashF => {
      const ns: string = createNS()
      const inNamespace = `-n ${ns}`

      allocateNS(this, ns)

      it(`should create sample pod from URL via ${kubectl}`, async () => {
        try {
          const selector = await cli
            .do(
              `${kubectl} create ${dashF} https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
              this.app
            )
            .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))

          // wait for the badge to become green
          await waitForGreen(this.app, selector)

          // now click on the table row
          this.app.client.click(`${selector} .clickable`)
          await sidecar
            .expectOpen(this.app)
            .then(sidecar.expectMode(defaultModeForGet))
            .then(sidecar.expectShowing('nginx'))
        } catch (err) {
          common.oops(this)(err)
        }
      })

      it(`should get with semicolon 1`, () => {
        return cli
          .do(`${kubectl} get pods -n ${ns}; echo ${echoString}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })

      it(`should get with semicolon 2`, () => {
        return cli
          .do(`${kubectl} get pods -n ${ns} ; echo ${echoString}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })

      it(`should get with semicolon 3`, () => {
        return cli
          .do(`${kubectl} get pods -n ${ns} ;echo ${echoString};`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })

      it(`should get with semicolon 4`, () => {
        return cli
          .do(`${kubectl} get pods -n ${ns} ;echo ${echoString}; ; ; ;;;`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })

      it(`should get with semicolon 5`, () => {
        return cli
          .do(`${kubectl} get pods -n ${ns} ;echo ${echoString}; ; ; ;;;`, this.app)
          .then(cli.expectOKWithString(echoString))
          .catch(common.oops(this))
      })

      deleteNS(this, ns)
    })
  })
})
