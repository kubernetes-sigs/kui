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

const debug = require('debug')('seed/get/crds')

import repl = require('../../../../../../build/core/repl')

import { flatten } from './util'
import { NAMESPACE } from './constants'

const usage = command => ({
  command,
  strict: command,
  docs: 'Show a list of Seed resource controllers',
  example: 'seed get crd <name>',
  optional: [
    { name: 'name', docs: 'Get the detail of a specified resource controller', positional: true }
  ]
})

const headerRow = {
  type: 'crd',
  name: 'NAME',
  outerCSS: 'header-cell',
  noSort: true,
  attributes: [
    { value: 'CREATED AT', outerCSS: 'header-cell' }
  ]
}

/**
 * The command handler
 *
 */
const getCRD = async ({ argvNoOptions }) => {
  const crdName = argvNoOptions[argvNoOptions.indexOf('crds') + 1]

  const showCRD = ({ metadata: { name } }, exec = 'pexec') => {
    return () => repl[exec](`kubectl get crd ${repl.encodeComponent(name)} -n ${repl.encodeComponent(NAMESPACE)} -o json`)
  }

  if (crdName) {
    return showCRD({ metadata: { name: crdName } }, 'qexec')()
  } else {
    // user wasn't specific, so list them

    // get the list of crds
    const crds = (await repl.qexec(`kubectl get crds -n ${repl.encodeComponent(NAMESPACE)} -o json`,
                                   undefined, undefined, { raw: true }))
      .filter(({ metadata: { name } }) => name.match('ibm.com'))
    debug('crds', crds)

    return [ headerRow ].concat(crds.map(crd => ({
      type: 'crd',
      name: crd.metadata.name,
      onclick: showCRD(crd),
      attributes: [
        { key: 'CREATED AT', value: crd.metadata.creationTimestamp }
      ]
    })))
  }
}

/**
 * Register the command
 *
 */
export default (commandTree, prequire) => {
  const cmd = commandTree.listen('/seed/get/crds', getCRD, { usage: usage('crds') })
  commandTree.synonym('/seed/get/crd', getCRD, cmd, { usage: usage('crd') })
}
