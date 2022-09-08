/*
 * Copyright 2019 The Kubernetes Authors
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

const { v4: uuid } = require('uuid')
const assert = require('assert')
const { dirname, join } = require('path')

const { Common, CLI, ReplExpect, Selectors, SidecarExpect, Util } = require('@kui-shell/test')
const { makeCLI } = require('@kui-shell/core/tests/lib/headless')

const ROOT = process.env.TEST_ROOT

/** should contain kubectl-kui */
const bindir = process.env.KUI ? dirname(process.env.KUI) : join(ROOT, '../../bin')

/** the default tab we expect to see on "get" */
exports.defaultModeForGet = 'summary'

/** Do singleton tables have a title decoration? */
exports.singletonTablesHaveTitle = false

/**
 * Wait for a green badge
 *
 */
exports.waitForGreen = async (app, selector) => {
  const notRepeatingPulse = 'td:not(.repeating-pulse)'
  const badge = `${selector} [data-tag="badge"]`
  const greenBadge = `${selector} ${notRepeatingPulse} [data-tag="badge"].green-background`
  const yellowBadge = `${selector} [data-tag="badge"].yellow-background`

  try {
    await app.client.$(yellowBadge).then(_ => _.waitForExist({ timeout: CLI.waitTimeout, reverse: true }))
  } catch (err) {
    console.log(`Creation is still yellow after ${CLI.waitTimeout} ${selector}`)
    const text = await app.client.$(badge).then(_ => _.getText())
    console.log(`Creation status ${text}`)
  }

  await app.client.$(greenBadge).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
  return greenBadge
}

/**
 * Wait for a red badge
 *
 */
exports.waitForRed = async (app, selector) => {
  const notRepeatingPulse = 'td:not(.repeating-pulse)'
  const badge = `${selector} ${notRepeatingPulse} [data-tag="badge"].red-background`
  const yellowBadge = `${selector} [data-tag="badge"].yellow-background`

  // the green badge should disappear, wait for 5 seconds at max
  try {
    await app.client.$(badge.replace('red', 'green')).then(_ => _.waitForExist({ timeout: 5000, reverse: true }))
  } catch (err) {
    console.log('Deletion is still green after 5000 ms')
  }

  try {
    await app.client.$(yellowBadge).then(_ => _.waitForExist({ timeout: CLI.waitTimeout, reverse: true }))
  } catch (err) {
    console.log(`Deletion is still yellow after ${CLI.waitTimeout}`)
    const text = await app.client.$(yellowBadge).then(_ => _.getText())
    console.log(`Deletion status ${text}`)
  }

  await app.client.$(badge).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
  return badge
}

exports.createNS = (prefix = '') => `${prefix}${uuid()}-kui`

exports.allocateNS = (ctx, ns, command = 'kubectl', theCli = CLI) => {
  it(`should create a namespace ${ns} for test: ${ctx.title}`, () => {
    return theCli
      .command(`${command} create namespace ${ns}`, ctx.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(ns) }))
      .then(selector => exports.waitForGreen(ctx.app, selector))
      .catch(Common.oops(ctx, true))
  })
}

exports.deleteNS = (ctx, ns, command = 'kubectl', theCli = CLI) => {
  if (!process.env.TRAVIS_JOB_ID) {
    // to save travis test time
    const namespaces = Array.isArray(ns) ? ns : [ns]
    it(`should delete the namespaces ${namespaces}`, async () => {
      try {
        const res = await theCli.command(`${command} delete namespace ${namespaces.join(' ')}`, ctx.app)

        await Promise.all(
          namespaces.map(ns =>
            ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(ns) })(res).then(selector =>
              exports.waitForRed(ctx.app, selector)
            )
          )
        )
      } catch (err) {
        await Common.oops(ctx, true)(err)
      }
    })
  }
}

/**
 * Execute a `command` to show a table;
 * wait for `name` to be green
 *
 */
exports.list = async (ctx, command, name, wait = true) => {
  const selector = await Util.doList(ctx, command, name)
  if (wait) {
    // wait for the badge to become green
    await exports.waitForGreen(ctx.app, selector)
  }
  return selector
}

/**
 * Execute a `command` to show a table;
 * wait for `name` to be green;
 * click the `name` to open a sdiecar
 *
 */
exports.openSidecarByList = async (ctx, command, name, wait = true, mode = exports.defaultModeForGet) => {
  const selector = await exports.list(ctx, command, name, wait)
  return Util.openSidecarByClick(ctx, `${selector} .clickable`, name, mode)
}

exports.deletePodByName = (ctx, pod, ns, command = 'kubectl', theCli = CLI) => {
  it(`should delete the pod ${pod} by name via ${command}`, () => {
    return theCli
      .command(`${command} delete pod ${pod} -n ${ns}`, ctx.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(pod) }))
      .then(selector => exports.waitForRed(ctx.app, selector))
      .catch(Common.oops(ctx, true))
  })
}

/**
 * Keep poking the given kind till no more such entities exist
 *
 */
