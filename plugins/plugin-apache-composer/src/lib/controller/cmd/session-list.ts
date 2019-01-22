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
import { sessionList } from '../../utility/usage'
import * as repl from '@kui-shell/core/core/repl'
import UsageError from '@kui-shell/core/core/usage-error'
import * as Debug from 'debug'
const debug = Debug('plugins/apache-composer/cmd/session-list')

export default async (commandTree, prequire) => {
  const sessionSyns = ['sessions', 'sess', 'ses', 'session']
  /* command handler for session list*/
  sessionSyns.forEach(noun => {
    commandTree.listen(`/wsk/${noun}/list`, async ({ argvNoOptions, parsedOptions }) => {
      if (parsedOptions.limit === 0 || parsedOptions['scan-limit'] === 0) return []

      const queryParameters = ['limit', 'skip', 'scan-limit']
      queryParameters.forEach(parameter => {
        if (parsedOptions[parameter] !== undefined && (!Number.isInteger(parsedOptions[parameter]) || parsedOptions[parameter] < 0)) {
          throw new UsageError(`The query parameter ${parameter} was malformed:\nThe value '${parsedOptions[parameter]}' is not an integer for sessions.`)
        }
      })

      let nameOption: string = parsedOptions.name // e.g. session list --name [session name]
      let nameSpecify: string = argvNoOptions.indexOf('list') === argvNoOptions.length - 2 ? argvNoOptions[argvNoOptions.length - 1] : '' // e.g. session list [session name]

      if (nameOption && nameSpecify && (nameOption !== nameSpecify)) {
        debug('inconsistent name:', nameSpecify, nameSpecify)
        throw new UsageError('You provided two different session names')
      }

      const name = nameOption || nameSpecify || ''
      const limit: number = parsedOptions.limit || 10  // we limit 10 sessions in session list if users didn't specify --limit
      const skip: number = parsedOptions.skip || 0  // we skip 0 sessions in session list by default if users didn't specify --skip

      // find sessions in activation list
      const findSessions = (skip = 0, name = '', limit = 20) => {
        return repl.qfexec(`activation list ${name} --skip ${skip} --limit ${limit}`)
          .then(activations => { // filter activations to find session
            debug('finding sessions in activation list', activations)
            return activations.filter(activation => {
              if (activation && activation.annotations && activation.annotations.find(({ key, value }) => key === 'conductor' && value)) {
                debug('found a session', activation)
                activation.sessionId = activation.activationId // indicate the entity is session
                return activation
              }
            })
          })
          .catch(err => err)
      }

      if (parsedOptions['scan-limit']) {
        const max = await repl.qexec('wsk activation count')  // get the number of total activations
        let foundSessions = []
        for (let scanned = 0; scanned < max && foundSessions.length < parsedOptions['scan-limit']; scanned += 200) {
          try {
            foundSessions = foundSessions.concat(await findSessions(scanned, name, 200))
          } catch (err) {
            throw err
          }
        }
        return parsedOptions.count ? foundSessions.slice(skip, parsedOptions['scan-limit'] + skip).length : foundSessions.slice(skip, parsedOptions['scan-limit'] + skip)
      } else {
        return findSessions(0, name, 20) // always trying to find sessions in the latest 20 activations
          .then(foundSessions => parsedOptions.count ? foundSessions.slice(skip, limit + skip).length : foundSessions.slice(skip, limit + skip))
          .catch(err => err)
      }
    }, { usage: sessionList })
  })

}
