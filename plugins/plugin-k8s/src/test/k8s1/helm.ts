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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import * as assert from 'assert'

import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const lists = ['list', 'ls']

// TODO: enable this once proxy can find $HOME on travis
describe(`helm commands ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `--namespace ${ns}`
  const name = `test-release-${ns}`

  it('should show 500 error for helm help --tls', () => {
    return CLI.command('helm help --tls', this.app)
      .then(ReplExpect.error(500, 'Error: unknown flag: --tls'))
      .catch(Common.oops(this, true))
  })

  it('should show 500 error for helm get', () => {
    return CLI.command('helm get', this.app)
      .then(ReplExpect.error(500, 'Error: release name is required'))
      .catch(Common.oops(this, true))
  })

  it('should show 500 error for helm get -h', () => {
    return CLI.command('helm get -h', this.app)
      .then(ReplExpect.error(500))
      .catch(Common.oops(this, true))
  })

  it('should show 500 error for helm create', () => {
    return CLI.command('helm create', this.app)
      .then(ReplExpect.error(500, 'Error: the name of the new chart is required'))
      .catch(Common.oops(this, true))
  })

  it('should show 500 error for helm install', () => {
    return CLI.command('helm install', this.app)
      .then(ReplExpect.error(500, 'Error: This command needs 1 argument: chart name'))
      .catch(Common.oops(this, true))
  })

  it('should show 500 error for helm delete', () => {
    return CLI.command('helm delete', this.app)
      .then(ReplExpect.error(500, "Error: command 'delete' requires a release name"))
      .catch(Common.oops(this, true))
  })

  allocateNS(this, ns)

  lists.forEach(list => {
    it(`should list empty releases via helm ${list}`, () => {
      return CLI.command(`helm ${list} ${inNamespace}`, this.app)
        .then(ReplExpect.blank)
        .catch(Common.oops(this))
    })
  })

  const checkHelmStatus = async (res: ReplExpect.AppAndCount) => {
    await ReplExpect.okWithAny(res)

    const table = await this.app.client.getText(`${Selectors.OUTPUT_N(res.count)} .result-table-title`)
    assert.strict.equal(table.length, 6)

    const text = await this.app.client.getText(`${Selectors.OUTPUT_N(res.count)} .kui--mixed-response--text`)
    assert.ok(Array.isArray(text), 'expect more than one section of text output')
    if (Array.isArray(text)) {
      assert.ok(text.find(x => x && x.includes('NOTES:')), 'expect a NOTES section of streaming output')
      assert.ok(text.find(x => x && x.includes('LAST DEPLOYED:')), 'expect a LAST DEPLOYED section of streaming output')
    }
  }

  it(`should create sample helm chart`, () => {
    return CLI.command(`helm install --name ${name} stable/mysql ${inNamespace}`, this.app)
      .then(checkHelmStatus)
      .catch(Common.oops(this))
  })

  it(`should show history`, () => {
    return CLI.command(`helm history ${name}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.TABLE_CELL('1', 'REVISION') }))
      .then(Util.expectText(this.app, '1'))
      .catch(Common.oops(this))
  })

  // confirm that helm list shows a row for our release
  it(`should list that new release via helm list`, () => {
    return CLI.command(`helm list ${inNamespace}`, this.app)
      .then(ReplExpect.okWith(name))
      .catch(Common.oops(this))
  })

  // also confirm that there is a REVISION column in that row
  it(`should list that new release via helm list`, () => {
    return CLI.command(`helm list ${inNamespace}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.TABLE_CELL(name, 'REVISION') }))
      .then(Util.expectText(this.app, '1'))
      .catch(Common.oops(this))
  })

  it(`should show the status of that new release`, () => {
    return CLI.command(`helm status ${name}`, this.app)
      .then(checkHelmStatus)
      .catch(Common.oops(this))
  })

  it(`should show the release in sidecar via helm get`, () => {
    return CLI.command(`helm get ${name}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('mysql', undefined, true)) // true means substring match ok
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('status')))
      .then(() => this.app.client.waitForText(`${Selectors.SIDECAR_CUSTOM_CONTENT} .result-table-title`))
      .then(() => this.app.client.getText(`${Selectors.SIDECAR_CUSTOM_CONTENT} .result-table-title`))
      .then(titles => {
        assert.ok(Array.isArray(titles))
        if (Array.isArray(titles)) {
          // to make typescript happy, we need the if check on top of
          // the assert
          assert.strictEqual(titles.length, 6)
          assert.ok(titles.find(_ => _ === 'V1/PERSISTENTVOLUMECLAIM'))
        }
      })
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('hooks')))
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('manifest')))
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('values')))
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('notes')))
      .catch(Common.oops(this))
  })

  it(`should delete sample helm chart`, () => {
    return CLI.command(`helm delete --purge ${name}`, this.app)
      .then(ReplExpect.okWithString(`release "${name}" deleted`))
      .catch(Common.oops(this))
  })

  it(`should list empty releases via helm list again`, () => {
    return CLI.command(`helm list ${inNamespace}`, this.app)
      .then(ReplExpect.blank)
      .catch(Common.oops(this))
  })

  deleteNS(this, ns)
})
