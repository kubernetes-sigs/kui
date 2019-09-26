/*
 * Copyright 2017-18 IBM Corporation
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
 * The plugin overrides the default invoke behavior, so that `invoke`
 * is synchronous. It introduces an `async` command that offers the
 * "wsk" CLI behavior of asynchronous invocation.
 *
 * This plugin ofers an example of override: note how it fits the
 * delegation pattern: it delegates to the underlying `invoke` plugin
 * to perform the actual invocation.
 *
 */

import * as Debug from 'debug'

import { Commands, REPL } from '@kui-shell/core'

import { actions } from '../openwhisk-usage'
import { synonyms } from '../../models/synonyms'

const debug = Debug('plugins/openwhisk/cmds/actions/invoke')

/**
 * Make a documentation struct
 *
 */
const docs = () => ({
  usage: actions.available.find(({ command }) => command === 'invoke')
})

/**
 * Fetch the full activation record from a partial one. Blocking
 * invokes, with the OpenWhisk API, give back a partial activation
 * record. One thing these partial records lack is logs.
 *
 */
const fetchActivation = partialActivation => REPL.qexec(`wsk activations await ${partialActivation.activationId}`)
const fetchFromError = error => {
  if (error['statusCode'] === 502) {
    // then this is a action error, display it as an activation failure
    return fetchActivation(error.error)
  } else {
    // then this is some user (i.e. tool user) error, rethrow the
    // exception so that the repl can display it
    throw error
  }
}

/**
 *
 *
 */
const respond = (options: Commands.ParsedOptions) => response => {
  debug('responding to caller', response)

  if (options.quiet) {
    return true
  } else {
    if (options.result || options.r) {
      return response.response.result
    } else {
      return response
    }
  }
}

/**
 * This is the command impl for synchronous invocation. We add `-b` if
 * it isn't already on the command argv; this tells the underlying
 * impl to perform a blocking invocation.
 *
 */
const doInvoke = (rawInvoke: Commands.CommandHandler) => (opts: Commands.Arguments) => {
  if (!opts.argv.find(opt => opt === '-b' || opt === '-r' || opt === '--blocking' || opt === '--result')) {
    // doInvoke means blocking invoke, so make sure that the argv
    // indicates that we want a blocking invocation
    opts.argv.push('-b')
    opts.command = opts.command.slice(0) + ' -b' // clone it, via slice, to avoid contaminating command history
  }

  const options = opts.parsedOptions

  // for now, strip off -r,as we need the activationId. revisit this
  // later, if necessary; it's preserved in the options variable,
  // and the respond method will handle the -r there. hopefully this
  // is good enough [NMM 20170922]
  opts.argv = opts.argv.filter(_ => _ !== '-r' && _ !== '--result' && _ !== '-br' && _ !== '-rb')
  // do the invocation, then fetch the full activation record
  // (blocking invokes return incomplete records; no logs)
  return Promise.resolve(rawInvoke(opts))
    .then(fetchActivation, fetchFromError)
    .then(respond(options))
    .catch(error => Promise.reject(error))
}

/**
 * This is the command impl for asynchronous invocation. We reuse the
 * underlying invoke impl, and so there is a bit of rejiggering so
 * that command history shows `async`, but the underlying impl sees
 * `invoke.
 *
 */
const doAsync = (rawInvoke: Commands.CommandHandler) => (opts: Commands.Arguments) => {
  const idx = opts.argv.findIndex(arg => arg === 'async')
  opts.argv[idx] = 'invoke'
  opts.command = opts.command.slice(0).replace(/^async/, 'invoke') // clone it, via slice, to avoid contaminating command history
  return Promise.resolve(rawInvoke(opts))
    .then(_ => Object.assign(_, { verb: 'async' }))
    .catch((error: Error) => Promise.reject(error))
}

/**
 * Here is the module. It registers command handlers, and finds the
 * delegate, i.e. the underlying invoke impl.
 *
 */
export default async (commandTree: Commands.Registrar) => {
  const rawInvoke = await commandTree.find('/wsk/action/invoke') // this is the command impl we're overriding, we'll delegate to it
  const rawHandler = rawInvoke.$
  const syncInvoke = doInvoke(rawHandler) // the command handler for sync invokes
  const asyncInvoke = doAsync(rawHandler) //             ... and for async

  synonyms('actions').map(syn => {
    const invokeOpts = docs()
    const asyncOpts = {
      usage: Object.assign({}, invokeOpts.usage, {
        command: 'async',
        strict: 'async',
        title: 'Async Invoke',
        header: 'Invoke an action asynchronously'
      })
    }

    commandTree.listen(`/wsk/${syn}/invoke`, syncInvoke, invokeOpts)
    commandTree.listen(`/wsk/${syn}/async`, asyncInvoke, asyncOpts)
  })
}
