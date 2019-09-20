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

import UsageError from '../core/usage-error'

export interface CodedError extends Error {
  code?: number
  statusCode?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: string | Record<string, any>
}

export function isCodedError(err: Error): err is CodedError {
  const error = err as CodedError
  return !!(UsageError.isUsageError(err) || error.code || error.statusCode)
}
