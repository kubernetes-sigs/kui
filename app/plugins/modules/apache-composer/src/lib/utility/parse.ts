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
const debug = Debug('plugins/apache-composer/utility/parse')
import * as path from 'path'
import * as fs from 'fs'
import * as repl from '../../../../../../build/core/repl'
import * as fqn from '@ibm-functions/composer/fqn'
import { findFile } from '../../../../../../build/core/find-file'

/* use wsk utility to parse parameters from a command */
export const parseParams = (argv, wsk) => {
  const { kvOptions: { action: { parameters = [] } = {} } = {} } = wsk.parseOptions(argv, 'action') // eslint-disable-line
  return parameters.reduce(function (params, ele) {
    params[ele.key] = ele.value
    return params
  }, {})
}

/* parse the composition name from a command */
export const parseName = (args, cmd) => args[args.indexOf(cmd) + 1]

// TODO: move to somewhere else
/**
 * Deploy a given action, if we can find the source
 *
 */
export const deployAction = (home: string) => actionFQN => new Promise((resolve, reject) => {
  try {
    const actionName = actionFQN.replace(/^\/[^/]\//, '') // stripe namespace off actionFQN
    const suffixes = ['.js', '.php', '.python']

    for (let idx = 0; idx < suffixes.length; idx++) {
      const suffix = suffixes[idx]
      const actionPath = path.join(home, `${actionName}${suffix}`)
      const filepath = findFile(actionPath)

      debug('attempting to deploy action', actionPath)

      fs.stat(filepath, (err, stats) => {
        if (!err) {
          debug('deploying action', actionName, filepath)
          return repl.qexec(`wsk action update "${actionFQN}" "${filepath}"`)
            .then(resolve, reject)
        }
      })
    }

    // console.error(`Warning: action source near ${path.join(home, actionName)} cannot be found`)

    resolve()
  } catch (err) {
    reject(err)
  }
}).catch(err => {
  console.error(err)
})
