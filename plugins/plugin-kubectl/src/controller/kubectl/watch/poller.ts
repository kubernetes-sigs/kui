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

import Debug from 'debug'
import { CodedError, Arguments } from '@kui-shell/core'

import fqn from '../fqn'
import { KubeOptions } from '../options'
import { KubeResource } from '../../../lib/model/resource'

const debug = Debug('plugin-kubeui/controller/watch/poller')

// we scale this up over time; i.e. poll less frequently as we
// continue to wait; see the setTimeout call just below
const sleepTime = 1000

/**
 * A kubectl --watch will never issue a message for the final
 * termination of a resource. Hence, after seeing "Terminating", we
 * need to poll until we get a 404 back from the apiserver. This is
 * the best way we know, for now, of knowing "Terminated".
 *
 */
export default function pollUntil404(
  apiVersion: string,
  kind: string,
  name: string,
  namespace: string,
  offline: (rowKey: string) => void,
  { REPL }: Arguments<KubeOptions>,
  command: string
) {
  let done = false
  let currentTimeout: NodeJS.Timeout

  const poll = (iter = 0) => {
    // we don't need to fetch anything, really; the KIND custom column
    // is just my idea of something very lightweight to fetch, so that
    // we can see if we get a 404 back
    const cmd = `${command} get ${fqn(apiVersion, kind, name, namespace)} -o custom-columns=KIND:.kind`
    debug('poll for termination', cmd)
    REPL.qexec<KubeResource>(cmd)
      .then(() => {
        if (!done) {
          // here is where we ladder up the sleepTime
          const thisSleepTime =
            iter < 5 ? sleepTime : iter < 10 ? sleepTime * 2 : iter < 20 ? sleepTime * 4 : sleepTime * 10

          // go to sleep now
          currentTimeout = setTimeout(() => poll(iter + 1), thisSleepTime)
        }
      })
      .catch((err: CodedError) => {
        // TODO what should we do for non-404 errors in the UI? right
        // now, this code will indicate the resource as Offline. is
        // that right??
        // console.error('!! poll done', err.code)
        offline(name)
        if (err.code !== 404) {
          console.error('unexpected error in pollUntil404', err)
        }
      })
  }

  // initiate the poller
  poll()

  return {
    abort: () => {
      // stop the poller
      done = true
      if (currentTimeout) {
        clearTimeout(currentTimeout)
      }
    }
  }
}
