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

import Debug from 'debug'

import { Commands, Errors } from '@kui-shell/core'
import { ActivationListTable } from '@kui-shell/plugin-openwhisk'

import { sessionList } from '../../utility/usage'

const debug = Debug('plugins/apache-composer/cmd/session-list')

interface ListOptions extends Commands.ParsedOptions {
  name?: string
  count?: number
  limit?: number
  skip?: number
  'scan-limit'?: number
}

export default async (commandTree: Commands.Registrar) => {
  const sessionSyns = ['sessions', 'sess', 'ses', 'session']

  /* command handler for session list */
  sessionSyns.forEach(noun => {
    commandTree.listen(
      `/wsk/${noun}/list`,
      async ({
        argvNoOptions,
        parsedOptions,
        REPL
      }: Commands.Arguments<ListOptions>): Promise<ActivationListTable | number> => {
        const limit = parsedOptions.limit === undefined ? 10 : parsedOptions.limit // limit 10 sessions in session list if users didn't specify --limit
        const skip = parsedOptions.skip || 0 // skip 0 sessions in session list by default if users didn't specify --skip
        const scanLimit = parsedOptions['scan-limit']

        // degenerate cases for options
        if (limit === 0 || scanLimit === 0) return { body: [], type: 'session' }

        const nameOption = parsedOptions.name // e.g. session list --name [session name]
        const nameSpecify =
          argvNoOptions.indexOf('list') === argvNoOptions.length - 2 ? argvNoOptions[argvNoOptions.length - 1] : '' // e.g. session list [session name]

        if (nameOption && nameSpecify && nameOption !== nameSpecify) {
          debug('inconsistent name:', nameSpecify, nameSpecify)
          throw new Errors.UsageError('You provided two different session names')
        }

        const name = nameOption || nameSpecify || ''

        // find sessions in activation list
        const findSessions = async (skip = 0, name = '', limit = 20) => {
          return REPL.qexec<ActivationListTable>(`wsk activation list "${name}" --skip ${skip} --limit ${limit}`)
            .then(activations => {
              // filter activations to find session
              debug('finding sessions in activation list', activations)
              return activations.body.filter(activation => {
                if (
                  activation &&
                  activation.annotations &&
                  activation.annotations.find(({ key, value }) => key === 'conductor' && value)
                ) {
                  debug('found a session', activation)
                  activation.sessionId = activation.activationId // indicate the entity is session
                  return activation
                }
              })
            })
            .catch(err => err)
        }

        if (scanLimit) {
          const max = await REPL.qexec<number>('wsk activation count') // get the number of total activations
          let foundSessions = []
          for (let scanned = 0; scanned < max && foundSessions.length < scanLimit; scanned += 200) {
            const sessions = await findSessions(scanned, name, 200)
            foundSessions = foundSessions.concat(sessions)
          }

          return parsedOptions.count
            ? foundSessions.slice(skip, scanLimit + skip).length
            : { body: foundSessions.slice(skip, scanLimit + skip), type: 'session' }
        } else {
          return findSessions(0, name, 200) // always trying to find sessions in the latest 20 activations
            .then(foundSessions =>
              parsedOptions.count
                ? foundSessions.slice(skip, limit + skip).length
                : { body: foundSessions.slice(skip, limit + skip), type: 'session' }
            )
            .catch(err => err)
        }
      },
      { usage: sessionList }
    )
  })
}
