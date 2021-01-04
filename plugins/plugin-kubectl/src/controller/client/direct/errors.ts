/*
 * Copyright 2020 IBM Corporation
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

import { CodedError, isCodedError, REPL } from '@kui-shell/core'

import URLFormatter from './url'
import { Status, isStatus } from '../../../lib/model/resource'
import { fetchFile, FetchedFile, isReturnedError } from '../../../lib/util/fetch-file'

type WithErrors = { errors: CodedError[]; ok: (string | Buffer | object)[] }

/** See if the given error message is a Kubernetes Status object */
function tryParseAsStatus(message: string): string | Status {
  try {
    const obj = JSON.parse(message)
    if (isStatus(obj)) {
      return obj
    } else {
      return message
    }
  } catch (err) {
    return message
  }
}

export default async function handleErrors(
  responses: FetchedFile[],
  formatUrl: URLFormatter,
  kind: string,
  repl: REPL
): Promise<WithErrors> {
  const withErrors: (string | Buffer | object | CodedError)[] = await Promise.all(
    responses.map(async data => {
      let errorData = isReturnedError(data) ? tryParseAsStatus(data.error.message) : isStatus(data) ? data : undefined
      if (errorData) {
        if (isStatus(errorData)) {
          // if we could not find the requested resource, do some
          // backup checks, e.g. to see if the namespace and kind
          // actually exist
          if (errorData.code === 404 && kind !== 'Namespace') {
            // double check that the kind and namespace exist
            const nsUrl = formatUrl(false)
            const kindUrl = formatUrl(true) + '?limit=1'

            const opts = { headers: { accept: 'application/json' } }
            const [nsData, kindData] = await Promise.all([
              fetchFile(repl, nsUrl, opts)
                .then(_ => _[0])
                .catch(err => JSON.parse(err.message)),
              fetchFile(repl, kindUrl, opts)
                .then(_ => _[0])
                .catch(err => JSON.parse(err.message))
            ])

            // kubectl seems to report kind non-existence in preference to namespace non-existence
            if (isStatus(kindData)) {
              // kind fetch failure; kubectl uses a slightly different error message here. sigh.
              const error: CodedError = new Error(`error: the server doesn't have a resource type "${kind}"`)
              error.code = 404
              return error
            } else if (isStatus(nsData)) {
              // namespace fetch failure
              errorData = nsData
            }
          }

          const error: CodedError = new Error(`Error from server (${errorData.reason}): ${errorData.message}`)
          error.code = errorData.code
          return error
        } else {
          // some other random error, i.e. not a Kubernetes Status error
          const error: CodedError = new Error(errorData)
          error.code = 500
          return error
        }
      }

      return data
    })
  )

  if (withErrors.every(isCodedError)) {
    // we didn't get a single good response back
    const error: CodedError = new Error(withErrors.map(_ => _.message).join('\n'))
    error.code = withErrors[0].code
    throw error
  } else {
    const init: WithErrors = { errors: [] as CodedError[], ok: [] as (string | Buffer | object)[] }
    return withErrors.reduce<WithErrors>((pair, data) => {
      if (isCodedError(data)) {
        pair.errors.push(data)
      } else {
        pair.ok.push(data)
      }

      return pair
    }, init)
  }
}
