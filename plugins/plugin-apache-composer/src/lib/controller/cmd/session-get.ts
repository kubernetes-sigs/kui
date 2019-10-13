/*
 * Copyright 2018-19 IBM Corporation
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

import { Commands } from '@kui-shell/core'
import { Activation, ActivationListTable, synonyms } from '@kui-shell/plugin-openwhisk'

import { sessionGet } from '../../utility/usage'
import * as view from '../../view/entity-view'

export default async (commandTree: Commands.Registrar) => {
  commandTree.listen(
    `/wsk/session/result`,
    ({ command, REPL }) => {
      return REPL.qexec<Activation>(command.replace('session result', 'activation get')).then(
        result => result.response.result
      )
    },
    { usage: sessionGet('result') }
  )

  /* command handler for session get */
  commandTree.listen(
    `/wsk/session/get`,
    args => {
      const { command, parsedOptions, REPL } = args

      if (parsedOptions.last || parsedOptions['last-failed']) {
        return REPL.qexec<ActivationListTable>('wsk activation list --limit 200')
          .then(activations => activations.body)
          .then(activations => {
            return activations.find(activation => {
              if (
                activation.annotations &&
                activation.annotations.find(({ key, value }) => key === 'conductor' && value)
              ) {
                // find session
                if (parsedOptions['last-failed']) {
                  // handle 'session get --last-failed'
                  if (activation.statusCode !== 0) {
                    if (typeof parsedOptions['last-failed'] === 'string') {
                      // handle 'session get --last-failed [appName]'
                      if (activation.name === parsedOptions['last-failed']) return activation
                    } else {
                      return activation // handle 'session get --last'
                    }
                  }
                } else {
                  // handle 'session get --last'
                  if (typeof parsedOptions.last === 'string') {
                    if (activation.name === parsedOptions.last) return activation // handle 'session get --last [appName]'
                  } else {
                    return activation // handle 'session get --last'
                  }
                }
              }
            })
          })
          .then(activation => {
            return REPL.qexec(`wsk session get ${activation.activationId}`)
          })
          .catch(err => err)
      } else {
        return REPL.qexec(command.replace('session', 'activation'))
      }
    },
    { usage: sessionGet('get') }
  )

  // override wsk activation get
  const activationGet = (await commandTree.find('/wsk/activation/get')).$
  synonyms('activations').forEach(syn => {
    commandTree.listen(
      `/wsk/${syn}/get`,
      opts => {
        if (!activationGet) {
          return Promise.reject(new Error())
        }
        const last = opts.parsedOptions.last

        if (last) {
          return opts.REPL.qexec<ActivationListTable>(
            `wsk activation list --limit 1` + (typeof last === 'string' ? ` --name ${last}` : '')
          )
            .then(activations => activations.body)
            .then(activations => {
              if (activations.length === 0) {
                throw new Error('No such activation found')
              } else {
                return opts.REPL.qexec<Activation>(`wsk activation get ${activations[0].activationId}`)
              }
            })
        }

        return Promise.resolve(activationGet(opts))
          .then(response => view.formatSessionGet(opts, response))
          .catch(err => {
            throw err
          })
      },
      {}
    )
  })
}
