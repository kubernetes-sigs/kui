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

import { REPL as REPLType, Table, Row, RawResponse, Arguments, Registrar, UsageModel, KResponse } from '@kui-shell/core'

import flags from './flags'
import apiVersion from './apiVersion'
import { KubeOptions } from './options'
import { doExecWithTable } from './exec'
import commandPrefix from '../command-prefix'
import { KubeContext } from '../../lib/model/resource'
import { isUsage, doHelp } from '../../lib/util/help'
import { onKubectlConfigChangeEvents } from './config'

const usage = {
  context: (command: string): UsageModel => ({
    command,
    strict: command,
    docs: 'Print your current kubernetes context',
    example: 'kubectl context'
  }),
  contexts: (command: string): UsageModel => ({
    command,
    strict: command,
    docs: 'List your available kubernetes contexts',
    optional: [{ name: '-o', docs: 'Output format', allowed: ['wide'] }],
    example: 'kubectl contexts'
  })
}

/** Extract the cell value for the given column name (`key`) in the given `row` */
function valueOf(key: 'NAME' | 'NAMESPACE' | 'AUTHINFO' | 'CLUSTER', row: Row): string {
  const cell = row.attributes.find(_ => _.key === key)
  return cell ? cell.value : ''
}

/**
 * @return a `KubeContext` representing the current context
 *
 */
export async function getCurrentContext({ REPL }: { REPL: REPLType }): Promise<KubeContext> {
  // fetch both the current context name, and the list of KubeContext objects */
  const [currentContextName, { content: contexts }] = await Promise.all([
    REPL.qexec<string>(`context`),
    REPL.rexec<KubeContext[]>(`contexts`)
  ])

  // the KubeContext object matching the current context name
  return contexts.find(_ => _.metadata.name === currentContextName)
}

/** @return a list of `KubeContext` for all known contexts */
export async function getAllContexts({ REPL }: { REPL: REPLType }): Promise<KubeContext[]> {
  return (await REPL.rexec<KubeContext[]>('contexts')).content
}

export async function getCurrentContextName({ REPL }: { REPL: REPLType }) {
  const context = await REPL.qexec<string>('kubectl config current-context')
  return context ? context.trim() : context
}

/** Extract the namespace from the current context */
let currentDefaultNamespaceCache: string
onKubectlConfigChangeEvents(({ command, parsedOptions }: Pick<Arguments<KubeOptions>, 'command' | 'parsedOptions'>) => {
  if (/k(ubectl?)\s+config\s+set-context/.test(command) && parsedOptions.namespace) {
    currentDefaultNamespaceCache = parsedOptions.namespace
  } else {
    currentDefaultNamespaceCache = undefined
  }
})
export async function getCurrentDefaultNamespace({ REPL }: { REPL: REPLType }) {
  if (currentDefaultNamespaceCache) {
    return currentDefaultNamespaceCache
  }

  const ns = await REPL.qexec<string>(`kubectl config view --minify --output "jsonpath={..namespace}"`)
    .then(ns => {
      currentDefaultNamespaceCache = ns
      return ns
    })
    .catch(err => {
      if (err.code !== 404 && !/command not found/.test(err.message)) {
        console.error('error determining default namespace', err)
      }
      return 'default'
    })

  if (typeof ns !== 'string') {
    // e.g. microk8s
    return 'default'
  } else {
    return ns ? ns.trim() : ns
  }
}

/**
 * List contets command handler
 *
 */
const listContexts = async (args: Arguments): Promise<RawResponse<KubeContext[]> | Table> => {
  const execOptions = Object.assign({}, args.execOptions, { render: false })

  const contexts = await args.REPL.qexec<Table>(`kubectl config get-contexts`, undefined, undefined, execOptions)

  if (args.execOptions.raw) {
    return {
      mode: 'raw',
      content: contexts.body.map(_ => ({
        apiVersion,
        kind: 'Context',
        originatingCommand: args,
        isKubeResource: true,
        metadata: {
          name: valueOf('NAME', _),
          namespace: valueOf('NAMESPACE', _)
        },
        spec: {
          user: valueOf('AUTHINFO', _),
          cluster: valueOf('CLUSTER', _),
          isCurrent: _.rowCSS === 'selected-row' || (Array.isArray(_.rowCSS) && _.rowCSS.indexOf('selected-row') >= 0)
        }
      }))
    }
  } else {
    return contexts
  }
}

/**
 * Register the commands
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen(
    `/${commandPrefix}/kubectl/config/get-contexts`,
    (args: Arguments): Promise<KResponse> => (isUsage(args) ? doHelp('kubectl', args) : doExecWithTable(args)),
    flags
  )

  commandTree.listen(
    `/${commandPrefix}/context`,
    async ({ REPL }) => {
      return (await REPL.qexec<string>('kubectl config current-context')).trim()
    },
    Object.assign(
      {
        usage: usage.context('context')
      },
      flags
    )
  )

  commandTree.listen(
    `/${commandPrefix}/contexts`,
    listContexts,
    Object.assign(
      {
        usage: usage.contexts('contexts')
      },
      flags
    )
  )
}
