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
const debug = Debug('plugins/apache-composer/client')

import * as path from 'path'
import * as Conductor from 'openwhisk-composer/conductor'

import * as repl from '@kui-shell/core/core/repl'
import { findFile } from '@kui-shell/core/core/find-file'

const options = {
  ignore_certs: process.env.IGNORE_CERTS && process.env.IGNORE_CERTS !== 'false' && process.env.IGNORE_CERTS !== '0'
}

/**
 * Deploy the given composition to Apache OpenWhisk
 *
 * @param composition the output of
 * e.g. composer.sequence(a,b).compile(), but with a name field
 * added.
 *
 */
export const deploy = ({ composition, overwrite }) => {
  // deploys the JSON-encoded composition
  debug('deploying composition', composition)
  return Conductor(options).compositions.deploy(composition, overwrite)
    .then(entity => {
      // delploy returns [{...}]
      return Object.assign(entity[0], { name: entity[0].id, verb: 'update', type: 'composition' })
    })
}

/**
 * Deploy a given action, if we can find the source
 *
 */
export const deployAction = (home: string) => actionFQN => new Promise(async (resolve, reject) => {
  const actionName = actionFQN.replace(/^\/[^/]\//, '') // stripe namespace off actionFQN
  const suffixes = ['.js', '.php', '.python']
  const actionPaths = suffixes.map(suffix => path.join(home, `${actionName}${suffix}`))
  const filePaths = actionPaths.map(actionPath => findFile(actionPath))

  debug(`attempting to find and deploy action ${actionFQN} from local paths`, filePaths)

  // dynamic import for webpack friendliness
  const { pathExists } = await import('fs-extra')

  const validfilePaths = (await Promise.all(filePaths.map(filePath => pathExists(filePath).then(exists => exists ? filePath : undefined))))
    .filter(existFilePath => existFilePath)

  debug(`found validfilePaths: ${validfilePaths}`)

  if (validfilePaths.length === 0) {
    return repl.qexec(`wsk action get ${actionFQN}`)
      .then(resolve)
      .catch(err => err.statusCode === 404 ? reject(new Error(`Failed to deploy ${actionFQN}. You don't have any matching .js, .php or .python file in your local file system.`)) : reject(err))
  } else {
    return Promise.all(validfilePaths.map(filePath => repl.qexec(`wsk action update "${actionFQN}" "${filePath}"`)))
      .then(resolve, reject)
  }
})
