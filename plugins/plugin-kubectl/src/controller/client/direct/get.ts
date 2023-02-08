/*
 * Copyright 2020 The Kubernetes Authors
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

import { Arguments, CodedError, ExecType, Table } from '@kui-shell/core'
import { isStatus, KubeItems, MetaTable } from '@kui-shell/plugin-kubectl-core'

import makeWatchable from './watch'
import { Explained } from '../../kubectl/explain'
import { fetchFile } from '../../../lib/util/fetch-file'
import { getCommandFromArgs } from '../../../lib/util/util'
import { toKuiTable, withNotFound } from '../../../lib/view/formatTable'

import { doStatus } from '../../kubectl/status'
import {
  KubeOptions,
  formatOf,
  getFileFromArgv,
  getNamespace,
  isEntityFormat,
  isCustomColumns,
  isTableRequest,
  isWatchRequest
} from '../../kubectl/options'

import columnsOf from './columns'
import { urlFormatterFor } from './url'
import handleErrors, { tryParseAsStatus } from './errors'
import { headersForPlainRequest, headersForTableRequest } from './headers'

export async function getTable(
  drilldownCommand: string,
  namespace: string,
  names: string[],
  explainedKind: Explained,
  format: string,
  args: Pick<Arguments<KubeOptions>, 'REPL' | 'parsedOptions' | 'execOptions'>,
  needsStatusColumn = false,
  customColumns?: string[]
): Promise<string | Table> {
  const { kind } = explainedKind
  const group = { explainedKind, names, namespace }
  const formatUrl = await urlFormatterFor(drilldownCommand, namespace, args, explainedKind)

  const urls = names.length === 0 ? formatUrl(true, true) : names.map(formatUrl.bind(undefined, true, true)).join(',')

  const fmt = format || 'default'
  const isCusto = isCustomColumns(fmt)
  if (fmt === 'wide' || fmt === 'default' || isCusto) {
    // first, fetch the data; we pass returnErrors=true here, so that we can assemble 404s properly
    const responses = await fetchFile(args, urls, {
      headers: isCusto ? headersForPlainRequest : headersForTableRequest,
      returnErrors: true
    })

    // then dissect it into errors and non-errors
    const { errors, ok } = await handleErrors(responses, formatUrl, kind, args)

    if (isCusto) {
      const list = ok.reduce<KubeItems>((list, data) => {
        const thisList =
          Buffer.isBuffer(data) || typeof data === 'string'
            ? (JSON.parse(data.toString()) as KubeItems)
            : (data as KubeItems)

        if (!list || !list.items) {
          // first table response
          return thisList
        } else {
          // accumulate list responses
          list.items = list.items.concat(thisList.items)
          return list
        }
      }, undefined)

      list.isKubeResource = true
      const table = (await import('./custom-columns')).toKuiTableFromCustomColumns(
        list,
        args,
        drilldownCommand,
        kind,
        fmt
      )
      return !isWatchRequest(args) ? table : makeWatchable(drilldownCommand, args, kind, group, table, formatUrl)
    } else {
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

      if (
        args.execOptions.type === ExecType.TopLevel &&
        metaTable &&
        (!metaTable.rows || metaTable.rows.length === 0) &&
        !isWatchRequest(args)
      ) {
        // throw error so UI can render an error block for this response
        const err: CodedError = new Error(`No resources found in **${namespace}** namespace.`)
        err.code = 404
        throw err
      } else {
        try {
          // withNotFound will add error rows to the table for each error
          const table = withNotFound(
            await toKuiTable(metaTable, kind, args, drilldownCommand, needsStatusColumn, customColumns),
            errors.map(_ => _.message).join('\n')
          )

          return !isWatchRequest(args) ? table : makeWatchable(drilldownCommand, args, kind, group, table, formatUrl)
        } catch (err) {
          console.error('error formatting table', err)
          throw new Error('Internal Error')
        }
      }
    }
  }
}

/**
 * Direct `get` only handles the following cases:
 *
 * 1. file request with table output, e.g. `kubectl get -f` and `kubectl get -k`
 * 2. table request, e.g. `kubectl get pods` and `kubectl get pod nginx`
 * 3. entity request with kind and name, e.g. `get pod nginx -o yaml`
 *
 * TODO 1: consolidate `1` and `2` into a single table request handler using `doStatus`
 * TODO 2: handle entity request with file
 *
 */
export async function get(
  drilldownCommand: string,
  namespace: string,
  names: string[],
  explainedKind: Explained,
  format: string,
  args: Arguments<KubeOptions>
) {
  const isFileRequest = getFileFromArgv(args)
  const isEntityAndNameFormat = isEntityFormat(format) || format === 'name'

  /** 1. file request with table output, e.g. `kubectl get -f` and `kubectl get -k` */
  if (isFileRequest && !isEntityAndNameFormat) {
    return doStatus(args, 'get', drilldownCommand, undefined, undefined, undefined, isWatchRequest(args))
  }

  /** 2. table request, e.g. `kubectl get pods` and `kubectl get pod nginx` */
  if (isTableRequest(args)) {
    return getTable(
      drilldownCommand,
      namespace,
      names,
      explainedKind,
      format,
      args,
      undefined,
      columnsOf(explainedKind.kind, args)
    )
  }

  /** 3. entity request with kind and name, e.g. `get pod nginx -o yaml` */
  if (!isTableRequest(args) && !isFileRequest && args.parsedOptions.kubeconfig === undefined && isEntityAndNameFormat) {
    const formatUrl = await urlFormatterFor(drilldownCommand, namespace, args, explainedKind)
    const urls = names.length === 0 ? formatUrl(true, true) : names.map(formatUrl.bind(undefined, true, true)).join(',')

    let response: string | Buffer | object
    try {
      response = (await fetchFile(args, urls, { headers: { accept: 'application/json' } }))[0]
    } catch (err) {
      response = tryParseAsStatus(err.code, err.message)
      if (!isStatus(response)) {
        throw err
      }
    }

    if (isStatus(response)) {
      const error: CodedError = new Error(`Error from server (${response.reason}): ${response.message}`)
      error.code = response.code
      throw error
    } else if (format === 'name') {
      try {
        const stdout = (
          (Buffer.isBuffer(response) || typeof response === 'string'
            ? JSON.parse(response.toString())
            : response) as KubeItems
        ).items
          .map(_ => _.metadata.name)
          .join('\n')

        return {
          content: {
            code: 0,
            stderr: '',
            stdout,
            wasSentToPty: false
          }
        }
      } catch (err) {
        throw new Error(response.toString())
      }
    } else if (format === 'yaml') {
      const { dump } = await import('js-yaml')
      return {
        content: {
          code: 0,
          stderr: '',
          stdout: dump(
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

export default async function getDirect(args: Arguments<KubeOptions>, _kind: Promise<Explained>) {
  const namespace = getNamespace(args)
  const format = formatOf(args)
  const drilldownCommand = getCommandFromArgs(args)
  const kindIdx = args.argvNoOptions.indexOf('get') + 1
  const names = args.argvNoOptions.slice(kindIdx + 1)
  const explainedKind = _kind ? await _kind : { kind: undefined, version: undefined, isClusterScoped: false }

  return get(drilldownCommand, await namespace, names, explainedKind, format, args)
}
