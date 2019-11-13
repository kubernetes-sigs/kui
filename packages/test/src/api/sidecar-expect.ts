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

import { timeout, waitTimeout } from './cli'
import * as Selectors from './selectors'
import { keys as Keys } from './keys'
import { expectSubset, expectStruct, expectText, getValueFromMonaco, expectYAMLSubset } from './util'

export const open = async (app: Application) => {
  await app.client.waitForVisible(Selectors.SIDECAR, timeout)
  return app
}

export const openWithFailure = async (app: Application) => {
  return app.client.waitForVisible(Selectors.SIDECAR_WITH_FAILURE, timeout).then(() => app)
}

/** expect open fullscreen */
export const fullscreen = async (app: Application) => {
  return app.client.waitForVisible(Selectors.SIDECAR_FULLSCREEN, timeout).then(() => app)
}

/** either minimized or fully closed */
export const closed = async (app: Application) => {
  await app.client.waitForExist(Selectors.SIDECAR_HIDDEN, timeout).then(() => app)
  await new Promise(resolve => setTimeout(resolve, 600)) // wait for the transition effect
}

/** fully closed, not just minimized */
export const fullyClosed = async (app: Application) => {
  return app.client.waitForExist(Selectors.SIDECAR_FULLY_HIDDEN, timeout).then(() => app)
}

/** close the sidecar by ESCAPE key */
export const keyToClose = async (app: Application) => {
  await app.client.keys(Keys.ESCAPE)
  return closed(app)
}

export const sourceStruct = (expectedJSON: object) => async (app: Application) => {
  return app.client
    .getText(Selectors.SIDECAR_ACTION_SOURCE)
    .then(expectStruct(expectedJSON))
    .then(() => app)
}

export const sourceSubset = (expectedJSON: object) => async (app: Application) => {
  return app.client
    .getText(Selectors.SIDECAR_ACTION_SOURCE)
    .then(expectSubset(expectedJSON))
    .then(() => app)
}

export const source = (expectedSource: string) => async (app: Application) => {
  return app.client
    .waitUntil(async () => {
      const actualSource = await app.client.getText(Selectors.SIDECAR_ACTION_SOURCE)
      return actualSource.replace(/\s+/g, '') === expectedSource.replace(/\s+/g, '')
    }, waitTimeout)
    .then(() => app)
}

export const result = (expectedResult: object, failFast?: boolean) => async (app: Application) => {
  return app.client
    .getText(Selectors.SIDECAR_ACTIVATION_RESULT)
    .then(expectStruct(expectedResult, undefined, failFast))
    .then(() => app)
}

export const resultSubset = (expectedResult: object, failFast?: boolean) => async (app: Application) => {
  await app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT).then(expectSubset(expectedResult, failFast))
  return app
}

export const badge = (badge: string) => async (app: Application) => {
  await app.client.waitUntil(async () => {
    const badges = await app.client.getText(Selectors.SIDECAR_BADGES)
    return badges.indexOf(badge) >= 0
  })
  return app
}

export const button = (button: { mode: string; label?: string }) => async (app: Application) => {
  await expectText(app, button.label || button.mode)(Selectors.SIDECAR_TOOLBAR_BUTTON(button.mode))
  return app
}

export const limit = (type: string, expectedValue: number | string) => async (app: Application) => {
  const expect: Record<string, number | string> = {}
  expect[type] = expectedValue

  return app.client
    .click(Selectors.SIDECAR_MODE_BUTTON('limits'))
    .then(() => app.client.getText(Selectors.SIDECAR_ACTION_SOURCE))
    .then(expectSubset(expect))
}

export const sequence = (A: Array<string>) => (app: Application) => {
  return Promise.all(
    A.map((component, idx) => {
      const selector = `${Selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(idx)}[data-name="/_/${component}"]`
      console.error(`Waiting for ${selector}`)
      return app.client.waitForExist(selector)
    })
  )
}

export const mode = (expectedMode: string) => async (app: Application) => {
  await app.client.waitUntil(async () => {
    await app.client.waitForVisible(`${Selectors.SIDECAR_MODE_BUTTON(expectedMode)}.bx--tabs__nav-item--selected`)
    return true
  })

  return app
}

export const toolbarText = (expect: { type: string; text: string }) => async (app: Application) => {
  await expectText(app, expect.text)(Selectors.SIDECAR_TOOLBAR_TEXT(expect.type))
  return app
}

const show = (expected: string, selector: string) => async (app: Application) => {
  await app.client.waitUntil(async () => {
    return app.client
      .then(() => app.client.waitForText(selector, timeout))
      .then(() => app.client.getText(selector))
      .then(text => text === expected)
  })

  return app
}

export const name = (expectedName: string) => show(expectedName, Selectors.SIDECAR_TITLE)

export const namespace = (expectedNamespace: string) => show(expectedNamespace, Selectors.SIDECAR_PACKAGE_NAME_TITLE)

export const kind = (expectedKind: string) => show(expectedKind, Selectors.SIDECAR_KIND)

const _mode = (expected: { mode: string; label?: string }) => async (app: Application) => {
  await app.client.waitUntil(async () => {
    const actualMode = `${Selectors.SIDECAR_MODE_BUTTON(expected.mode)}`
    await app.client.waitForVisible(actualMode)

    if (expected.label) {
      const actualLabel = await app.client.getText(actualMode)
      return actualLabel.toLowerCase() === expected.label.toLowerCase()
    } else {
      return true
    }
  })

  return app
}

export const modes = (expected: { mode: string; label?: string }[]) => async (app: Application) =>
  Promise.all(expected.map(_ => _mode(_)(app))).then(() => app)

export const textPlainContent = (content: string) => async (app: Application) => {
  await expectText(app, content)(Selectors.SIDECAR_CUSTOM_CONTENT)
  return app
}

export const yaml = (content: object) => async (app: Application) => {
  await app.client.waitUntil(async () => {
    const ok: boolean = await getValueFromMonaco(app).then(expectYAMLSubset(content, false))
    return ok
  })

  return app
}

export const showing = (
  expectedName: string,
  expectedActivationId?: string,
  expectSubstringMatchOnName?: boolean,
  expectedPackageName?: string,
  expectType?: string,
  waitThisLong?: number
) => async (app: Application) => {
  await app.client.waitUntil(
    async () => {
      // check selected name in sidecar
      return app.client
        .waitForVisible(`${Selectors.SIDECAR}${!expectType ? '' : '.entity-is-' + expectType}`)
        .then(() => app.client.waitForText(Selectors.SIDECAR_TITLE, timeout))
        .then(() => app.client.getText(Selectors.SIDECAR_TITLE))
        .then(name => {
          const nameMatches = expectSubstringMatchOnName
            ? name.indexOf(expectedName) >= 0 || expectedName.indexOf(name) >= 0
            : name === expectedName
          if (nameMatches) {
            if (expectedPackageName) {
              return app.client
                .getText(Selectors.SIDECAR_PACKAGE_NAME_TITLE)
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
    waitThisLong,
    `expect action name ${expectedName} in sidecar substringOk? ${expectSubstringMatchOnName}`
  )

  if (expectedActivationId) {
    await app.client.waitUntil(
      async () =>
        app.client
          .waitForText(Selectors.SIDECAR_ACTIVATION_TITLE, timeout)
          .then(() => app.client.getText(Selectors.SIDECAR_ACTIVATION_TITLE))
          .then(id => id === expectedActivationId),
      timeout,
      `expect activation id ${expectedActivationId} in sidecar`
    )
  }

  return app
}
