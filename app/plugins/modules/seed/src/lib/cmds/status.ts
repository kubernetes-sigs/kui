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

const debug = require('debug')('seed/status')

import { NAMESPACE } from './constants'
import { checkSecret, checkDefaults, checkToken, checkCRDs, checkDeploy } from './prereq'
import { State, States, state2Traffic, rendering as stateRendering } from '../../../../k8s/plugin/lib/cmds/states'

import { pexec, encodeComponent } from '../../../../../../build/core/repl.js'

// import { readFile } from 'fs-extra';
// import { safeLoad as parseYAML } from 'js-yaml';

const usage = {
  command: 'status',
  strict: 'status',
  optional: [
    { name: '--namespace', alias: '-n', docs: 'Check the status of a specified namespace' }
  ]
}

/**
 * Format as a cloudshell entity for display in list and entity views
 *
 */
const formatAsEntity = ({ name, kind: type, getStatus, namespace, label, asYAML = false }) => {
  const { outerCSS, cssForState } = stateRendering

  return {
    name,
    type,
    onclick: () => pexec(`kubectl get ${encodeComponent(type.toLowerCase())} ${label ? `-l ${encodeComponent(label)}` : ''} ${namespace ? `-n ${encodeComponent(NAMESPACE)}` : ''} ${asYAML ? '-o yaml' : ''}`),
    attributes: [
      { key: 'kind', value: type, css: 'slightly-deemphasize' },
      // { key: 'date', value: '', css: 'deemphasize' },
      { key: 'status',
        tag: 'badge',
        value: States.Pending,
        // watchLimit: 5,
        watch: async () => {
          let newState = States.Pending
          let done = false
          try {
            const status = await getStatus()
            done = status === true
            newState = done ? States.Online : States.Pending
          } catch (err) {
            console.error(err.code, err)
            if (err.code !== 404) {
              done = true
              newState = States.Failed
            }
          }

          return { outerCSS, value: newState, done, css: cssForState(newState) }
        },
        outerCSS,
        css: cssForState(States.Pending)
      }
    ]
  }
}

/**
 * seed status command impl
 *
 */
const getStatus = async ({ parsedOptions: options }) => {
  const label = 'app=seed'

  const statusList = [
    { name: 'platform secret', kind: 'Secret', getStatus: () => checkSecret(options, false, false), label },
    { name: 'registry token', kind: 'Secret', getStatus: () => checkToken(options, false), namespace: NAMESPACE, label },
    { name: 'settings', kind: 'ConfigMap', getStatus: () => checkDefaults(options, false, false), label },
    { name: 'resource definitions', kind: 'CRD', getStatus: () => checkCRDs(options, false) },
    { name: 'service brokers', kind: 'Pod', getStatus: checkDeploy, namespace: NAMESPACE, label }
    // ...images.map(({ shortname: name }) => ({ name, kind: 'Pod', getStatus: () => checkPod(name) }))
  ]

  const headerRow: Array<any> = [{
    name: 'COMPONENT',
    type: 'component',
    outerCSS: 'header-cell',
    attributes: [
      { key: 'kind', value: 'KIND', outerCSS: 'header-cell' },
      { key: 'status', value: 'STATUS', outerCSS: 'header-cell very-narrow not-too-wide min-width-6em text-center' }
    ]
  }]

  return Promise.all(headerRow.concat(statusList.map(formatAsEntity)))
}

/**
 * Register the command
 *
 */
export default (commandTree, prequire) => {
  commandTree.listen('/seed/status', getStatus, { usage })
}
