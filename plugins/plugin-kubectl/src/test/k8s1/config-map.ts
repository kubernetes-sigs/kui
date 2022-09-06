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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect, Util } from '@kui-shell/test'
import {
  waitForGreen,
  openSidecarByList,
  createNS,
  allocateNS,
  deleteNS,
  waitTillNone
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']

describe(`kubectl configmap ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const inNamespace = `-n ${ns}`

    /** return the editor text */
    const getText = (res: ReplExpect.AppAndCount) => {
      return Util.getValueFromMonaco(res)
    }

    /** wait until the sidecar displays a superset of the given content */
    const expectContent = (res: ReplExpect.AppAndCount, content: object) => {
      return this.app.client.waitUntil(
        async () => {
          const ok: boolean = await getText(res).then(Util.expectYAMLSubset(content, false))

          return ok
        },
        { timeout: CLI.waitTimeout }
      )
    }

    /**
     * List configmaps, click on the given named configmap, and
     * optionally expect the given content to appear in the sidecar
     *
     */
    const _listAndClick = (name: string, content?: Record<string, any>) => {
      it(`should list configmaps via ${kubectl} then click on ${name}`, async () => {
        try {
          const res = await openSidecarByList(
            this,
            `${kubectl} get cm ${inNamespace}`,
            name,
            false // Note: configmaps don't really have a status, so there is nothing to wait for on "get"
          )

          if (content) {
            if (content.data) {
              await SidecarExpect.yaml(content.data)(res)
            }

            await Util.switchToTab('raw')(res)
            await expectContent(res, content)
          }
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    }

    /** delete the given configmap */
    const deleteIt = (name: string) => {
      it(`should delete the configmap ${name} via ${kubectl} `, () => {
        return CLI.command(`${kubectl} delete cm ${name} ${inNamespace}`, this.app)
          .then(() => waitTillNone('configmap', undefined, name, undefined, inNamespace))
          .catch(Common.oops(this, true))
      })
    }

    /** create the given configmap with optional literal parameters */
    const createIt = (name: string, literals = '') => {
      it(`should create a configmap ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} create configmap ${name} ${literals} ${inNamespace}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })
          )
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    //
    // now start the tests
    //
    allocateNS(this, ns)

    createIt('yoyo')
    createIt('momo', '--from-literal hello=world')

    _listAndClick('yoyo')
    _listAndClick('momo', {
      data: {
        hello: 'world'
      }
    })

    deleteIt('yoyo')
    deleteIt('momo')

    deleteNS(this, ns)
  })
})
