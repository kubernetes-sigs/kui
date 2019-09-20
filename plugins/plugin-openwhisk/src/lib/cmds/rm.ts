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
 * This plugin introduces an rm command under all of the entity trees,
 * e.g. /wsk/actions/rm and /wsk/rules/rm. It augments the delete API
 * of OpenWhisk to offer wildcard deletion; e.g.
 *
 *   rm foo bar
 *   rm foo* bar
 *
 */

import * as minimist from 'yargs-parser'

import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'
import { Table } from '@kui-shell/core/webapp/models/table'
import { currentSelection } from '@kui-shell/core/webapp/views/sidecar'
import * as repl from '@kui-shell/core/core/repl'

import { synonyms } from '../models/synonyms'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isAnonymousLet } = require('./actions/let-core')

/** sum of numbers in an array */
// const arraySum = A => A.reduce((sum, c) => sum + c, 0)
const flatten = A => [].concat(...A)

/**
 * Report an error, then return the given value
 *
 */
const errorThen = val => err => {
  console.error(err)
  return val
}

/** here is the module */
export default async (commandTree: CommandRegistrar) => {
  /**
   * Given a package name and an entity within that package, return the fully qualified name of the entity
   *
   */
  const reify = (pckage, field) => {
    const entities = pckage[field]
    if (entities) {
      return entities.map(entity => `${pckage.name}/${entity.name}`)
    }
  }

  /** Recursive removal helpers */
  const rmHelper = type => entities => {
    if (!entities || entities.length === 0) {
      return Promise.resolve([])
    } else {
      return Promise.all(
        entities.map(_ =>
          repl.qexec(`wsk ${type} rimraf -r -q ${repl.encodeComponent(_)}`, undefined, undefined, { raw: true })
        )
      )
    }
  }
  const rmActions = rmHelper('actions')
  const rmTriggers = rmHelper('triggers')

  /**
   * Recursively remove a package and its contents
   *
   */
  const deletePackageAndContents = pckage =>
    new Promise((resolve, reject) => {
      repl
        .qexec(`wsk package get "${pckage}"`)
        .then(pckage => Promise.all([rmActions(reify(pckage, 'actions')), rmTriggers(reify(pckage, 'feeds'))]))
        .then(flatten)
        .then(removedSoFar => {
          //
          // while openwhisk may return from deleting packaged actions,
          // but deleting the package can still fail with a 409; retry!
          //
          const tryDelete = () => repl.qexec(`wsk package delete "${pckage}"`).then(() => removedSoFar.concat([pckage]))

          const tryDeleteWithRetry = waitTime => {
            tryDelete()
              .then(resolve)
              .catch(err => {
                if (err.statusCode === 409) {
                  if (waitTime > 10000) {
                    reject(err)
                  } else {
                    setTimeout(() => tryDeleteWithRetry(waitTime * 2), waitTime)
                  }
                } else {
                  reject(err)
                }
              })
          }

          tryDeleteWithRetry(500)
        })
        .catch(reject)
    })

  /**
   * Return the fully qualified name of the given entity
   *
   */
  const fqn = entity => `/${entity.namespace}/${entity.name}`

  /**
   * Fetch entities of the given type
   *
   */
  const BATCH = 200 // keep this at 200, but you can temporarily set it to lower values for debugging
  const fetch = (type, skip = 0, soFar = []) => {
    return repl
      .qexec(`wsk ${type} list --limit ${BATCH} --skip ${skip}`)
      .then((response: Table) => response.body)
      .then(items => {
        if (items.length === BATCH) {
          // then there may be more
          return fetch(type, skip + BATCH, soFar.concat(items))
        } else if (items.length === 0) {
          return soFar
        } else {
          return soFar.concat(items)
        }
      })
  }

  /**
   * Do a glob-style match, using the given list of patterns
   *
   */
  const glob = (type, list) => {
    const wildcards = list
      .filter(pattern => pattern.indexOf('*') >= 0)
      .map(pattern => new RegExp(pattern.replace(/\*/g, '.*')))
    const exacts = list.filter(pattern => pattern.indexOf('*') < 0).map(item => ({ isExact: true, item: item }))

    if (wildcards.length === 0) {
      return Promise.resolve(exacts)
    } else {
      return fetch(type)
        .then(items => items.filter(item => wildcards.find(wildcard => item.name.match(wildcard))))
        .then(wildcardMatches => exacts.concat(wildcardMatches.map(fqn).map(item => ({ isExact: false, item: item }))))
    }
  }

  /**
   * This is the core logic
   *
   */
  const rm = (type: string) => ({ tab, block, nextBlock, argv: fullArgv, execOptions }: EvaluatorArgs) => {
    const options = minimist(fullArgv, {
      alias: { q: 'quiet', f: 'force', r: 'recursive' },
      boolean: ['quiet', 'force', 'recursive'],
      configuration: { 'parse-numbers': false, 'camel-case-expansion': false }
    })
    const argv = options._
    const toBeDeletedList = argv.slice(argv.indexOf('rimraf') + 1)

    if (toBeDeletedList.length === 0) {
      //
      // if no entity specified on the command line, check to
      // see if there is a selection; if so, use that entity
      //
      const selection = currentSelection(tab)
      if (selection && selection.type !== 'activations') {
        toBeDeletedList.push(`/${selection.namespace}/${selection.name}`)
        type = selection.type
        console.log('rm using implicit entity name', toBeDeletedList[0])
      }
    }

    return glob(type, toBeDeletedList)
      .then(toBeDeleted =>
        Promise.all(
          toBeDeleted.map(match => {
            const isExact = match.isExact

            const arg = match.item

            if (options.recursive && type === 'actions') {
              //
              // check to see if this is a sequence. if so, delete
              // any anonymous/inline functions associated with it
              //
              //    e.g. let seq = a -> x=>x -> b
              //                         |
              //                         ^^^^^^ delete this, too
              //
              return repl.qexec(`wsk action get "${arg}"`, block).then(action => {
                if (action.annotations && action.annotations.find(kv => kv.key === 'exec' && kv.value === 'sequence')) {
                  return Promise.all(
                    action.exec.components.map(component =>
                      repl
                        .qexec(`wsk action get "${component}"`, block)
                        .then(component => {
                          if (isAnonymousLet(component, arg)) {
                            // arg is the parent sequence
                            return repl
                              .qexec(`wsk action delete "${component.name}"`, block)
                              .then(() => [component.name]) // deleted one
                              .catch(errorThen([])) // deleted zero
                          } else {
                            return [] // deleted zero
                          }
                        })
                        .catch(errorThen([]))
                    )
                  ) // get failed, sequence component already deleted, so deleted zero here!
                    .then(flatten)
                    .then(counts =>
                      repl
                        .qfexec(`wsk ${type} delete "${arg}"`, block as HTMLElement, nextBlock) // now we can delete the sequence
                        .then(() => counts.concat(arg))
                    ) // total deleted count
                } else {
                  // not a sequence, plain old delete
                  return repl.qfexec(`wsk ${type} delete "${arg}"`, block as HTMLElement, nextBlock).then(() => [arg]) // deleted one
                }
              })
            } else if (options.recursive && type === 'packages') {
              return deletePackageAndContents(arg)
            } else {
              // no special handling for other entity types
              return repl
                .qfexec(`wsk ${type} delete "${arg}"`, block as HTMLElement, nextBlock)
                .then(() => [arg]) // deleted one
                .catch(err => {
                  if (err.statusCode === 404 && !isExact) {
                    // if this item was found due to a wildcard match, then don't complain if we didn't find it
                  } else {
                    throw err
                  }
                })
            }
          })
        )
      )
      .then(flatten)
      .then(removed => {
        if (execOptions.raw) {
          return removed
        } else {
          const count = removed.length
          if (options && options.quiet) {
            return count
          } else {
            return `deleted ${count} ${count === 1 ? 'element' : 'elements'}`
          }
        }
      })
  }

  // Install the routes
  const entities = ['actions', 'triggers', 'rules', 'packages']
  entities.forEach(type => {
    const handler = rm(type)
    synonyms(type).forEach(async syn => {
      commandTree.listen(`/wsk/${syn}/rimraf`, handler, {
        docs: `Delete one or more OpenWhisk ${type}`
      })

      const deleteCmd = await commandTree.find(`/wsk/${syn}/delete`)
      if (deleteCmd && deleteCmd.options) deleteCmd.options.hide = true
    })
  })

  // expose a programmatic API
  return {
    rm
  }
}
