/*
 * Copyright 2017-2020 IBM Corporation
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

/**
 * This plugin introduces /wsk/activations/await command, which will
 * block until the previous invocation (emanating from the openwhisk
 * shell) completes
 *
 */

import Debug from 'debug'
import { Dict } from 'openwhisk'

import { Arguments, Registrar, MultiModalResponse } from '@kui-shell/core'

import { synonyms } from '../../models/synonyms'
import { Activation } from '../../models/resource'
import { asActivationResponse } from './as-activation'

const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL, 10) || 1000
const debug = Debug('plugins/openwhisk/cmds/activation/await')

/** was the given activation handled by the conductor */
const uuidPattern = /^[0-9a-f]{32}$/
const isConductorActivation = activation => {
  const yup = !(activation.activationId || activation).match(uuidPattern)
  debug('isConductorActivation', activation, yup)
  return yup
}

function handleComposer<T extends Dict>(
  { REPL, parsedOptions: options }: Arguments,
  activation: Activation<T>
): Promise<Activation<T>> {
  if (isConductorActivation(activation)) {
    debug('waiting for conductor activation')

    // then this is a conductor action, so delegate to await-app
    if (options.raw) {
      // caller asked for the raw session record, of the conductor
      return Promise.resolve(activation)
    } else {
      //
      // otherwise, user wants the actual return value of the composition
      //
      // since we have ready access to the name and path of the wrapper,
      //       pass it through, to avoid fetching it again in await-app
      //
      return REPL.qexec<Activation<T>>(`await-app ${activation.activationId}`)
    }
  } else {
    // otherwise, this is a normal activation, so return it to the user
    debug('waiting for openwhisk activation')
    return Promise.resolve(activation)
  }
}

/**
 * Fetch the activation record for a given activationId.
 *
 * We need to handle the case where the activation has not yet
 * been recorded... the inner fetchPoll loop deals with that
 *
 */
function fetch<T extends Dict>({ REPL }: Arguments, activationId: string): Promise<Activation<T>> {
  return new Promise((resolve, reject) => {
    const fetchPoll = () =>
      (isConductorActivation(activationId)
        ? REPL.qexec<Activation<T>>(`wsk session get ${activationId}`)
        : REPL.qexec<Activation<T>>(`wsk activation get ${activationId}`)
      )
        .then(resolve)
        .catch(err => {
          if (err && err.error && err.error.error === 'The requested resource does not exist.') {
            // the activation isn't even recorded, yet!
            debug('fetch needs to poll', activationId)
            setTimeout(() => fetchPoll(), POLL_INTERVAL)
          } else {
            reject(err)
          }
        })

    fetchPoll()
  })
}

/**
 * Check to see whether the given activation has completed
 *
 */
function poll<T extends Dict>(command: Arguments, activation: Activation<T>): Promise<Activation<T>> {
  return new Promise(resolve => {
    const iter = () => {
      if (activation.end || activation.response.status) {
        // then the activation has finished!
        debug('await complete')
        resolve(activation)
      } else {
        // otherwise, the activation is recorded, but not yet complete, so retry after some time
        debug('poll still waiting for completion', activation.activationId)
        setTimeout(
          () => fetch(command, activation.activationId).then(activation => poll(command, activation)),
          POLL_INTERVAL
        )
      }
    }
    iter()
  })
}

/**
 * If not given an activationId, then find one
 *
 */
const findActivationId = <T extends Dict>(command: Arguments, activationId?: string): Promise<string> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const { REPL, parsedOptions: options } = command

    if (activationId) {
      resolve(activationId)
    } else {
      if (options && options.remote) {
        // the user has requested that we ignore local history; so fetch the last activation from openwhisk
        return REPL.qexec<Activation<T>>(`wsk activation last`)
          .then(activation => poll(command, activation))
          .catch(reject)
      } else {
        reject(new Error('No recent activations to await'))
      }
    }
  })

/**
 * await command handler
 *
 */
async function doAwait<T extends Dict>(command: Arguments): Promise<MultiModalResponse<Activation<T>>> {
  const activationId = command.argvNoOptions[command.argvNoOptions.indexOf('await') + 1]

  const activation = await fetch<T>(command, await findActivationId(command, activationId))
  const finishedActivation = await poll<T>(command, activation)

  return asActivationResponse<T>(await handleComposer(command, finishedActivation))
}

/**
 * Register commands
 *
 */
export default (commandTree: Registrar) => {
  const opts = {
    usage: {
      docs: 'Wait until a previous activation completes (default: the last activation)'
    }
  }

  commandTree.listen(`/await`, doAwait, opts)
  synonyms('activations').map(syn => {
    commandTree.listen(`/wsk/${syn}/await`, doAwait, opts)
  })
}
