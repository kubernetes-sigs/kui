/*
 * Copyright 2017 IBM Corporation
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

import * as assert from 'assert'
import { dirname } from 'path'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

// const actionName1 = 'foo1'
const actionName2 = 'foo2'

describe('Create zip actions', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const makeActionFromZip = (cmd: string, name: string) => {
    it(cmd, async () => {
      try {
        const res = await CLI.command(cmd, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(name))

        await Util.getValueFromMonaco(res).then(txt => assert.ok(txt.startsWith('/**')))

        await this.app.client.click(`${Selectors.SIDECAR_MODE_BUTTON(res.count, 'raw')}`)

        await Util.getValueFromMonaco(res).then(
          Util.expectYAMLSubset({
            name,
            publish: false,
            annotations: [
              {
                key: 'file',
                value: actual => actual.endsWith('data/openwhisk/zip/sendmail.zip')
              },
              {
                key: 'wskng.combinators',
                value: [
                  {
                    type: 'action.kind',
                    role: 'replacement',
                    badge: 'zip'
                  }
                ]
              },
              {
                key: 'binary',
                value: true
              },
              {
                key: 'exec'
              }
            ],
            exec: {
              code: '…',
              binary: true
            },
            parameters: [],
            limits: {
              concurrency: 1,
              timeout: 60000,
              memory: 256,
              logs: 10
            }
          })
        )
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  // makeActionFromZip(`let ${actionName1} = ${ROOT}/data/openwhisk/zip/sendmail.zip`, actionName1)
  makeActionFromZip(
    `wsk action update ${actionName2} ${ROOT}/data/openwhisk/zip/sendmail.zip --kind nodejs:6`,
    actionName2
  )
})
