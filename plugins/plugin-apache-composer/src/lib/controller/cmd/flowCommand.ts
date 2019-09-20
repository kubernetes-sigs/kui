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

import * as Debug from 'debug'

import * as repl from '@kui-shell/core/core/repl'
import { CodedError } from '@kui-shell/core/models/errors'
import { CommandRegistrar } from '@kui-shell/core/models/command'

import { astAnnotation } from '../../utility/ast'

const usage = {
  strict: 'flow',
  title: 'flow visualization',
  header: 'Render a visualization of the flow taken by a given session',
  example: 'session flow <sessionId>',
  required: [{ name: 'sessionId', docs: 'a session ID' }],
  parents: ['composer', { command: 'composer session' }]
}

const debug = Debug('plugins/apache-composer/session-flow')

/**
 * Get an activation
 *
 */
const get = (activationId: string) =>
  new Promise((resolve, reject) => {
    const once = (retryCount: number) =>
      repl
        .qexec(`wsk activation get ${activationId}`)
        .then(resolve)
        .catch((err: CodedError) => {
          if (err && err.statusCode === 404 && retryCount < 10) {
            setTimeout(() => once(retryCount + 1), 100)
          } else {
            reject(err)
          }
        })
    once(0)
  })

/**
 * Fetch the action itself, so we have the AST
 *
 */
const fetchTheAction = session => {
  const path = session.annotations.find(({ key }) => key === 'path').value

  return repl.qexec(`wsk action get "/${path}"`).catch(err => {
    console.error('action get call incomplete due to error', path, err.message)
    return { wskflowErr: err }
  })
}

/**
 * Fetch the rest of the activations in the trace; fetch at most 2 at a time
 *
 */
const generatePromises = activation =>
  function*() {
    // generator function
    for (let idx = 0; idx < activation.logs.length; idx++) {
      yield get(activation.logs[idx]) // yield generates one value
    }
  }
// by default, PromisePool does not return any arguments in then, causing activations to always be undefined
// use event listeners here to access return data as described in the docs
const fetchTrace = activation =>
  new Promise(resolve => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PromisePool = require('es6-promise-pool')

    const data = []
    const pool = new PromisePool(generatePromises(activation), 2) // at most 2 at a time, here

    pool.addEventListener('fulfilled', event => data.push(event.data.result))
    pool.addEventListener('rejected', event => data.push(event.data.error))

    pool.start().then(() => resolve(data))
  })

export default (commandTree: CommandRegistrar) => {
  // register the "session flow" command
  commandTree.listen(
    '/wsk/session/flow',
    ({ tab, argvNoOptions }) => {
      const sessionId = argvNoOptions[argvNoOptions.indexOf('flow') + 1]
      debug('session flow', sessionId)

      // fetch the session, then fetch the trace (so we can show the flow) and action (to get the AST)
      return repl
        .qexec(`wsk session get ${sessionId}`)
        .then(session => Promise.all([session, fetchTrace(session), fetchTheAction(session)]))
        .then(async ([session, activations, action]) => {
          let ast
          if (action.wskflowErr) {
            // 1) if an app was deleted, the last promise item returns an error
            const error = new Error(`Sorry, this view is not available, as the composition was deleted`)
            error['code'] = 404
            throw error
          } else {
            // extract the AST
            const astAnno = astAnnotation(action)
            if (!astAnno) {
              const error = new Error(`Sorry, this view is not available, as the composition was improperly created`)
              error['code'] = 404
              throw error
            }
            ast = astAnno && astAnno.value
          }

          const { visualize, zoomToFitButtons } = await import('@kui-shell/plugin-wskflow')
          const { view, controller } = await visualize(tab, ast, undefined, undefined, undefined, activations)

          // set the default mode to session flow
          session.modes.find(({ defaultMode }) => defaultMode).defaultMode = false
          session.modes.find(({ label }) => label === 'Session Flow').defaultMode = true

          if (!session.modes.find(({ label }) => label === '1:1')) {
            zoomToFitButtons(controller).forEach(_ => session.modes.push(_))
          }

          return Object.assign(session, {
            viewName: session.type,
            type: 'custom',
            content: view,
            isEntity: true
          })
        })
    },
    { usage }
  )
}
