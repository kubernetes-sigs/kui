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

import { UsageError, UsageRow } from '../core/usage-error'

export interface CodedError<Code = number> extends Error {
  hide?: boolean
  code?: Code
  statusCode?: number
  partialMatches?: UsageRow[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: string | Record<string, any>
}

export function isCodedError<Code = number>(err: string | object | Error): err is CodedError<Code> {
  const error = err as CodedError<Code>
  return !!(UsageError.isUsageError(err) || error.code !== undefined || error.statusCode !== undefined)
}

export function is404<Code = number>(err: string | object | Error): err is CodedError<404> {
  const error = err as CodedError<404>
  return !!(error.code === 404 || error.statusCode === 404)
}

export function is409<Code = number>(err: string | object | Error): err is CodedError<409> {
  const error = err as CodedError<409>
  return !!(error.code === 409 || error.statusCode === 409)
}

export function is404or409<Code = number>(err: string | object | Error): err is CodedError<404 | 409> {
  const error = err as CodedError<404 | 409>
  const code = error.code || error.statusCode
  return code === 404 || code === 409
}
