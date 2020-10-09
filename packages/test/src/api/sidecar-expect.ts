/*
 * Copyright 2019-20 IBM Corporation
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

import * as assert from 'assert'

import { timeout, waitTimeout } from './cli'
import * as Selectors from './selectors'
import { keys as Keys } from './keys'
import { expectArray, expectText, getValueFromMonaco, expectYAMLSubset } from './util'
import { AppAndCount, blockAfter } from './repl-expect'

export const open = async (res: AppAndCount) => {
  await res.app.client.waitForVisible(Selectors.SIDECAR(res.count), waitTimeout)
  return res
}

/** Same as open(), but in the block proceding the given block */
export function openInBlockAfter(res: AppAndCount, delta = 1) {
  return open(blockAfter(res, delta))
}

export const notOpen = async (res: AppAndCount) => {
  await res.app.client.waitForVisible(Selectors.SIDECAR(res.count), waitTimeout, true)
  return res
}

export const openWithFailure = async (res: AppAndCount) => {
  return res.app.client.waitForVisible(Selectors.SIDECAR_WITH_FAILURE(res.count), waitTimeout).then(() => res)
}

/** expect open fullscreen */
export const fullscreen = async (res: AppAndCount) => {
  return res.app.client.waitForVisible(Selectors.SIDECAR_FULLSCREEN(res.count), waitTimeout).then(() => res)
}

/** fully closed, not just minimized */
export const fullyClosed = async (res: AppAndCount) => {
  return res.app.client.waitForExist(Selectors.SIDECAR_FULLY_CLOSED(res.count)).then(() => res)
}

/** either minimized or fully closed */
export const closed = async (res: AppAndCount) => {
  return fullyClosed(res)
}

/** close the sidecar by ESCAPE key */
export const keyToClose = async (res: AppAndCount) => {
  await res.app.client.keys(Keys.ESCAPE)
  return closed(res)
}

/** Expect the given badge to exist in the sidecar header */
export const badge = (title: string, css?: string, absent = false) => async (res: AppAndCount) => {
  await res.app.client.waitUntil(async () => {
    const badges = css
      ? await res.app.client.getText(`${Selectors.SIDECAR_BADGES(res.count)} .${css}`)
      : await res.app.client.getText(Selectors.SIDECAR_BADGES(res.count))

    const idx = badges.indexOf(title)
    return !absent ? idx >= 0 : idx < 0
  }, waitTimeout)
  return res
}

export const button = (button: { mode: string; label?: string }) => async (res: AppAndCount) => {
  await res.app.client.waitForVisible(Selectors.SIDECAR_TOOLBAR_BUTTON(res.count, button.mode), waitTimeout)
  return res
}

export const mode = (expectedMode: string) => async (res: AppAndCount) => {
  await res.app.client.waitUntil(async () => {
    await res.app.client.waitForVisible(`${Selectors.SIDECAR_MODE_BUTTON_SELECTED(res.count, expectedMode)}`)
    return true
  }, waitTimeout)

  return res
}

export const toolbarText = (expect: { type: string; text: string; exact?: boolean }) => async (res: AppAndCount) => {
  await expectText(res.app, expect.text, expect.exact || false)(Selectors.SIDECAR_TOOLBAR_TEXT(res.count, expect.type))
  return res
}

export const toolbarAlert = (expect: { type: string; text: string; exact?: boolean }) => async (res: AppAndCount) => {
  await expectText(res.app, expect.text, expect.exact)(Selectors.SIDECAR_ALERT(res.count, expect.type))
  return res
}

const show = (expected: string, selector: string) => async (res: AppAndCount): Promise<AppAndCount> => {
  await res.app.client.waitUntil(async () => {
    return res.app.client
      .then(() => res.app.client.waitForText(selector, timeout))
      .then(() => res.app.client.getText(selector))
      .then(text => text === expected)
  }, waitTimeout)

  return res
}

export const name = (count: number, expectedName: string) => show(expectedName, Selectors.SIDECAR_TITLE(count))

export const heroName = (count: number, expectedName: string) => show(expectedName, Selectors.SIDECAR_HERO_TITLE(count))

export const namehash = (count: number, expectedNameHash: string) =>
  show(expectedNameHash, Selectors.SIDECAR_ACTIVATION_TITLE(count))

export const namespace = (expectedNamespace: string) => async (res: AppAndCount) =>
  show(expectedNamespace, Selectors.SIDECAR_PACKAGE_NAME_TITLE(res.count))(res)

export const kind = (expectedKind: string) => async (res: AppAndCount) =>
  show(expectedKind, Selectors.SIDECAR_KIND(res.count))(res)

// expect sidecar tabs have correct `mode` and `label`
export const modes = (expected: { mode: string; label?: string; dafaultMode?: boolean }[]) => async (
  res: AppAndCount
) =>
  Promise.all(
    expected.map(async _ => {
      await res.app.client.waitUntil(async () => {
        const actualMode = `${Selectors.SIDECAR_MODE_BUTTON(res.count, _.mode)}`
        await res.app.client.waitForExist(actualMode)

        if (_.label && (await res.app.client.isVisible(actualMode))) {
          const actualLabel = await res.app.client.getText(actualMode)
          return actualLabel.toLowerCase() === _.label.toLowerCase()
        } else {
          return true
        }
      }, waitTimeout)
    })
  ).then(() => res)

// expect sidecar tab has the correct default tab
export const defaultMode = (expected: { mode: string; label?: string }) => async (res: AppAndCount) => {
  await res.app.client.waitUntil(async () => {
    const actualMode = `${Selectors.SIDECAR_MODE_BUTTON_SELECTED(res.count, expected.mode)}`
    await res.app.client.waitForVisible(actualMode)

    if (expected.label) {
      const actualLabel = await res.app.client.getText(actualMode)
      return actualLabel.toLowerCase() === expected.label.toLowerCase()
    } else {
      return true
    }
  }, waitTimeout)

  return res
}

