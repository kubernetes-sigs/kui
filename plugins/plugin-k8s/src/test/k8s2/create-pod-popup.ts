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
import { selectors } from '@kui-shell/core/tests/lib/ui'
import { createNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const ns1: string = createNS()
const ns2: string = createNS()

const kubectl = 'kubectl'

/** wait for a deletion to complete */
const waitForDelete = function (this: common.ISuite, { name, noExistOk = false }) {
  it(`should wait for deletion of resource named ${name}`, async () => {
    try {
      if (noExistOk) {
        await this.app.client.waitUntil(async () => {
          try {
            const elt = await this.app.client.element('.repl-result .oops[data-status-code="404"]')
            if (elt.state === 'failure') {
              throw new Error('NoSuchElement')
            } else {
              return true
            }
          } catch (err) {
            try {
              const elt = await this.app.client.element(`${selectors.BY_NAME(name)} badge.red-background`)
              if (elt.state === 'failure') {
                throw new Error('NoSuchElement')
              } else {
                return true
              }
            } catch (err) {
              return false
            }
          }
        })
      } else {
        await this.app.client.waitForExist(`${selectors.BY_NAME(name)} badge.red-background`)
      }
    } catch (err) {
      common.oops(this)(err)
    }
  })
}

/** verify that the monaco editor component contains the given substring */
const verifyTextExists = function (this: common.ISuite, expectedSubstring: string) {
  return this.app.client.waitUntil(async () => {
    const actualText = await this.app.client.getText(`${selectors.SIDECAR} .monaco-editor .view-lines`)
    return actualText.indexOf(expectedSubstring) >= 0
  })
}

/** wait for the creation to finish, then navigate a bit */
interface ICreateSpec {
  name: string
  kind: string
  ns?: string
}

const waitForCreate = function (this: common.ISuite, spec: ICreateSpec) {
  const { name, kind, ns } = spec

  it(`should wait for creation of resource named ${name} in namespace ${ns}`, async () => {
    const textExists = verifyTextExists.bind(this)
    const waitForIcon = () => {
      return this.app.client.waitUntil(async () => {
        const iconText = await this.app.client.getText(`${selectors.SIDECAR} .sidecar-header-icon`)
        return new RegExp(kind, 'i').test(iconText)
      })
    }

    const waitForDescribeContent = async () => {
      await waitForIcon()
      await textExists(`Name: ${name}`)

      if (!/namespace/i.test(kind)) {
        await textExists(`Namespace: ${ns}`)
      } else {
        await textExists('Status: Active')
      }
    }

    const waitForRawContent = async () => {
      await waitForIcon()
      await textExists(`apiVersion: v1`)
      await textExists(`kind: ${kind}`)
    }

    try {
      /** see NOTE just below; we use the STATUS mode as the "clear the editor" intermission */
      const intermission = async () => {
        await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('status'))
        await this.app.client.waitForExist(`${selectors.SIDECAR} ${selectors.BY_NAME(name)} badge.green-background`)
      }

      // first wait for the table entry to turn green
      await this.app.client.waitForExist(`${selectors.BY_NAME(name)} badge.green-background`)

      // then click on the table row and switch back and forth between
      // raw and summary modes, each time ensuring that the editor
      // shows the expected content await this.app.client.click(`${selectors.BY_NAME(name)} .clickable`)
      //
      // NOTE: we use intermission() to clear out the editor, so the
      // waitFor...Content is checking the *new* content
      //
      await this.app.client.click(`${selectors.BY_NAME(name)} .clickable`)
      await waitForDescribeContent()
      await intermission()
      await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('raw'))
      await waitForRawContent()
      await intermission()
      await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('summary'))
      await waitForDescribeContent()
      await intermission()
      await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('raw'))
      await waitForRawContent()
    } catch (err) {
      common.oops(this)(err)
    }
  })
}

/** resource names */
const pod = 'nginx'

//
// from here on are the tests...
//
describe(`popup create namespace ${ns1}`, function (this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'create', 'ns', ns1] }))
  after(common.after(this))

  waitForCreate.bind(this)({ name: ns1, kind: 'Namespace' })
})

describe(`popup create pod in ${ns1}`, function (this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'create', '-f', 'https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod', '-n', ns1] }))
  after(common.after(this))

  waitForCreate.bind(this)({ name: pod, kind: 'Pod', ns: ns1 })
})

describe(`popup create namespace ${ns2}`, function (this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'create', 'ns', ns2] }))
  after(common.after(this))

  waitForCreate.bind(this)({ name: ns2, kind: 'Namespace' })
})

describe(`popup create pod in ${ns2}`, function (this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'create', '-f', 'https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod', '-n', ns2] }))
  after(common.after(this))

  waitForCreate.bind(this)({ name: pod, kind: 'Pod', ns: ns2 })
})

describe('popup delete pod', function (this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'delete', 'pod', pod, '-n', ns1] }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: pod, ns: ns1 })
})

describe(`popup delete pod in ${ns2}`, function (this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'delete', 'pod', pod, '-n', ns2] }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: pod, ns: ns2 })
})

describe(`popup delete namespace ${ns1}`, function (this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'delete', 'ns', ns1] }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: ns1, ns: ns1 })
})

describe(`popup delete namespace ${ns2}`, function (this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'delete', 'ns', ns2] }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: ns2, ns: ns2 })
})
