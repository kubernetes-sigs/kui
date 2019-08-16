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
import { cli, selectors, sidecar, AppAndCount, expectText } from '@kui-shell/core/tests/lib/ui'
import * as assert from 'assert'

import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const lists = ['list', 'ls']

// TODO: enable this once proxy can find $HOME on travis
common.localDescribe('helm commands', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  const inNamespace = `--namespace ${ns}`
  const name = `test-release-${ns}`

  it('should show 500 error for helm get', () => {
    return cli
      .do('helm get', this.app)
      .then(cli.expectError(500, 'Error: release name is required'))
      .catch(common.oops(this, true))
  })

  it('should show 500 error for helm get -h', () => {
    return cli
      .do('helm get -h', this.app)
      .then(cli.expectError(500))
      .catch(common.oops(this, true))
  })

  it('should show 500 error for helm create', () => {
    return cli
      .do('helm create', this.app)
      .then(cli.expectError(500, 'Error: the name of the new chart is required'))
      .catch(common.oops(this, true))
  })

  it('should show 500 error for helm install', () => {
    return cli
      .do('helm install', this.app)
      .then(cli.expectError(500, 'Error: This command needs 1 argument: chart name'))
      .catch(common.oops(this, true))
  })

  it('should show 500 error for helm delete', () => {
    return cli
      .do('helm delete', this.app)
      .then(cli.expectError(500, "Error: command 'delete' requires a release name"))
      .catch(common.oops(this, true))
  })

  allocateNS(this, ns)

  lists.forEach(list => {
    it(`should list empty releases via helm ${list}`, () => {
      return cli
        .do(`helm ${list} ${inNamespace}`, this.app)
        .then(cli.expectBlank)
        .catch(common.oops(this))
    })
  })

  const checkHelmStatus = async (res: AppAndCount) => {
    await cli.expectOKWithAny(res)

    const table = await this.app.client.getText(`${selectors.OUTPUT_N(res.count)} .result-table-title`)
    assert.strict.equal(table.length, 6)

    const text = await this.app.client.getText(`${selectors.OUTPUT_N(res.count)} .kui--mixed-response--text`)
    assert.ok(Array.isArray(text), 'expect more than one section of text output')
    if (Array.isArray(text)) {
      assert.ok(text.find(x => x && x.includes('NOTES:')), 'expect a NOTES section of streaming output')
      assert.ok(text.find(x => x && x.includes('LAST DEPLOYED:')), 'expect a LAST DEPLOYED section of streaming output')
    }
  }

  it(`should create sample helm chart`, () => {
    return cli
      .do(`helm install --name ${name} stable/mysql ${inNamespace}`, this.app)
      .then(checkHelmStatus)
      .catch(common.oops(this))
  })

  it(`should show history`, () => {
    return cli
      .do(`helm history ${name}`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.TABLE_CELL('1', 'REVISION') }))
      .then(expectText(this.app, '1'))
      .catch(common.oops(this))
  })

  // confirm that helm list shows a row for our release
  it(`should list that new release via helm list`, () => {
    return cli
      .do(`helm list ${inNamespace}`, this.app)
      .then(cli.expectOKWith(name))
      .catch(common.oops(this))
  })

  // also confirm that there is a REVISION column in that row
  it(`should list that new release via helm list`, () => {
    return cli
      .do(`helm list ${inNamespace}`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.TABLE_CELL(name, 'REVISION') }))
      .then(expectText(this.app, '1'))
      .catch(common.oops(this))
  })

  it(`should show the status of that new release`, () => {
    return cli
      .do(`helm status ${name}`, this.app)
      .then(checkHelmStatus)
      .catch(common.oops(this))
  })

  it(`should show the release in sidecar via helm get`, () => {
    return cli
      .do(`helm get ${name}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('mysql', undefined, true)) // true means substring match ok
      .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('status')))
      .then(() => this.app.client.waitForText(`${selectors.SIDECAR_CUSTOM_CONTENT} .result-table-title`))
      .then(() => this.app.client.getText(`${selectors.SIDECAR_CUSTOM_CONTENT} .result-table-title`))
      .then(titles => {
        assert.ok(Array.isArray(titles))
        if (Array.isArray(titles)) {
          // to make typescript happy, we need the if check on top of
          // the assert
          assert.strictEqual(titles.length, 6)
          assert.ok(titles.find(_ => _ === 'V1/PERSISTENTVOLUMECLAIM'))
        }
      })
      .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('hooks')))
      .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('manifest')))
      .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('values')))
      .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('notes')))
      .catch(common.oops(this))
  })

  it(`should delete sample helm chart`, () => {
    return cli
      .do(`helm delete --purge ${name}`, this.app)
      .then(cli.expectOKWithString(`release "${name}" deleted`))
      .catch(common.oops(this))
  })

  it(`should list empty releases via helm list again`, () => {
    return cli
      .do(`helm list ${inNamespace}`, this.app)
      .then(cli.expectBlank)
      .catch(common.oops(this))
  })

  deleteNS(this, ns)
})