export const textPlainContent = (content: string) => async (res: AppAndCount) => {
  await expectText(res.app, content)(Selectors.SIDECAR_CUSTOM_CONTENT(res.count))
  return res
}

export const textPlainContentFromMonaco = (expectedText: string, exact = true) => async (res: AppAndCount) => {
  let idx = 0
  await res.app.client.waitUntil(async () => {
    const actualText = await getValueFromMonaco(res)
    if (++idx > 5) {
      console.error(`still waiting for plain text from monaco actualText=${actualText} expectedText=${expectedText}`)
    }

    if (exact) {
      return actualText === expectedText
    } else {
      return actualText.indexOf(expectedText) >= 0
    }
  }, waitTimeout)

  return res
}

export async function tableContent(res: AppAndCount, nRows: number, nCells: number) {
  const rows = (await res.app.client.elements(`${Selectors.SIDECAR_CUSTOM_CONTENT} tr`)).value
  assert.strictEqual(nRows, rows.length, 'nRows must match')

  const cells = (await res.app.client.elements(`${Selectors.SIDECAR_CUSTOM_CONTENT} td`)).value
  assert.strictEqual(nCells, cells.length, 'nCells must match')
}

export const yaml = (content: object) => async (res: AppAndCount) => {
  await res.app.client.waitUntil(async () => {
    const ok: boolean = await getValueFromMonaco(res).then(expectYAMLSubset(content, false))
    return ok
  }, waitTimeout)

  return res
}

export async function popupTitle(res: AppAndCount, expectedTitle: string) {
  return res.app.client.waitUntil(async () => {
    const actualTitle = await res.app.client.getText(Selectors.SIDECAR_POPUP_HERO_TITLE(res.count))
    return actualTitle === expectedTitle
  }, waitTimeout)
}

/** expect a form in the sidecar content */
export function form(form: Record<string, string>, idPrefix = 'kui-form') {
  return async (res: AppAndCount) => {
    await Promise.all(
      Object.keys(form).map(key => {
        return res.app.client.waitUntil(async () => {
          const expectedValue = form[key]
          const actualValue = await res.app.client.getValue(`${Selectors.SIDECAR_TAB_CONTENT} #${idPrefix}-${key}`)
          return actualValue === expectedValue
        }, waitTimeout)
      })
    )

    return res
  }
}

export const showing = (
  expectedName: string,
  expectedActivationId?: string,
  expectSubstringMatchOnName?: boolean,
  expectedPackageName?: string,
  expectType?: string,
  waitThisLong?: number,
  which?: 'leftnav' | 'topnav'
) => async (res: AppAndCount): Promise<AppAndCount> => {
  await res.app.client.waitUntil(
    async () => {
      // check selected name in sidecar
      const sidecarSelector = `${Selectors.SIDECAR(res.count)}${!expectType ? '' : '.entity-is-' + expectType}`
      await res.app.client.waitForVisible(sidecarSelector)

      // either 'leftnav' or 'topnav'
      if (!which) {
        which = await res.app.client.getAttribute(sidecarSelector, 'data-view')
      }
      const titleSelector =
        which === 'topnav' ? Selectors.SIDECAR_TITLE(res.count) : Selectors.SIDECAR_LEFTNAV_TITLE(res.count)

      return res.app.client
        .waitForText(titleSelector, waitThisLong)
        .then(() => res.app.client.getText(titleSelector))
        .then(name => {
          const nameMatches = expectSubstringMatchOnName
            ? name.indexOf(expectedName) >= 0 || expectedName.indexOf(name) >= 0
            : name === expectedName
          if (nameMatches) {
            if (expectedPackageName) {
              return res.app.client
                .getText(Selectors.SIDECAR_PACKAGE_NAME_TITLE(res.count))
                .then(name =>
                  expectSubstringMatchOnName
                    ? name.search(new RegExp(expectedPackageName, 'i')) >= 0
                    : name.toLowerCase() === expectedPackageName.toLowerCase()
                )
            } else {
              return true
            }
          }
        })
    },
    waitThisLong || waitTimeout,
    `expect action name ${expectedName} in sidecar substringOk? ${expectSubstringMatchOnName}`
  )

  if (expectedActivationId) {
    await res.app.client.waitUntil(
      async () => {
        try {
          const actualId = await res.app.client.getText(Selectors.SIDECAR_ACTIVATION_TITLE(res.count))
          if (actualId === expectedActivationId) {
            return true
          } else {
            console.error(`still waiting for nameHash; currently "${actualId}"; expecting "${expectedActivationId}"`)
          }
        } catch (err) {
          console.error(`error waiting for nameHash ${err.message}`, err)
        }
      },
      waitTimeout,
      `expect activation id ${expectedActivationId} in sidecar`
    )
  }

  return res
}

export const showingTopNav = (expectedName: string) =>
  showing(expectedName, undefined, undefined, undefined, undefined, undefined, 'topnav')

export const showingLeftNav = (expectedName: string) =>
  showing(expectedName, undefined, undefined, undefined, undefined, undefined, 'leftnav')

export function breadcrumbs(breadcrumbs: string[]) {
  return async (res: AppAndCount) => {
    await res.app.client.waitForVisible(Selectors.SIDECAR_BREADCRUMBS(res.count))
    await res.app.client.getText(Selectors.SIDECAR_BREADCRUMBS(res.count))
    await expectArray(breadcrumbs)

    return res
  }
}
