/*
 * Copyright 2020 The Kubernetes Authors
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

import { KResponse, UsageError, isXtermErrorResponse } from '..'

type CustomError = { name: string; message: string }
type ErrorLike = Error | CustomError

function isCustomError(response: KResponse): response is CustomError {
  const err = response as CustomError
  return err && typeof err === 'object' && typeof err.name === 'string' && typeof err.message === 'string'
}

export default function isError(response: unknown): response is ErrorLike {
  return (
    response &&
    (response.constructor === Error ||
      response.constructor === UsageError ||
      isXtermErrorResponse(response) ||
      Object.getPrototypeOf(response).constructor === Error ||
      isCustomError(response))
  )
}
