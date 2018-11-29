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

const path = require('path')
const ROOT = process.env.TEST_ROOT
const common = require(path.join(ROOT, 'lib/common'))
const ui = require(path.join(ROOT, 'lib/ui'))
const cli = ui.cli

const kinds = ['deployments', 'pods', 'crds']

/**
 * Keep poking the given kind till no more such entities exist
 *
 */
exports.waitTillNone = (kind, name = '') => app => new Promise(resolve => {
  const iter = () => {
    return cli.do(`kubectl get "${kind}" ${name}`, app)
      .then(cli.expectError(404))
      .then(resolve)
      .catch(() => setTimeout(iter, 3000))
  }

  iter()
})

exports.wipe = ctx => {
  return kinds.reduce(async (P, kind) => {
    await P

    return cli.do(`kubectl delete "${kind}" --all`, ctx.app)
      .then(cli.expectOK)
      .then(exports.waitTillNone(kind))
      .catch(common.oops(ctx))
  }, Promise.resolve())
}
