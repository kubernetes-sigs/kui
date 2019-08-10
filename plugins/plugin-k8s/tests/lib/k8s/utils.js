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

const uuid = require('uuid/v4')
const assert = require('assert')

const common = require('@kui-shell/core/tests/lib/common')
const ui = require('@kui-shell/core/tests/lib/ui')
const { cli, selectors } = ui

// the default tab we expect to see on "get"
exports.defaultModeForGet = 'summary'

/**
 * Wait for a green badge
 *
 */
exports.waitForGreen = async (app, selector) => {
  const notRepeatingPulse = 'td:not(.repeating-pulse)'
  const badge = `${selector} badge`
  const greenBadge = `${selector} ${notRepeatingPulse} badge.green-background`
  const yellowNotBlinkyBadge = `${selector} ${notRepeatingPulse} badge.yellow-background`
  const yellowBadge = `${selector} badge.yellow-background`

  // expecting a green badge or a blinky yellow badge
  if (await app.client.isExisting(yellowNotBlinkyBadge)) {
    throw Error(`caught a not blinky yellow badge: ${yellowNotBlinkyBadge}`)
  }

  try {
    await app.client.waitForExist(yellowBadge, process.env.TIMEOUT || 60000, true)
  } catch (err) {
    console.log(`Creation is still yellow after ${process.env.TIMEOUT || 60000} ${selector}`)
    const text = await app.client.getText(badge)
    console.log(`Creation status ${text}`)
  }

  await app.client.waitForExist(greenBadge, process.env.TIMEOUT || 60000)
  return greenBadge
}

/**
 * Wait for a red badge
 *
 */
exports.waitForRed = async (app, selector) => {
  const notRepeatingPulse = 'td:not(.repeating-pulse)'
  const badge = `${selector} ${notRepeatingPulse} badge.red-background`
  const yellowNotBlinkyBadge = `${selector} ${notRepeatingPulse} badge.yellow-background`
  const yellowBadge = `${selector} badge.yellow-background`

  // the green badge should disapper, wait for 5 seconds at max
  try {
    await app.client.waitForExist(badge.replace('red', 'green'), 5000, true)
  } catch (err) {
    console.log('Deletion is still green after 5000 ms')
  }

  // no green badge any more, expecting a red badge or a blinky yellow badge
  if (await app.client.isExisting(yellowNotBlinkyBadge)) {
    throw Error(`caught a not blinky yellow badge: ${yellowNotBlinkyBadge}`)
  }

  try {
    await app.client.waitForExist(yellowBadge, process.env.TIMEOUT || 60000, true)
  } catch (err) {
    console.log(`Deletion is still yellow after ${process.env.TIMEOUT || 60000}`)
    const text = await app.client.getText(yellowBadge)
    console.log(`Deletion status ${text}`)
  }

  await app.client.waitForExist(badge, process.env.TIMEOUT || 60000)
  return badge
}

exports.createNS = (prefix = '') => `${prefix}${uuid()}-kui`

exports.allocateNS = (ctx, ns, theCli = cli) => {
  it(`should create a namespace ${ns} `, () => {
    return theCli
      .do(`kubectl create namespace ${ns}`, ctx.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(ns) }))
      .then(selector => exports.waitForGreen(ctx.app, selector))
      .catch(common.oops(ctx))
  })
}

exports.deleteNS = (ctx, ns, theCli = cli) => {
  if (!process.env.TRAVIS_JOB_ID) {
    // to save travis test time
    it(`should delete the namespace ${ns}`, () => {
      return theCli
        .do(`kubectl delete namespace ${ns}`, ctx.app)
        .then(cli.expectOKWithCustom({ selector: ui.selectors.BY_NAME(ns) }))
        .then(selector => exports.waitForRed(ctx.app, selector))
        .catch(common.oops(ctx))
    })
  }
}

/**
 * Keep poking the given kind till no more such entities exist
 *
 */
exports.waitTillNone = (kind, theCli = cli, name = '', okToSurvive, inNamespace = '') => app =>
  new Promise(resolve => {
    // fetch the entities
    const fetch = () =>
      theCli.do(`kubectl get "${kind}" ${name} ${inNamespace}`, app, {
        errOk: theCli.exitCode(404)
      })

    // verify the entities
    const verify = okToSurvive
      ? theCli === cli
        ? theCli.expectOKWith(okToSurvive)
        : theCli.expectOK(okToSurvive)
      : theCli.expectError(theCli.exitCode(404))

    const iter = () => {
      return fetch()
        .then(verify)
        .then(resolve)
        .catch(() => setTimeout(iter, 3000))
    }

    iter()
  })

/**
 * Confirm that the table title matches
 *
 */
exports.assertTableTitleMatches = async function(self, tableSelector, expectedTitle) {
  // getHTML rather than getText, in case the title is not visible in this client
  const tableTitle = (await self.app.client.getHTML(`${tableSelector} .result-table-title`)).replace(
    /<div.*>(.*)<\/div>/,
    '$1'
  )

  assert.strictEqual(tableTitle.toLowerCase(), expectedTitle)
}
