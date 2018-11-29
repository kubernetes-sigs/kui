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

const debug = require('debug')('seed/deployments')

import repl = require('../../../../../../build/core/repl')

import { FinalState, State, States, state2Traffic, watchStatus, rendering as stateRendering } from '../../../../k8s/plugin/lib/cmds/states'
import { toOpenWhiskFQN } from '../../../../k8s/plugin/lib/cmds/util'

import { flatten, result } from './util'

/**
 * Format as a cloudshell entity for display in list and entity views
 *
 */
const formatAsEntity = ({ kubeEntity, crd }) => {
  const { apiVersion, kind, metadata: { name } } = kubeEntity
  const { type, actionName, packageName, fqn } = toOpenWhiskFQN(kubeEntity)
  const { outerCSS, cssForState } = stateRendering

  const typeForDisplay = type === 'unknown' ? kind : type

    // debug('entity', type, actionName, packageName, fqn, kubeEntity, crd);

  return Object.assign({}, kubeEntity, {
    name,
    type: typeForDisplay,
    onclick: false, // watchStatus will manage this for us
    attributes: [
            { key: 'type', value: typeForDisplay, css: 'deemphasize green-text' },
            { key: 'crd', value: crd, css: 'deemphasize hide-with-sidecar' },
      { key: 'status', value: States.Pending,
        tag: 'badge',
        outerCSS,
        css: cssForState(States.Pending),
        watch: () => watchStatus({ apiVersion, kind, name, type, fqn }, FinalState.NotPendingLike) },
            { key: 'message', value: '', css: 'deemphasize hide-with-sidecar' }
    ]
  })
}

/**
 * List the current deployments
 *
 */
const get = async () => {
    // i can't see a wait to do this with server-side filtering
  const allCRDs = await repl.qexec(`kubectl get crds -o json`).then(result)
  debug('allCRDs', allCRDs)

  const ibmCRDs = allCRDs.filter(({ metadata }) => metadata.name.endsWith('.ibm.com'))
  debug('ibmCRDs', ibmCRDs)

  const kinds = ibmCRDs.map(({ metadata }) => metadata.name)
  debug('kinds', kinds)

  const kubeEntities = await Promise.all(kinds.map(kind => repl.qexec(`kubectl get ${kind} -o json`)
                                                     .then(result)
                                                     .then(entities => entities.map(kubeEntity => ({ crd: kind, kubeEntity })))))
        .then(flatten)
  debug('kubeEntities', kubeEntities)

  const entities = kubeEntities.map(formatAsEntity)
  debug('entities', entities)

  return entities
}

/**
 * Command usage model
 *
 */
const usage = command => ({
  title: 'List Deployments',
  command,
  strict: command,
  docs: `List current deployments`
})

/**
 * Register the command
 *
 */
export default (commandTree, prequire) => {
  const cmd = commandTree.listen('/seed/get/deployments', get, { usage: usage('deployments') })
  commandTree.synonym('/seed/get/deployment', get, cmd, { usage: usage('deployment') })
  commandTree.synonym('/seed/get/deploy', get, cmd, { usage: usage('deploy') })
}
