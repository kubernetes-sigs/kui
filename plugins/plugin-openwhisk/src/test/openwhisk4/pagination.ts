/*
 * Copyright 2017 IBM Corporation
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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = `paginator-test-${new Date().getTime()}`
const actionName2 = `test-paginator-${new Date().getTime()}` // intentionally jumbled w.r.t. actionName

// number of invocations; the paginator will use a limit of NN / 2, so
// this must be a multiple of 2
const NN = 4

/**
 * Invoke the given action NN times, each time waiting for the
 * activationId to show up in the activation list results
 *
 */
const invokeABunch = (ctx: Common.ISuite, actionName: string) => {
  for (let idx = 0; idx < NN; idx++) {
    it(`should invoke it idx=${idx}`, () =>
      CLI.command(`wsk action invoke ${actionName}`, ctx.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))
        .then(() => ctx.app.client.getText(Selectors.SIDECAR_ACTIVATION_ID)) // get the activationId
        .then(activationId => openwhisk.waitForActivation(ctx.app, activationId, { name: actionName })) // wait till activation list shows it
        .catch(Common.oops(ctx)))
  }
}

/**
 * List activations, paginate back and forth, optionally filtering by
 * the given action
 *
 */
const testPagination = (ctx: Common.ISuite, actionName?: string) => {
  const { app } = ctx

  const limit = NN / 2
  const extraArgs = actionName ? `--name ${actionName}` : ''

  // selector that identifies the REPL output of the command just executed
  const lastBlock = 'repl .repl-block:nth-last-child(2)'
  const tableRows = `${lastBlock} .log-line`
  const tableRowsFiltered = actionName ? `${tableRows}[data-name="${actionName}"]` : tableRows
  const description = `${lastBlock} .list-paginator-description`
  const prevButton = `${lastBlock} .list-paginator-button-prev`
  const nextButton = `${lastBlock} .list-paginator-button-next`

  return (
    CLI.command(`wsk $ list --limit ${limit} ${extraArgs}`, app)
      .then(ReplExpect.okWithAny)
      .then(() =>
        app.client.waitUntil(() => {
          return Promise.all([app.client.getText(description), app.client.elements(tableRowsFiltered)]).then(
            ([paginatorText, rows]) => {
              return (
                paginatorText.indexOf(`1\u2013${limit}`) === 0 && rows.value.length === limit // starts with "1-limit" ...
              )
            }
          )
        })
      )

      // click next button
      .then(() => app.client.click(nextButton))
      .then(() =>
        app.client.waitUntil(() => {
          return Promise.all([app.client.getText(description), app.client.elements(tableRowsFiltered)]).then(
            ([paginatorText, rows]) => {
              return (
                paginatorText.indexOf(`${limit + 1}\u2013${limit + limit}`) === 0 && rows.value.length === limit // starts with 'N+1-N+limit+1'
              )
            }
          )
        })
      )

      // click prev button
      .then(() => app.client.click(prevButton))
      .then(() =>
        app.client.waitUntil(() => {
          return Promise.all([app.client.getText(description), app.client.elements(tableRowsFiltered)]).then(
            ([paginatorText, rows]) => {
              return (
                paginatorText.indexOf(`1\u2013${limit}`) === 0 && rows.value.length === limit // starts with "1-limit" ...
              )
            }
          )
        })
      )

      .catch(Common.oops(ctx))
  )
}

describe('Activation list paginator', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it(`should create an action ${actionName}`, () =>
    CLI.command(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName)))

  it(`should create an action ${actionName2}`, () =>
    CLI.command(`wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2)))

  invokeABunch(this, actionName)
  it('paginate activations without filter', () => testPagination(this))

  invokeABunch(this, actionName2)
  it(`paginate activations with filter ${actionName}`, () => testPagination(this, actionName))
  it(`paginate activations with filter ${actionName2}`, () => testPagination(this, actionName2))
})
