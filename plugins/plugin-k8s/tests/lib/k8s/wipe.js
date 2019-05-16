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

const common = require('@kui-shell/core/tests/lib/common')
const ui = require('@kui-shell/core/tests/lib/ui')
const cli = ui.cli

const kinds = [ 'deployments', 'pods', 'crds', 'cm' ] /* , 'services' */
const okToSurvive = [ null, null, null ] /* , 'kubernetes' */

/**
 * Keep poking the given kind till no more such entities exist
 *
 */
exports.waitTillNone = (kind, theCli = cli, name = '', okToSurvive, inNamespace = '') => app => new Promise(resolve => {
  // fetch the entities
  const fetch = () => theCli.do(`kubectl get "${kind}" ${name} ${inNamespace}`, app, { errOk: theCli.exitCode(404) })

  // verify the entities
  const verify = okToSurvive
    ? theCli.expectOKWith(okToSurvive)
    : theCli.expectError(theCli.exitCode(404))

  const iter = () => {
    return fetch()
      .then(verify)
      .then(resolve)
      .catch(() => setTimeout(iter, 3000))
  }

  iter()
})

exports.wipe = (ctx, theCli = cli) => {
  return kinds.reduce(async (P, kind, idx) => {
    await P

    debug(`deleting ${kind}`)

    return theCli.do(`kubectl delete "${kind}" --all`, ctx.app)
      .then(theCli.expectOKWithAny)
      .then(exports.waitTillNone(kind, theCli, undefined, okToSurvive[idx]))
      .catch(common.oops(ctx))
  }, Promise.resolve())
}
