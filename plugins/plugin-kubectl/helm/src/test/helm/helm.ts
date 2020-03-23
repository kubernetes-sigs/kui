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
import { doHelp, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

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

  const help = doHelp.bind(this)
  help('helm get -h', ['helm', 'get'], ['Introduction', 'Flags', 'Global Flags', 'Available'])

  it('should show 500 error for helm create', () => {
    return CLI.command('helm create', this.app)
      .then(ReplExpect.error(500, 'Error:'))
      .catch(Common.oops(this, true))
  })

  it('should show 500 error for helm install', () => {
    return CLI.command('helm install', this.app)
      .then(ReplExpect.error(500, 'Error:'))
      .catch(Common.oops(this, true))
  })

  it('should show 500 error for helm delete', () => {
    return CLI.command('helm delete', this.app)
      .then(ReplExpect.error(500, 'Error:'))
      .catch(Common.oops(this, true))
  })

  allocateNS(this, ns)

  lists.forEach(list => {
    it(`should list empty releases via helm ${list}`, () => {
      return CLI.command(`helm ${list}`, this.app)
        .then(ReplExpect.blank)
        .catch(Common.oops(this, true))
    })
  })

  const checkHelmInstall = async (res: ReplExpect.AppAndCount) => {
    await ReplExpect.justOK(res)
    await SidecarExpect.open(res.app)
    await SidecarExpect.showingTopNav(name)(res.app)
  }

  it(`should create sample helm chart`, () => {
    return CLI.command(`helm install --name ${name} stable/mysql ${inNamespace}`, this.app)
      .then(checkHelmInstall)
      .catch(Common.oops(this, true))
  })

  it('should refresh as a quick way to close the sidecar', () => Common.refresh(this))

  it(`should show history`, () => {
    return CLI.command(`helm history ${name}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.TABLE_CELL('1', 'REVISION') }))
      .then(Util.expectText(this.app, '1'))
      .catch(Common.oops(this, true))
  })

  // confirm that helm list shows a row for our release
  it(`should list that new release via helm list`, () => {
    return CLI.command(`helm list ${name}`, this.app)
      .then(ReplExpect.okWith(name))
      .catch(Common.oops(this, true))
  })

  // also confirm that there is a REVISION column in that row
  it(`should list that new release via helm list`, () => {
    return CLI.command(`helm list ${name}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.TABLE_CELL(name, 'REVISION') }))
      .then(Util.expectText(this.app, '1'))
      .catch(Common.oops(this, true))
  })

  help(`helm status ${name}`, ['helm', 'release', name], ['Status', 'Summary'])

  it(`should show the release in sidecar via helm get`, () => {
    return CLI.command(`helm get ${name}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showingTopNav(name))
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('hooks')))
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('manifest')))
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('values')))
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('notes')))
      .catch(Common.oops(this, true))
  })

  it(`should delete sample helm chart`, () => {
    return CLI.command(`helm delete --purge ${name}`, this.app)
      .then(ReplExpect.okWithString(`release "${name}" deleted`))
      .catch(Common.oops(this, true))
  })

  it(`should list empty releases via helm list again`, () => {
    return CLI.command(`helm list ${name}`, this.app)
      .then(ReplExpect.blank)
      .catch(Common.oops(this, true))
  })

  deleteNS(this, ns)
})
