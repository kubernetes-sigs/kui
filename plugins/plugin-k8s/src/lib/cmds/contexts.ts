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

const debug = require('debug')('k8s/cmds/contexts')

import repl = require('@kui-shell/core/core/repl')
import { isHeadless } from '@kui-shell/core/core/capabilities'

const usage = {
  context: command => ({
    command,
    strict: command,
    docs: 'Print your current kubernetes context',
    example: 'kubectl context'
  }),
  contexts: command => ({
    command,
    strict: command,
    docs: 'List your available kubernetes contexts',
    example: 'kubectl contexts'
  })
}

/**
 * Add click handlers to change context
 *
 */
const addClickHandlers = execOptions => table => {
  debug('table', table)
  return [table[0]].concat(table.slice(1).map(row => {
    const nameAttr = row.attributes.find(({ key }) => key === 'NAME')
    const { value: contextName } = nameAttr

    nameAttr.outerCSS += ' entity-name-group-narrow'

    row.onclick = async () => {
      await repl.qexec(`kubectl config use-context ${repl.encodeComponent(contextName)}`,
                       undefined, undefined, Object.assign({}, execOptions, { raw: true }))
      row.setSelected()
    }

    return row
  }))
}

/**
 * List contets command handler
 *
 */
const listContexts = opts => repl.qexec(`kubectl config get-contexts`, undefined, undefined, opts.execOptions)
  .then(addClickHandlers(opts.execOptions))
  .then(table => {
    table[0].title = 'Kubernetes Contexts'
    return [table]
  })

/**
 * Register the commands
 *
 */
export default (commandTree, prequire) => {
  commandTree.listen('/k8s/context',
                     async ({ execOptions }) => {
                       return (await repl.qexec(`kubectl config current-context`,
                                                undefined, undefined, Object.assign({}, execOptions, { raw: true }))).trim()
                     },
    { usage: usage.context('context'),
      inBrowserOK: true,
      noAuthOk: [ 'openwhisk' ] })

  commandTree.listen('/k8s/contexts',
                       listContexts,
    { usage: usage.contexts('contexts'),
      width: 1024,
      height: 600,
      inBrowserOK: true,
      noAuthOk: [ 'openwhisk' ] })
}
