/*
 * Copyright 2018 IBM Corporation
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

/**
 * tests wsk package bind
 *
 */

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const pckage = 'package'
const package2 = 'package2'
const action = 'action'

describe('wsk package list tests', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it(`should create ${action} in ${pckage}`, () =>
    CLI.command(`let ${pckage}/${action} = x=>x`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(action, undefined, undefined, pckage))
      .catch(Common.oops(this)))

  it(`should list ${pckage} with wsk package list`, () =>
    CLI.command(`wsk package list`, this.app)
      .then(ReplExpect.okWithOnly(pckage))
      .catch(Common.oops(this)))

  it(`should create ${pckage} with wsk package create`, () =>
    CLI.command(`wsk package create ${package2}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(package2))
      .catch(Common.oops(this)))

  it(`should list ${pckage} with wsk package list then click`, async () => {
    try {
      const selector = await CLI.command(`wsk package list`, this.app).then(
        ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(pckage) })
      )

      await this.app.client.click(`${selector} .clickable`)
      await SidecarExpect.open(this.app).then(SidecarExpect.showing(pckage))

      await this.app.client.click(`${Selectors.SIDECAR} .package-action-list .entity[data-name="${action}"] .clickable`)

      await SidecarExpect.open(this.app).then(SidecarExpect.showing(action, undefined, undefined, pckage))
    } catch (err) {
      return Common.oops(this)(err)
    }
  })

  it(`should list ${pckage} with wsk package list`, () =>
    CLI.command(`wsk package list`, this.app)
      .then(ReplExpect.okWith(pckage))
      .catch(Common.oops(this)))

  it(`should list ${package2} with package list`, () =>
    CLI.command(`wsk package list`, this.app)
      .then(ReplExpect.okWith(package2))
      .catch(Common.oops(this)))

  it(`should list ${package2} with package list`, () =>
    CLI.command(`wsk package list`, this.app)
      .then(ReplExpect.okWith(package2))
      .catch(Common.oops(this)))

  it(`should list ${pckage} with package list /${openwhisk.expectedNamespace()}`, () =>
    CLI.command(`wsk package list /${openwhisk.expectedNamespace()}`, this.app)
      .then(ReplExpect.okWith(package2))
      .catch(Common.oops(this)))

  it(`should list ${package2} with package list /${openwhisk.expectedNamespace()}`, () =>
    CLI.command(`wsk package list /${openwhisk.expectedNamespace()}`, this.app)
      .then(ReplExpect.okWith(package2))
      .catch(Common.oops(this)))

  it(`should list actions in ${pckage} with wsk action list ${pckage}`, () =>
    CLI.command(`wsk action list ${pckage}`, this.app)
      .then(ReplExpect.okWith(action))
      .catch(Common.oops(this)))

  it(`should list actions in ${pckage} with wsk action list ${pckage}`, () =>
    CLI.command(`wsk action list ${pckage}`, this.app)
      .then(ReplExpect.okWith(action))
      .catch(Common.oops(this)))

  it(`should list actions in ${pckage} with action list ${pckage}`, () =>
    CLI.command(`wsk action list ${pckage}`, this.app)
      .then(ReplExpect.okWith(action))
      .catch(Common.oops(this)))
})