exports.waitTillNone =
  (kind, theCli = makeCLI('kubectl'), name = '', okToSurvive, inNamespace = '') =>
  app =>
    new Promise(resolve => {
      // fetch the entities
      const fetch = async () => {
        const response = await theCli.command(
          `get "${kind}" ${typeof name === 'string' ? name : name.join(' ')} ${inNamespace}`,
          app,
          {
            errOk: 1
          }
        )
        return response
      }

      // verify the entities
      const verify = okToSurvive
        ? theCli === ReplExpect
          ? theCli.expectOKWith(okToSurvive)
          : theCli.expectOK(okToSurvive)
        : theCli.expectError(1, 'not found')

      const iter = () => {
        return fetch()
          .then(verify)
          .then(resolve)
          .catch(() => setTimeout(iter, 3000))
      }

      iter()
    })

/**
 * Keep poking the given kind till no more such entities exist
 *
 */
exports.waitTillTerminating =
  (kind, theCli = CLI, name, inNamespace) =>
  app =>
    new Promise(resolve => {
      // fetch the entities
      const fetch = () =>
        theCli
          .do(`kubectl get "${kind}" ${name} ${inNamespace}`, app, {
            errOk: theCli.exitCode(404)
          })
          .then(res => {
            return /Terminating/.test(res.output)
          })

      const iter = async () => {
        const isTerminating = await fetch()
        if (isTerminating) {
          resolve()
        } else {
          setTimeout(iter, 3000)
        }
      }

      iter()
    })

/**
 * Confirm that the table title matches
 *
 */
exports.assertTableTitleMatches = async function (self, tableSelector, expectedTitle) {
  // getHTML rather than getText, in case the title is not visible in this client
  const tableTitle = (await self.app.client.$(`${tableSelector} .result-table-title`).then(_ => _.getHTML())).replace(
    /<div.*>(.*)<\/div>/,
    '$1'
  )

  assert.strictEqual(tableTitle.toLowerCase(), expectedTitle)
}

/**
 * Type slowly, this helps with some odd webpack+proxy issues
 *
 */
exports.typeSlowly = async (app, txt) => {
  for (let idx = 0; idx < txt.length; idx++) {
    await new Promise(resolve => setTimeout(resolve, 20))
    await app.client.keys(txt.charAt(idx))
  }
  await new Promise(resolve => setTimeout(resolve, 20))
}

/** kubectl kui impl */
exports.kubectl = makeCLI('kubectl kui', bindir)

/** kubectl kui --ui impl */
// exports.kubectlElectron = make CLI('kubectl kui', bindir, true) // the last true requests teeToFile mode

/**
 * Test Usage
 *
 */
exports.doHelp = function doHelp(cmd, breadcrumbs, modes, content = '') {
  it(`should give help for known outer command=${cmd} breadcrumbs=${breadcrumbs}`, async () => {
    try {
      const res = await CLI.command(cmd, this.app).then(ReplExpect.ok).then(SidecarExpect.open)

      await this.app.client.$(Selectors.SIDECAR_BREADCRUMBS(res.count)).then(_ => _.waitForDisplayed())
      await this.app.client.$(Selectors.SIDECAR_BREADCRUMBS(res.count)).then(_ => _.getText())
      await expectArray(breadcrumbs.map(_ => _.label))

      await Promise.all(
        modes.map(_ =>
          this.app.client.$(Selectors.SIDECAR_MODE_BUTTON_V2(res.count, _)).then(_ => _.waitForDisplayed())
        )
      )

      if (content) {
        return this.app.client.waitUntil(async () => {
          const text = await this.app.client
            .$(`${Selectors.SIDECAR(res.count)} .kui--sidecar-text-content`)
            .then(_ => _.getText())
          return text.include(content)
        }, CLI.waitTimeout)
      }
    } catch (err) {
      await Common.oops(this, true)
    }
  })
}

/** Selector to extract the Terminal rows */
const terminalRows = (N, splitIndex) => `${Selectors.SIDECAR_TAB_CONTENT(N, splitIndex)} .xterm-rows`

/** Get text from a Terminal-oriented tab */
exports.getTerminalText = async function (res) {
  await this.app.client.$(terminalRows(res.count, res.splitIndex)).then(_ => _.waitForExist())
  return this.app.client.$(terminalRows(res.count, res.splitIndex)).then(_ => _.getText())
}

/** Wait for the given checker to be true, w.r.t. the log text in the view */
exports.waitForTerminalText = async function (res, checker) {
  let idx = 0
  const get = exports.getTerminalText.bind(this, res)
  return this.app.client.waitUntil(async () => {
    const text = await get()
    if (++idx > 5) {
      console.error(`still waiting for terminal text actualText=${text}`)
    }
    return typeof checker === 'string'
      ? text.indexOf(checker) >= 0
      : typeof checker === 'function'
      ? checker(text)
      : checker.test(text)
  }, CLI.waitTimeout)
}

/** URL of remote pod yaml */
exports.remotePodYaml =
  'https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/simple-pod.yaml'

/** Name of remote pod */
exports.remotePodName = 'nginx'

/** URL of remote pod yaml */
exports.remotePodYaml2 =
  'https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml'

/** Name of remote pod2 */
exports.remotePodName2 = 'lifecycle-demo'
