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

import Debug from 'debug'

import { isHeadless, Table, Row, Arguments, Registrar } from '@kui-shell/core'

import { OpenWhiskResource } from '../../models/resource'

const debug = Debug('plugins/openwhisk/cmds/wipe')

/**
 * This plugin introduces /wsk/wipe, which helps with removing all
 * entities from the current namespace. It also demonstrates the
 * prompt function of the repl.
 *
 */

/**
 * Log a message, then call the given function
 *
 */
const logThen = (f: () => Promise<void>) => (msg: string) => {
  debug(`retry ${msg}`)
  return f()
}

/**
 * Delete all of the entities in the given `entities` array
 *
 */
const deleteAllOnce = async ({ REPL }: Arguments, entities: OpenWhiskResource[]): Promise<void> => {
  await Promise.all(
    entities.map(entity => {
      const tryDelete = async () => {
        await REPL.qexec(
          `wsk ${entity.kind.toLowerCase()} delete "/${entity.metadata.namespace}/${entity.metadata.name}"`
        )
      }

      // with retries...
      return tryDelete()
        .catch(err => {
          if (err.statusCode === 404) {
            // ignore 404s, since we're deleting
            debug('concurrent deletion')
          } else {
            throw err
          }
        })
        .catch(logThen(tryDelete))
        .catch(logThen(tryDelete))
        .catch(logThen(tryDelete))
        .catch(logThen(tryDelete))
        .catch(logThen(tryDelete))
        .catch(logThen(tryDelete))
        .catch(logThen(tryDelete))
        .catch(logThen(tryDelete))
    })
  )
}

/**
 * List the entities of a given entity type (e.g. actions)
 *
 */
async function list({ REPL }: Arguments, type: string): Promise<OpenWhiskResource[]> {
  const L = await REPL.qexec<Table<Row & OpenWhiskResource>>(`wsk ${type} list --limit 200`)
  return L.body
}

/**
 * Because we can only list at most 200 entities at a time, we'll need to loop...
 *
 */
const deleteAllUntilDone = (command: Arguments, type: string) => (entities: OpenWhiskResource[]) => {
  debug(`deleteAllUntilDone ${type} ${entities.length}`)

  if (entities.length === 0) {
    return Promise.resolve(true)
  } else {
    return deleteAllOnce(command, entities)
      .then(() => list(command, type))
      .then(deleteAllUntilDone(command, type))
  }
}

/**
 * This method initiates the deleteAllUntilDone loop
 *
 */
const clean = (command: Arguments, type: string, quiet?: boolean) => {
  if (!quiet) {
    if (isHeadless()) {
      process.stdout.write('.'['random'])
    } else {
      debug(`Cleaning ${type}`)
    }
  }
  return list(command, type).then(deleteAllUntilDone(command, type))
}

/**
 * Handle 404s with a retry of the given operation
 *
 */
const handle404s = (retry: () => void) => err => {
  if (err.statusCode === 404) {
    // ignore 404s, since we're deleting!
    return retry()
  } else {
    console.error(err)
    throw err
  }
}

/**
 * The main wipe method: clean triggers and actions, then rules and packages
 *
 */
const doWipe1 = (command: Arguments, quiet = false) =>
  Promise.all([clean(command, 'trigger', quiet), clean(command, 'action', quiet)]).catch(
    handle404s(() => doWipe1(command, true))
  )

const doWipe2 = (command: Arguments, quiet = false) =>
  Promise.all([clean(command, 'rule', quiet), clean(command, 'package', quiet)]).catch(
    handle404s(() => doWipe2(command, true))
  )

const doWipe = (command: Arguments) =>
  doWipe1(command)
    .then(() => doWipe2(command))
    .then(() => {
      if (isHeadless()) {
        // we did process.stdout.write above, so clear a newline
        console.log('.'['random'])
      }
    })

const doWipeWithConfirmation = async (command: Arguments) => {
  return command.REPL.qexec(`confirm "${command.command.replace(/^(wsk\s+)?wipe/, 'wsk _wipe')}"`)
}

/**
 * This is the exported module
 *
 */
export default (registrar: Registrar) => {
  registrar.listen('/wsk/wipe', doWipeWithConfirmation, {
    docs: 'Remove all of your OpenWhisk assets from the current namespace'
  })

  registrar.listen('/wsk/_wipe', doWipe, {
    hidden: true
  })
}
