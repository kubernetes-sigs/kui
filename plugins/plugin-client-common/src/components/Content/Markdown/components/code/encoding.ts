/*
 * Copyright 2022 The Kubernetes Authors
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

import { CodeBlockResponse } from '.'
import { isCodedError, isWatchable } from '@kui-shell/core'

function stringifyError(response: Error) {
  return { code: isCodedError(response) ? response.code : 1, message: response.message }
}

/** Blunt attempt to avoid serializing React bits */
function reactRedactor(key: string, value: any) {
  if (key === 'tab') {
    return undefined
  } else if (key === 'block') {
    return undefined
  } else if (value && typeof value === 'object' && value.constructor === Error) {
    // the first check guards against typeof null === 'object'
    return stringifyError(value)
  } else {
    return value
  }
}

export default function encodePriorResponses(responses: CodeBlockResponse[]): string {
  return JSON.stringify(
    responses.map(response => {
      if (typeof response === 'undefined') {
        return response
      } else if (response.response.constructor === Error) {
        return Object.assign({}, response, { response: stringifyError(response.response) })
      } else if (isWatchable(response.response)) {
        delete response.response.watch
      }
      return response
    }),
    reactRedactor
  )
}
