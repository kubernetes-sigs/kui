/*
 * Copyright 2020 IBM Corporation
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

import { Arguments, CodedError, ExecType } from '@kui-shell/core'

import makeWatchable from './watch'
import { Explained } from '../../kubectl/explain'
import { fetchFile } from '../../../lib/util/fetch-file'
import { toKuiTable, withNotFound } from '../../../lib/view/formatTable'

import {
  KubeOptions,
  formatOf,
  getLabel,
  getNamespace,
  isForAllNamespaces,
  isTableRequest,
  isWatchRequest
} from '../../kubectl/options'

import handleErrors from './errors'
import { isStatus, KubeItems, MetaTable } from '../../../lib/model/resource'

export type URLFormatter = (includeKind?: boolean, includeQueries?: boolean, name?: string) => string

export const headersForTableRequest = { accept: 'application/json;as=Table;g=meta.k8s.io;v=v1' }

export async function urlFormatterFor(
  args: Arguments<KubeOptions>,
  { kind, version, isClusterScoped }: Explained
): Promise<URLFormatter> {
  const namespace = await getNamespace(args)

  const kindOnPath = `/${encodeURIComponent(kind.toLowerCase() + (/s$/.test(kind) ? '' : 's'))}`

  // e.g. "apis/apps/v1" for deployments
  const apiOnPath = version === 'v1' ? 'api/v1' : `apis/${encodeURIComponent(version)}`

  // a bit complex: "kubectl get ns", versus "kubectl get ns foo"
  // the "which" is "foo" in the second case
  const namespaceOnPath = isForAllNamespaces(args.parsedOptions)
    ? ''
    : kind === 'Namespace'
    ? ''
    : isClusterScoped
    ? ''
    : `/namespaces/${encodeURIComponent(namespace)}`

  // we will accumulate queries
  const queries: string[] = []

  // labelSelector query
  const label = getLabel(args)
  if (label) {
    const push = (query: string) => queries.push(`labelSelector=${encodeURIComponent(query)}`)
    if (Array.isArray(label)) {
      label.forEach(push)
    } else {
      push(label)
    }
  }

  // limit query
  if (typeof args.parsedOptions.limit === 'number') {
    queries.push(`limit=${args.parsedOptions.limit}`)
  }

  // format a url
  return (includeKind = false, includeQueries = false, name?: string) =>
    `kubernetes:///${apiOnPath}${namespaceOnPath}${!includeKind ? '' : kindOnPath}${
      !name ? '' : `/${encodeURIComponent(name)}`
    }${!includeQueries || queries.length === 0 ? '' : '?' + queries.join('&')}`
}

export default async function getDirect(args: Arguments<KubeOptions>, _kind: Promise<Explained>) {
  const explainedKind = _kind ? await _kind : { kind: undefined, version: undefined, isClusterScoped: false }
  const { kind } = explainedKind
  const formatUrl = await urlFormatterFor(args, explainedKind)

  const format = formatOf(args)
  const kindIdx = args.argvNoOptions.indexOf('get') + 1
  const names = args.argvNoOptions.slice(kindIdx + 1)
  const urls = names.length === 0 ? formatUrl(true, true) : names.map(formatUrl.bind(undefined, true, true)).join(',')

  if (isTableRequest(args)) {
    const fmt = format || 'default'
    if (fmt === 'wide' || fmt === 'default') {
      // first, fetch the data
      const responses = await fetchFile(args.REPL, urls, headersForTableRequest, true)

      // then dissect it into errors and non-errors
      const { errors, ok } = await handleErrors(responses, formatUrl, kind, args.REPL)

      // assemble the non-errors into a single table
      const metaTable = ok.reduce<MetaTable>((metaTable, data) => {
        const thisTable =
          Buffer.isBuffer(data) || typeof data === 'string'
            ? (JSON.parse(data.toString()) as MetaTable)
            : (data as MetaTable)

        if (!metaTable) {
          // first table response
          return thisTable
        } else {
          // accumulate table responses
          metaTable.rows = metaTable.rows.concat(thisTable.rows)
          return metaTable
        }
      }, undefined)

      if (args.execOptions.type === ExecType.TopLevel && metaTable.rows.length === 0 && !isWatchRequest(args)) {
        return `No resources found in **${await getNamespace(args)}** namespace.`
      } else {
        try {
          // withNotFound will add error rows to the table for each error
          const table = withNotFound(await toKuiTable(metaTable, kind, args), errors.map(_ => _.message).join('\n'))
          return !isWatchRequest(args) ? table : makeWatchable(args, kind, table, formatUrl)
        } catch (err) {
          console.error('error formatting table', err)
          throw new Error('Internal Error')
        }
      }
    }
  }

  if (
    !isTableRequest(args) &&
    args.parsedOptions.kubeconfig === undefined &&
    args.parsedOptions.context === undefined &&
    (format === 'json' || format === 'yaml' || format === 'name')
  ) {
    let response: string | Buffer | object
    try {
      response = (await fetchFile(args.REPL, urls, { accept: 'application/json' }))[0]
    } catch (err) {
      response = JSON.parse(err.message)
      if (!isStatus(response)) {
        throw err
      }
    }

    if (isStatus(response)) {
      const error: CodedError = new Error(`Error from server (${response.reason}): ${response.message}`)
      error.code = response.code
      throw error
    } else if (format === 'name') {
      return {
        content: {
          code: 0,
          stderr: '',
          stdout: ((Buffer.isBuffer(response) || typeof response === 'string'
            ? JSON.parse(response.toString())
            : response) as KubeItems).items
            .map(_ => _.metadata.name)
            .join('\n'),
          wasSentToPty: false
        }
      }
    } else if (format === 'yaml') {
      const { safeDump } = await import('js-yaml')
      return {
        content: {
          code: 0,
          stderr: '',
          stdout: safeDump(
            Buffer.isBuffer(response) || typeof response === 'string' ? JSON.parse(response.toString()) : response
          ),
          wasSentToPty: false
        }
      }
    } else {
      return {
        content: {
          code: 0,
          stderr: '',
          stdout:
            Buffer.isBuffer(response) || typeof response === 'string' ? response.toString() : JSON.stringify(response),
          wasSentToPty: false
        }
      }
    }
  }
}
