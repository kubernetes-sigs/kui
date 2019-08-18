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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui

const pckage = 'package'
const package2 = 'package2'
const action = 'action'

describe('wsk package list tests', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it(`should create ${action} in ${pckage}`, () =>
    cli
      .do(`let ${pckage}/${action} = x=>x`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(action, undefined, undefined, pckage))
      .catch(common.oops(this)))

  it(`should list ${pckage} with wsk package list`, () =>
    cli
      .do(`wsk package list`, this.app)
      .then(cli.expectOKWithOnly(pckage))
      .catch(common.oops(this)))

  it(`should create ${pckage} with wsk package create`, () =>
    cli
      .do(`wsk package create ${package2}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(package2))
      .catch(common.oops(this)))

  it(`should list ${pckage} with kui package list`, async () => {
    try {
      const selector = await cli
        .do(`kui package list`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(pckage) }))

      await this.app.client.click(`${selector} .clickable`)
      await sidecar.expectOpen(this.app).then(sidecar.expectShowing(pckage))

      await this.app.client.click(`${selectors.SIDECAR} .package-action-list .entity[data-name="${action}"] .clickable`)

      await sidecar.expectOpen(this.app).then(sidecar.expectShowing(action, undefined, undefined, pckage))
    } catch (err) {
      return common.oops(this)(err)
    }
  })

  it(`should list ${pckage} with wsk package list`, () =>
    cli
      .do(`wsk package list`, this.app)
      .then(cli.expectOKWith(pckage))
      .catch(common.oops(this)))

  it(`should list ${package2} with package list`, () =>
    cli
      .do(`package list`, this.app)
      .then(cli.expectOKWith(package2))
      .catch(common.oops(this)))

  it(`should list ${package2} with package list`, () =>
    cli
      .do(`package list`, this.app)
      .then(cli.expectOKWith(package2))
      .catch(common.oops(this)))

  it(`should list ${pckage} with package list /${ui.expectedNamespace()}`, () =>
    cli
      .do(`package list /${ui.expectedNamespace()}`, this.app)
      .then(cli.expectOKWith(package2))
      .catch(common.oops(this)))

  it(`should list ${package2} with package list /${ui.expectedNamespace()}`, () =>
    cli
      .do(`package list /${ui.expectedNamespace()}`, this.app)
      .then(cli.expectOKWith(package2))
      .catch(common.oops(this)))

  it(`should list actions in ${pckage} with wsk action list ${pckage}`, () =>
    cli
      .do(`wsk action list ${pckage}`, this.app)
      .then(cli.expectOKWith(action))
      .catch(common.oops(this)))

  it(`should list actions in ${pckage} with kui action list ${pckage}`, () =>
    cli
      .do(`kui action list ${pckage}`, this.app)
      .then(cli.expectOKWith(action))
      .catch(common.oops(this)))

  it(`should list actions in ${pckage} with action list ${pckage}`, () =>
    cli
      .do(`action list ${pckage}`, this.app)
      .then(cli.expectOKWith(action))
      .catch(common.oops(this)))
})
