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
import { expectYAMLSubset, cli, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import {
  waitForGreen,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS,
  waitTillNone
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const synonyms = ['kubectl']

describe(`electron configmap ${process.env.MOCHA_RUN_TARGET}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    /** return the editor text */
    const getText = () => {
      return this.app.client
        .execute(() => {
          return document.querySelector('.monaco-editor-wrapper')['editor'].getValue()
        })
        .then(res => res.value)
    }

    /** wait until the sidecar displays a superset of the given content */
    const expectContent = (content: object) => {
      return this.app.client.waitUntil(async () => {
        const ok: boolean = await getText().then(expectYAMLSubset(content, false))

        return ok
      })
    }

    /**
     * List configmaps, click on the given named configmap, and
     * optionally expect the given content to appear in the sidecar
     *
     */
    const listAndClick = (name: string, content?: object) => {
      it(`should list configmaps via ${kubectl} then click on ${name}`, async () => {
        try {
          const selector = await cli
            .do(`${kubectl} get cm ${inNamespace}`, this.app)
            .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))

          // Note: configmaps don't really have a status, so there is nothing to wait for on "get"
          // await waitForGreen(this.app, selector)

          // now click on the table row
          await this.app.client.click(`${selector} .clickable`)
          await sidecar
            .expectOpen(this.app)
            .then(sidecar.expectMode(defaultModeForGet))
            .then(sidecar.expectShowing(name))

          if (content) {
            await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('raw'))
            await expectContent(content)
          }
        } catch (err) {
          return common.oops(this)(err)
        }
      })
    }

    /** delete the given configmap */
    const deleteIt = (name: string, errOk = false) => {
      it(`should delete the configmap ${name} via ${kubectl} `, () => {
        const expectResult = errOk ? cli.expectOKWithAny : cli.expectOKWithString('deleted')

        return cli
          .do(`${kubectl} delete cm ${name} ${inNamespace}`, this.app)
          .then(expectResult)
          .then(() => waitTillNone('configmap', undefined, name, undefined, inNamespace))
          .catch(common.oops(this))
      })
    }

    /** create the given configmap with optional literal parameters */
    const createIt = (name: string, literals = '') => {
      it(`should create a configmap ${name} via ${kubectl}`, () => {
        return cli
          .do(`${kubectl} create configmap ${name} ${literals} ${inNamespace}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })
    }

    //
    // now start the tests
    //
    allocateNS(this, ns)

    createIt('yoyo')
    createIt('momo', '--from-literal hello=world')

    listAndClick('yoyo')
    listAndClick('momo', {
      data: {
        hello: 'world'
      }
    })

    deleteIt('yoyo')
    deleteIt('momo')

    deleteNS(this, ns)
  })
})
