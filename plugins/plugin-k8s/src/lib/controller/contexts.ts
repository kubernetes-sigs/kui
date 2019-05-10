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
const debug = Debug('k8s/controller/contexts')

import repl = require('@kui-shell/core/core/repl')
import { Row, Table } from '@kui-shell/core/webapp/models/table'
import { CommandRegistrar } from '@kui-shell/core/models/command'

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
const addClickHandlers = (table: Table, execOptions): Table => {
  const body: Row[] = table.body.map((row): Row => {
    const nameAttr = row.attributes.find(({ key }) => key === 'NAME')
    const { value: contextName } = nameAttr

    nameAttr.outerCSS += ' entity-name-group-narrow'

    const onclick = async () => {
      await repl.qexec(`kubectl config use-context ${repl.encodeComponent(contextName)}`,
                       undefined, undefined, Object.assign({}, execOptions, { raw: true }))
      row.setSelected()
    }

    row.name = contextName
    row.onclick = onclick
    nameAttr.onclick = onclick

    return row
  })

  return new Table({
    header: table.header,
    body: body,
    title: 'Kubernetes Contexts'
  })
}

/**
 * List contets command handler
 *
 */
const listContexts = opts => repl.qexec(`kubectl config get-contexts`, undefined, undefined, opts.execOptions)
  .then((contexts: Table | Table[]) => Array.isArray(contexts) ?
    contexts.map(context => addClickHandlers(context, opts.execOptions)) : addClickHandlers(contexts, opts.execOptions))

/**
 * Register the commands
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/k8s/context',
                     async ({ execOptions }) => {
                       return (await repl.qexec(`kubectl config current-context`,
                                                undefined, undefined, Object.assign({}, execOptions, { raw: true }))).trim()
                     },
    { usage: usage.context('context'),
      inBrowserOk: true,
      noAuthOk: [ 'openwhisk' ] })

  commandTree.listen('/k8s/contexts',
                       listContexts,
    { usage: usage.contexts('contexts'),
      width: 1024,
      height: 600,
      inBrowserOk: true,
      noAuthOk: [ 'openwhisk' ] })
}
