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
import * as assert from 'assert'
import { Application } from 'spectron'
import { safeLoad } from 'js-yaml'

import * as Selectors from './selectors'
import * as CLI from './cli'

export interface AppAndCount {
  app: Application
  count: number
}

/**
 * subset means that it is ok for struct1 to be a subset of struct2
 * so: every key in struct1 must be in struct2, but not vice versa
 *
 */
const sameStruct = (struct1: Record<string, any>, struct2: Record<string, any>, subset = false): boolean => {
  if (struct1 === struct2) {
    return true
  } else if (typeof struct1 !== typeof struct2) {
    return false
  }

  for (const key in struct1) {
    if (!(key in struct2)) {
      console.log(`!(${key} in struct2)`)
      return false
    } else if (typeof struct1[key] === 'function') {
      // then we have a validator function
      if (!struct1[key](struct2[key])) {
        return false
      }
    } else if (typeof struct1[key] !== typeof struct2[key]) {
      console.log(`typeof struct1[${key}] !== typeof struct2[${key}] ${typeof struct1[key]} ${typeof struct2[key]}`)
      return false
    } else if (typeof struct1[key] === 'object') {
      if (!sameStruct(struct1[key], struct2[key], subset)) {
        return false
      }
    } else if (struct1[key] !== struct2[key]) {
      console.log(`struct1[${key}] !== struct2[${key}] ${struct1[key]} ${struct2[key]}`)
      return false
    }
  }
  // if struct1 if expected to be a subset of struct2, then we're done
  if (subset) return true

  for (const key in struct2) {
    if (!(key in struct1)) {
      console.log(`!(${key} in struct1)`)
      return false
    } else if (typeof struct1[key] === 'function') {
      // then we have a validator function
      if (!struct1[key](struct2[key])) {
        return false
      }
    } else if (typeof struct1[key] !== typeof struct2[key]) {
      console.log(`typeof struct1[${key}] !== typeof struct2[${key}] ${typeof struct1[key]} ${typeof struct2[key]}`)
      return false
    } else if (typeof struct2[key] === 'object') {
      if (!sameStruct(struct1[key], struct2[key], subset)) {
        return false
      }
    } else if (struct1[key] !== struct2[key]) {
      console.log(`struct1[${key}] !== struct2[${key}] ${struct1[key]} ${struct2[key]}`)
      return false
    }
  }
  return true
}

export const expectSubset = (struct1: object, failFast = true) => (str: string) => {
  try {
    const ok = sameStruct(struct1, JSON.parse(str), true)
    if (failFast) {
      assert.ok(ok)
    }
    return true
  } catch (err) {
    console.error('Error comparing subset for actual value=' + str)
    throw err
  }
}

/** is the given struct2 the same as the given struct2 (given as a string) */
export const expectStruct = (struct1: object, noParse = false, failFast = true) => (str: string) => {
  try {
    const ok = sameStruct(struct1, noParse ? str : JSON.parse(str))
    if (failFast) {
      assert.ok(ok)
    }
    return ok
  } catch (err) {
    console.error('Error comparing structs for actual value=' + str)
    throw err
  }
}

export const expectYAML = (struct1: object, subset = false, failFast = true) => (str: string) => {
  try {
    const struct2 = safeLoad(str)
    const ok = sameStruct(struct1, struct2, subset)
    if (failFast) {
      assert.ok(ok)
    }
    return ok
  } catch (err) {
    if (failFast) {
      return false
    } else {
      console.error('Error comparing subset for actual value=' + str)
      throw err
    }
  }
}

export const expectYAMLSubset = (struct1: object, failFast = true) => expectYAML(struct1, true, failFast)

/** is the given actual array the same as the given expected array? */
export const expectArray = (expected: Array<string>, failFast = true, subset = false) => (
  actual: string | Array<string>
) => {
  if (!Array.isArray(actual)) {
    // webdriver.io's getText will return a singleton if there is only one match
    actual = [actual]
  }

  const matchFn = function(u: string, i: number) {
    return u === expected[i]
  }

  const ok = !subset ? actual.length === expected.length && actual.every(matchFn) : actual.some(matchFn)

  if (!ok) {
    console.error(`array mismatch; expected=${expected} actual=${actual}`)
  }

  if (failFast) {
    assert.ok(ok)
  } else {
    return ok
  }
}

/** get the monaco editor text */
export const getValueFromMonaco = async (app: Application, prefix = '') => {
  const editor = '.monaco-editor-wrapper'
  const selector = prefix ? `${prefix} ${editor}` : editor
  try {
    await app.client.waitForExist(selector, CLI.waitTimeout)
  } catch (err) {
    console.error('cannot find editor', err)
    await app.client.getHTML(Selectors.SIDECAR).then(html => {
      console.log('here is the content of the sidecar:')
      console.log(html)
    })
    throw err
  }

  return app.client
    .execute(selector => {
      try {
        return document.querySelector(selector)['editor'].getValue()
      } catch (err) {
        console.error('error in getValueFromMonaco1', err)
        // intentionally returning undefined
      }
    }, selector)
    .then(_ => _.value)
}

export const waitForXtermInput = (app: Application, N: number) => {
  const selector = `${Selectors.PROMPT_BLOCK_N(N)} .xterm-helper-textarea`
  return app.client.waitForExist(selector)
}

export const expectText = (app: Application, expectedText: string) => async (selector: string) => {
  const actualText = await app.client.getText(selector)
  assert.strictEqual(actualText, expectedText)
}
