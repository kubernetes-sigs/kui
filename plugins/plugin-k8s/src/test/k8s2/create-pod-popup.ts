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
import { waitForGreen, waitForRed, createNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const ns1: string = createNS()
const ns2: string = createNS()

const kubectl = 'kubectl'

/** wait for a deletion to complete */
const waitForDelete = function(this: common.ISuite, { name }: { name: string }) {
  it(`should wait for deletion of resource named ${name}`, async () => {
    try {
      await waitForRed(this.app, selectors.BY_NAME(name))
    } catch (err) {
      return common.oops(this)(err)
    }
  })
}

/** verify that the monaco editor component contains the given substring */
const verifyTextExists = async function(this: common.ISuite, expectedSubstring: string) {
  await this.app.client.waitUntil(async () => {
    const actualText = await this.app.client.getText(`${selectors.SIDECAR} .monaco-editor .view-lines`)
    return actualText.indexOf(expectedSubstring) >= 0
  })
}

/** wait for the creation to finish, then navigate a bit */
interface CreateSpec {
  name: string
  kind: string
  ns?: string
  status: string
}

const waitForCreate = function(this: common.ISuite, spec: CreateSpec) {
  const { name, kind, ns } = spec

  it(`should wait for creation of resource named ${name} in namespace ${ns}`, async () => {
    const textExists = verifyTextExists.bind(this)
    const waitForIcon = async () => {
      await this.app.client.waitUntil(async () => {
        const iconText = await this.app.client.getText(`${selectors.SIDECAR} .sidecar-header-icon`)
        return new RegExp(kind, 'i').test(iconText)
      })
    }

    const waitForDescribeContent = async () => {
      await waitForIcon()

      const textExists = async (key: string, value: string) => {
        return this.app.client.waitUntil(async () => {
          const actualText = await this.app.client.getText(`${selectors.SIDECAR} .monaco-editor .view-lines`)
          return new RegExp(`${key.toUpperCase()}:\\s+${value}`).test(actualText)
        })
      }

      return Promise.all([textExists('Name', name), textExists('Status', spec.status)])
    }

    const waitForRawContent = async () => {
      await waitForIcon()
      await textExists(`apiVersion: v1`)
      await textExists(`kind: ${kind}`)
    }

    try {
      // first wait for the table entry to turn green
      await waitForGreen(this.app, selectors.BY_NAME(name))

      // then click on the table row and switch back and forth between
      // raw and summary modes, each time ensuring that the editor
      // shows the expected content await this.app.client.click(`${selectors.BY_NAME(name)} .clickable`)
      await this.app.client.click(`${selectors.BY_NAME(name)} .clickable`)
      await waitForDescribeContent()
      await this.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON('raw'))
      await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('raw'))
      await waitForRawContent()
      await this.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON('summary'))
      await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('summary'))
      await waitForDescribeContent()
      await this.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON('raw'))
      await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('raw'))
    } catch (err) {
      return common.oops(this, true)(err)
    }
  })
}

/** resource names */
const pod = 'nginx'

//
// from here on are the tests...
//
common.localDescribe(`popup create pod creating namespace ${ns1}`, function(this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'create', 'ns', ns1] }))
  after(common.after(this))

  waitForCreate.bind(this)({ name: ns1, kind: 'Namespace', status: 'Active' })
})

common.localDescribe(`popup create pod creating pod in ${ns1}`, function(this: common.ISuite) {
  before(
    common.before(this, {
      popup: [
        kubectl,
        'create',
        '-f',
        'https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod',
        '-n',
        ns1
      ]
    })
  )
  after(common.after(this))

  waitForCreate.bind(this)({ name: pod, kind: 'Pod', ns: ns1, status: 'Running' })
})

common.localDescribe(`popup create pod creating namespace ${ns2}`, function(this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'create', 'ns', ns2] }))
  after(common.after(this))

  waitForCreate.bind(this)({ name: ns2, kind: 'Namespace', status: 'Active' })
})

common.localDescribe(`popup create pod creating pod in ${ns2}`, function(this: common.ISuite) {
  before(
    common.before(this, {
      popup: [
        kubectl,
        'create',
        '-f',
        'https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod',
        '-n',
        ns2
      ]
    })
  )
  after(common.after(this))

  waitForCreate.bind(this)({ name: pod, kind: 'Pod', ns: ns2, status: 'Running' })
})

common.localDescribe(`popup create pod deleting pod in ${ns1}`, function(this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'delete', 'pod', pod, '-n', ns1] }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: pod })
})

common.localDescribe(`popup create pod deleting pod in ${ns2}`, function(this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'delete', 'pod', pod, '-n', ns2] }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: pod })
})

common.localDescribe(`popup create pod deleting namespace ${ns1}`, function(this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'delete', 'ns', ns1] }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: ns1 })
})

common.localDescribe(`popup create pod deleting namespace ${ns2}`, function(this: common.ISuite) {
  before(common.before(this, { popup: [kubectl, 'delete', 'ns', ns2] }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: ns2 })
})
