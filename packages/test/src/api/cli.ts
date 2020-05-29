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

import { Application } from 'spectron'

import * as Common from './common'
import * as Selectors from './selectors'
import { keys } from './keys'

export const timeout = Math.max(5000, parseInt(process.env.TIMEOUT) || 60000)
export const waitTimeout = timeout - 5000

/** grab focus for the repl */
const grabFocus = async (app: Application) => {
  const currentPrompt = process.env.KUI_POPUP
    ? Selectors.STATUS_STRIPE_PROMPT
    : !process.env.BOTTOM_INPUT_MODE
    ? Selectors.CURRENT_PROMPT
    : Selectors.BOTTOM_PROMPT
  const currentPromptBlock = process.env.KUI_POPUP
    ? Selectors.STATUS_STRIPE_BLOCK
    : !process.env.BOTTOM_INPUT_MODE
    ? Selectors.CURRENT_PROMPT_BLOCK
    : Selectors.BOTTOM_PROMPT_BLOCK

  return app.client
    .click(currentPrompt)
    .then(() => app.client.waitForEnabled(currentPromptBlock))
    .catch(err => {
      console.error(err)
      // probably ok, we are doing this is just in case it helps
    })
}

/**
 * Execute a CLI command, and return the data-input-count of that command
 *
 */
export const command = async (
  cmd: string,
  app: Application,
  noNewline = false,
  noCopyPaste = false,
  noFocus = false
) => {
  const block = process.env.KUI_POPUP ? Selectors.STATUS_STRIPE_BLOCK : Selectors.CURRENT_PROMPT_BLOCK
  const currentPrompt = process.env.KUI_POPUP
    ? Selectors.STATUS_STRIPE_PROMPT
    : !process.env.BOTTOM_INPUT_MODE
    ? Selectors.CURRENT_PROMPT
    : Selectors.BOTTOM_PROMPT

  return app.client
    .waitForExist(block, timeout - 5000)
    .then(async () => {
      if (process.env.BOTTOM_INPUT_MODE) await app.client.waitForExist(Selectors.BOTTOM_PROMPT_BLOCK, timeout - 5000)
      if (!noFocus) return grabFocus(app)
    })
    .then(() => app.client.getAttribute(block, 'data-input-count'))
    .then(async count => {
      if (!noCopyPaste && cmd.length > 1) {
        // use the clipboard for a fast path
        await app.client.execute(
          text => navigator.clipboard.writeText(text).then(() => document.execCommand('paste')),
          cmd
        )
      } else {
        // slow path
        const currentValue = await app.client.getValue(currentPrompt)
        const doThis = `${currentValue}${cmd}`
        await app.client.setValue(currentPrompt, doThis)
      }
      if (noNewline !== true) await app.client.keys(keys.ENTER)
      return { app: app, count: parseInt(count) }
    })
}

export const paste = async (cmd: string, app: Application, nLines = 1) =>
  app.client
    .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
    .then(() => app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(async count => {
      app.electron.clipboard.writeText(cmd)
      await app.client.execute(() => document.execCommand('paste'))
      return { app: app, count: parseInt(count) + nLines - 1 }
    })

/** wait for the repl to be active */
export const waitForRepl = async (app: Application) => {
  if (process.env.KUI_POPUP) {
    await app.client.waitForEnabled(Selectors.STATUS_STRIPE_PROMPT)
  } else {
    await app.client.waitForEnabled(Selectors.CURRENT_PROMPT)
  }
  return app
}

/**
 * Wait, if needed, for a proxy session
 *
 */
export const waitForSession = async (ctx: Common.ISuite, noProxySessionWait = false) => {
  if (!process.env.MOCHA_RUN_TARGET || process.env.MOCHA_RUN_TARGET === 'electron') {
    await ctx.app.client.waitUntilWindowLoaded()
  }

  if (process.env.MOCHA_RUN_TARGET === 'webpack' && process.env.KUI_USE_PROXY === 'true' && !noProxySessionWait) {
    // wait for the proxy session to be established
    try {
      await ctx.app.client.waitForExist(`${Selectors.CURRENT_TAB}.kui--session-init-done`)
    } catch (err) {
      throw new Error('error waiting for proxy session init')
    }
  }
}

export const getTextContent = async (app: Application, selector: string) => {
  return app.client
    .execute(selector => {
      try {
        return document.querySelector(selector).textContent
      } catch (err) {
        console.error('error in getTextContent', err)
        // intentionally returning undefined
      }
    }, selector)
    .then(_ => _.value)
}

/** wait for the result of a cli.command */
export const makeCustom = (selector: string, expect: string, exact?: boolean) => ({
  selector: selector,
  expect: expect,
  exact: exact
})

/**
 * Exit code code for the given http status code; this is an identity function; for headless mode, there is the -256 part.
 * See headless.js for the analogous headless implementation.
 */
export const exitCode = (statusCode: number | string) => statusCode

export const expectInput = (selector: string, expectedText: string) => async (app: Application) => {
  await app.client.waitUntil(async () => {
    const inputText = await app.client.getValue(selector)
    return inputText === expectedText
  }, waitTimeout)
  return app
}

export const expectPriorInput = (selector: string, expectedText: string) => async (app: Application) => {
  await app.client.waitUntil(async () => {
    const inputText = await app.client.getText(selector)
    return inputText === expectedText
  }, waitTimeout)
  return app
}
