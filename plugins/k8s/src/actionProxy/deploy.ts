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
const debug = Debug('plugins/k8s/actionProxy')

import repl = require('@kui/core/core/repl')

export const PACKAGE = 'cloudshell-support'

/** we will use this to check whether the deployed action proxy is up to date */
const { version: ourVersion } = require('@kui/settings/package.json')

/**
 * Actually deploy the action proxy
 *
 */
const deploy = ({ FQN, actionProxySource }) => repl.qexec(`package update "${PACKAGE}"`)
    .then(async () => repl.qexec(`action update "${FQN}" --native !source`, undefined, undefined, {
      parameters: {
        source: (await actionProxySource).toString(),
        version: ourVersion
      }
    }))
    .catch(err => {
      if (err.statusCode === 409) {
            // that's ok; concurrent attempts at deploy
      } else {
        throw err
      }
    })

/**
 * Deploy the action proxy if necessary
 *
 */
let checkedForThisSession = {}
export const checkDeploy = ({ FQN, actionProxySource }) => () => {
  debug('checkDeploy', checkedForThisSession)

  if (checkedForThisSession[FQN]) {
    debug('checkDeploy action proxy already checked for this session')
    return Promise.resolve()
  } else {
    debug('checkDeploy deploying action proxy')
    return repl.qexec(`action invoke "${FQN}" -p cmdline action-proxy-version`)
            .then(({ version: deployedVersion = undefined } = {}) => {
              if (deployedVersion !== ourVersion) {
                    // version mismatch, deploy the action proxy
                debug('checkDeploy version mismatch', deployedVersion, ourVersion)
                return deploy({ FQN, actionProxySource })
              }
            })
            .catch(err => {
              debug('checkDeploy action proxy invoke error', err)
              if (err.statusCode === 404) {
                    // action proxy not deployed, so deploy it
                return deploy({ FQN, actionProxySource })
              } else {
                throw err
              }
            })
                .then(() => {
                  checkedForThisSession[FQN] = true
                })
  }
}
