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
const common = require('@kui-shell/core/tests/lib/common')
const ui = require('@kui-shell/core/tests/lib/ui')
const { cli, selectors } = ui
const uuid = require('uuid/v4')

// the default tab we expect to see on "get"
exports.defaultModeForGet = 'summary'

exports.createNS = () => uuid()

exports.allocateNS = (ctx, ns, theCli = cli) => {
  it(`should create a namespace ${ns} `, () => {
    return theCli.do(`kubectl create namespace ${ns}`, ctx.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(ns) }))
      .then(selector => ctx.app.client.waitForExist(`${selector} badge.green-background`))
      .catch(common.oops(ctx))
  })
}

exports.deleteNS = (ctx, ns, theCli = cli) => {
  if (!process.env.TRAVIS_JOB_ID) { // to save travis test time
    it(`should delete the namespace ${ns}`, () => {
      return theCli.do(`kubectl delete namespace ${ns}`, ctx.app)
        .then(cli.expectOKWithCustom({ selector: ui.selectors.BY_NAME(ns) }))
        .then(selector => ctx.app.client.waitForExist(`${selector} badge.red-background`))
        .catch(common.oops(ctx))
    })
  }
}
