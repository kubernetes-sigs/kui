/*
 * Copyright 2018-19 IBM Corporation
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

import { Commands, i18n, Errors, Tables } from '@kui-shell/core'

const strings = i18n('plugin-k8s')

const usage = {
  context: (command: string): Errors.UsageModel => ({
    command,
    strict: command,
    docs: 'Print your current kubernetes context',
    example: 'kubectl context'
  }),
  contexts: (command: string): Errors.UsageModel => ({
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
const addClickHandlers = (
  table: Tables.Table,
  { REPL }: Commands.Arguments,
  execOptions: Commands.ExecOptions
): Tables.Table => {
  const body: Tables.Row[] = table.body.map(
    (row): Tables.Row => {
      const nameAttr = row.attributes.find(({ key }) => key === 'NAME')
      const { value: contextName } = nameAttr

      nameAttr.outerCSS += ' entity-name-group-narrow'

      const onclick = async () => {
        await REPL.qexec(
          `kubectl config use-context ${REPL.encodeComponent(contextName)}`,
          undefined,
          undefined,
          Object.assign({}, execOptions, { raw: true })
        )
        row.setSelected()
      }

      row.name = contextName
      row.onclick = onclick
      nameAttr.onclick = onclick

      return row
    }
  )

  return new Tables.Table({
    header: table.header,
    body: body,
    title: strings('contextsTableTitle')
  })
}

/**
 * List contets command handler
 *
 */
const listContexts = (opts: Commands.Arguments): Promise<Tables.Table | Tables.MultiTable> => {
  const execOptions = Object.assign({}, opts.execOptions, { render: false })

  return opts.REPL.qexec<Tables.Table | Tables.MultiTable>(
    `kubectl config get-contexts`,
    undefined,
    undefined,
    execOptions
  ).then((contexts: Tables.Table | Tables.MultiTable) =>
    Tables.isMultiTable(contexts)
      ? { tables: contexts.tables.map(context => addClickHandlers(context, opts, execOptions)) }
      : addClickHandlers(contexts, opts, execOptions)
  )
}

/**
 * Register the commands
 *
 */
export default (commandTree: Commands.Registrar) => {
  commandTree.listen(
    '/context',
    async ({ execOptions, REPL }) => {
      return (await REPL.qexec<string>(
        `kubectl config current-context`,
        undefined,
        undefined,
        Object.assign({}, execOptions, { raw: true })
      )).trim()
    },
    {
      usage: usage.context('context'),
      inBrowserOk: true
    }
  )

  commandTree.listen('/contexts', listContexts, {
    usage: usage.contexts('contexts'),
    width: 1024,
    height: 600,
    inBrowserOk: true
  })
}
