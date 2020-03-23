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

import Debug from 'debug'
const debug = Debug('k8s/util/retry')

import { CodedError } from '@kui-shell/core'

export const withRetryOnCode = (code: number) => <T>(fn: () => Promise<T>, cmd: string): Promise<T> =>
  new Promise((resolve, reject) => {
    const iter = async () => {
      try {
        resolve(await fn())
      } catch (err) {
        if (err.code === code) {
          debug('retrying', cmd)
          setTimeout(iter, 5000)
        } else {
          debug('rejecting', err.code, err)
          reject(err)
        }
      }
    }

    iter()
  })

export const withOkOnCode = (code: number) => <T>(fn: () => Promise<T>, cmd: string): Promise<void | T> =>
  fn().catch((err: CodedError) => {
    if (err.code === code) {
      debug('404 ok', cmd)
    } else {
      throw err
    }
  })

export const withOkOn404 = withOkOnCode(404)
export const withRetryOn404 = withRetryOnCode(404)
