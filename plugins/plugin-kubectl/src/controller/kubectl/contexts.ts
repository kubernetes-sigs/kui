/*
 * Copyright 2018 The Kubernetes Authors
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

import Debug from 'debug'
import { REPL as REPLType, Table, Row, RawResponse, Arguments, Registrar, UsageModel, KResponse } from '@kui-shell/core'

import flags from './flags'
import KubeOptions from './options'
import apiVersion from './apiVersion'
import { doExecWithTable } from './exec'
import { KubeContext } from '../../lib/model/resource'
import { isUsage, doHelp } from '../../lib/util/help'
import { onKubectlConfigChangeEvents } from './config'

const debug = Debug('plugin-kubectl/controller/kubectl/contexts')

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

export async function getCurrentContextName({ REPL }: { REPL: REPLType }): Promise<string> {
  const context = await REPL.qexec<string>('kubectl config current-context')
  return context ? context.trim() : context
}

/** Extract the namespace from the current context */
const currentDefaultNamespaceCache: Record<string, Promise<string>> = {} // map from contextName to namespace
let currentDefaultContextCache: Promise<string> // contextName

onKubectlConfigChangeEvents(async (type, namespace, context) => {
  if (type === 'SetNamespaceOrContext') {
    if (!context) {
      context = await currentDefaultContextCache
    }
    if (typeof namespace === 'string' && namespace.length > 0) {
      currentDefaultNamespaceCache[context] = Promise.resolve(namespace)
    } else {
      // invalidate cache
      currentDefaultNamespaceCache[context] = undefined
    }

    if (typeof context === 'string' && context.length > 0) {
      currentDefaultContextCache = Promise.resolve(context)
    } else {
      // invalidate cache
      currentDefaultContextCache[context] = undefined
    }
  }
})

export type ContextArgs = Pick<Arguments, 'REPL'> & Partial<Pick<Arguments<KubeOptions>, 'parsedOptions'>>

/** @return the relevant context for the given args/command line */
export function getCurrentDefaultContextName({ REPL, parsedOptions }: ContextArgs): string | Promise<string> {
  if (parsedOptions && parsedOptions.context) {
    return parsedOptions.context
  } else if (currentDefaultContextCache) {
    return currentDefaultContextCache
  }

  // eslint-disable-next-line no-async-promise-executor
  currentDefaultContextCache = new Promise(async resolve => {
    const context = await getCurrentContextName({ REPL }).catch(err => {
      if (err.code !== 404 && !/command not found/.test(err.message)) {
        debug('error determining default context', err)
      }
      return ''
    })

    resolve(context)
  })

  return currentDefaultContextCache
}

/** @return the relevant namespace for the given args/command line */
export async function getCurrentDefaultNamespace(
  args: ContextArgs,
  context?: string,
  noCache = false
): Promise<string> {
  const contextName = context || (await getCurrentDefaultContextName(args))
  if (!noCache && currentDefaultNamespaceCache[contextName]) {
    return currentDefaultNamespaceCache[contextName]
  }

  // eslint-disable-next-line no-async-promise-executor
  currentDefaultNamespaceCache[contextName] = new Promise(async resolve => {
    const cmdline = `kubectl config view --minify --context ${contextName} --output "jsonpath={..namespace}"`
    const ns = await args.REPL.qexec<string | number>(cmdline)
      .then(_ns => {
        const ns = typeof _ns === 'number' ? _ns.toString() : _ns // ns might be number

        if (typeof ns !== 'string' || ns.length === 0) {
          // e.g. microk8s
          console.error('Suspicious return value for current namespace', ns, cmdline)
          return 'default'
        } else {
          return ns
        }
      })
      .catch(err => {
        if (err.code !== 404 && !/command not found/.test(err.message)) {
          debug('error determining default namespace', err)
        }
        resolve('default')
      })

    resolve(ns ? ns.trim() : 'default')
  })

  return currentDefaultNamespaceCache[contextName]
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
    '/kubectl/config/get-contexts',
    (args: Arguments): Promise<KResponse> =>
      isUsage(args) ? doHelp('kubectl', args) : doExecWithTable(args, undefined, undefined, { entityType: 'Context' }),
    flags
  )

  commandTree.listen(
    '/context',
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
    '/contexts',
    listContexts,
    Object.assign(
      {
        usage: usage.contexts('contexts')
      },
      flags
    )
  )
}
