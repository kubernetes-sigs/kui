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

const debug = require('debug')('k8s/tests/lib/wipe')

const path = require('path')
const common = require('@kui-shell/core/tests/lib/common')
const ui = require('@kui-shell/core/tests/lib/ui')
const cli = ui.cli

const kinds = ['deployments', 'pods', 'crds']

/**
 * Keep poking the given kind till no more such entities exist
 *
 */
exports.waitTillNone = (kind, theCli = cli, name = '') => app => new Promise(resolve => {
  const iter = () => {
    return theCli.do(`kubectl get "${kind}" ${name}`, app, { errOk: theCli.exitCode(404) })
      .then(theCli.expectError(theCli.exitCode(404)))
      .then(resolve)
      .catch(() => setTimeout(iter, 3000))
  }

  iter()
})

exports.wipe = (ctx, theCli = cli) => {
  return kinds.reduce(async (P, kind) => {
    await P

    debug(`deleting ${kind}`)

    return theCli.do(`kubectl delete "${kind}" --all`, ctx.app)
      .then(theCli.expectOK)
      .then(exports.waitTillNone(kind, theCli))
      .catch(common.oops(ctx))
  }, Promise.resolve())
}
