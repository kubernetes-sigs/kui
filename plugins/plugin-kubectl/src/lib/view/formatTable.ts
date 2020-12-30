/*
 * Copyright 2018-2020 IBM Corporation
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

import {
  Breadcrumb,
  Table,
  Row,
  Cell,
  isTable,
  encodeComponent,
  Arguments,
  ExecType,
  KResponse,
  MixedResponse,
  i18n,
  inBrowser
} from '@kui-shell/core'

import TrafficLight from '../model/traffic-light'
import { isClusterScoped, MetaTable } from '../model/resource'
import { getCurrentDefaultNamespace } from '../../'
import { RawResponse } from '../../controller/kubectl/response'
import { getCommandFromArgs } from '../util/util'
import KubeOptions, {
  formatOf,
  isForAllNamespaces,
  getNamespaceAsExpressed,
  withKubeconfigFrom
} from '../../controller/kubectl/options'

import cssForValue from './css-for-value'

const strings = i18n('plugin-kubectl')

/** return an array with at least maxColumns entries */
const fillTo = (length: number, maxColumns: number): Cell[] => {
  if (length >= maxColumns) {
    return []
  } else {
    return new Array(maxColumns - length).fill('')
  }
}

/** decorate certain columns specially */
const outerCSSForKey = {
  NAME: 'entity-name-group',
  READY: 'a-few-numbers-wide kui--hide-in-narrower-windows',
  KIND: 'max-width-id-like entity-kind',
  NAMESPACE: 'entity-name-group hide-with-sidecar not-a-name', // kubectl get pods --all-namespaces
  MESSAGE: 'not-too-compact', // k get events
  TYPE: 'hide-with-sidecar',

  CLUSTER: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // kubectl config get-contexts
  AUTHINFO: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // kubectl config get-contexts
  REFERENCE: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // istio autoscaler

  'CREATED AT': 'hide-with-sidecar',

  // kubectl get deployment
  CURRENT: 'entity-name-group entity-name-group-extra-narrow text-center',
  DESIRED: 'entity-name-group entity-name-group-extra-narrow text-center',

  'LAST SEEN': 'hide-with-sidecar entity-name-group-extra-narrow', // kubectl get events
  'FIRST SEEN': 'hide-with-sidecar entity-name-group-extra-narrow', // kubectl get events

  COUNT: 'keep-with-sidecar',

  // api-resources
  APIGROUP: 'hide-with-sidecar',

  REVISION: 'hide-with-sidecar', // helm ls
  AGE: 'hide-with-sidecar', // e.g. helm status and kubectl get svc
  'PORT(S)': 'entity-name-group entity-name-group-narrow hide-with-sidecar', // helm status for services
  SUBOBJECT: 'entity-name-group entity-name-group-extra-narrow' // helm ls
}

const cssForKey = {
  // kubectl get events
  NAME: 'entity-name',
  SOURCE: 'lighter-text smaller-text',
  SUBOBJECT: 'lighter-text smaller-text',
  MESSAGE: 'somewhat-smaller-text pre-wrap slightly-deemphasize',
  'CREATED AT': 'lighter-text smaller-text',

  AGE: 'slightly-deemphasize',

  'APP VERSION': 'pre-wrap slightly-deemphasize', // helm ls
  UPDATED: 'slightly-deemphasize somewhat-smaller-text'
}

const tagForKey = {
  // READY: 'badge', // e.g. deployments
  REASON: 'badge', // k get events
  Reason: 'badge', // k get events
  STATUS: 'badge',
  Status: 'badge'
}

/**
 * Split the given string at the given split indices
 *
 */
export interface Pair {
  key: string
  value: string
}

const split = (str: string, splits: number[], headerCells?: string[]): Pair[] => {
  return splits.map((splitIndex, idx) => {
    return {
      key: headerCells && headerCells[idx],
      value: str.substring(splitIndex, splits[idx + 1] || str.length).trim()
    }
  })
}

/**
 * Replace tab characters with a sequence of whitespaces
 *
 */
const detabbify = (str: string) => str.replace(/\t/g, '   ')

/**
 * Find the column splits
 *
 */
export const preprocessTable = (raw: string[]): Pair[][][] => {
  return raw.map(table => {
    const header = detabbify(table.substring(0, table.indexOf('\n')))
    const headerCells = header
      .split(/(\s\s)+\s?/)
      .map(x => x && x.trim())
      .filter(x => x)

    const columnStarts: number[] = []
    for (let idx = 0, jdx = 0; idx < headerCells.length; idx++) {
      const { offset, prefix } = idx === 0 ? { offset: 0, prefix: '' } : { offset: 1, prefix: ' ' }

      const newJdx = header.indexOf(prefix + headerCells[idx] + ' ', jdx)
      if (newJdx < 0) {
        // last column
        jdx = header.indexOf(' ' + headerCells[idx], jdx)
      } else {
        jdx = newJdx
      }
      columnStarts.push(jdx + offset)
    }

    return table
      .split(/\n/)
      .filter(x => x)
      .map(detabbify)
      .map(line => split(line, columnStarts, headerCells))
  })
}

/**
 * Interpret READY column value "n/m" as a traffic light based on
 * whehter n/m === 1.
 *
 */
function cssForReadyCount(ready: string): string {
  if (ready) {
    const [nReady, nTotal] = ready.split(/\//)
    const isDone = nReady && nTotal && nReady === nTotal

    return isDone ? TrafficLight.Green : TrafficLight.Yellow
  }
}

/** @return a namespace breadcrumb, either from the one given by args, or using the default from context */
export async function getNamespaceBreadcrumbs(entityType: string, args: Arguments<KubeOptions>): Promise<Breadcrumb[]> {
  const ns = await (isClusterScoped(entityType)
    ? undefined
    : getNamespaceAsExpressed(args) ||
      (isForAllNamespaces(args.parsedOptions) && strings('all')) ||
      (args.execOptions.type === ExecType.TopLevel && !inBrowser() && (await getCurrentDefaultNamespace(args))))

  return ns ? [{ label: ns }] : undefined
}

/** HELLO -> Hello, which is not possible to do with CSS */
export function initialCapital(name: string) {
  return typeof name === 'string' ? name[0] + name.slice(1).toLowerCase() : name
}

export const formatTable = async <O extends KubeOptions>(
  command: string,
  verb: string,
  entityTypeFromCommandLine: string,
  args: Arguments<O>,
  preTable: Pair[][],
  nameColumn = 'NAME'
): Promise<Table> => {
  const { parsedOptions: options } = args

  // for helm status, table clicks should dispatch to kubectl;
  // otherwise, stay with the command (kubectl or helm) that we
  // started with
  const isHelmStatus = command === 'helm' && verb === 'status'
  const drilldownCommand = isHelmStatus ? 'kubectl' : command

  const drilldownVerb =
    (verb === 'get' || verb === 'top'
      ? 'get'
      : command === 'helm' && (verb === 'list' || verb === 'ls')
      ? 'get'
      : isHelmStatus
      ? 'get'
      : verb === 'krew'
      ? verb
      : undefined) || undefined

  // helm doesn't support --output
  const drilldownFormat =
    (drilldownCommand === 'kubectl' || drilldownCommand === 'oc') && drilldownVerb === 'get' ? '-o yaml' : ''

  const ns = options.n || options.namespace
  const drilldownNamespace = ns ? `-n ${encodeComponent(ns)}` : ''

  const kindColumnIdx = preTable[0].findIndex(({ key }) => key === 'KIND')
  const drilldownKind = (nameSplit: string[], row: Pair[]) => {
    if (drilldownVerb === 'get') {
      const kind =
        kindColumnIdx >= 0 ? row[kindColumnIdx].value : nameSplit.length > 1 ? nameSplit[0] : entityTypeFromCommandLine
      return kind ? ' ' + kind : ''
      /* } else if (drilldownVerb === 'config') {
        return ' use-context'; */
    } else if (drilldownVerb === 'krew') {
      return ' ' + entityTypeFromCommandLine
    } else {
      return ''
    }
  }

  // maximum column count across all rows
  const nameColumnIdx = preTable[0].findIndex(({ key }) => key === nameColumn)
  const namespaceColumnIdx = preTable[0].findIndex(({ key }) => key === 'NAMESPACE')
  const maxColumns = preTable.reduce((max, columns) => Math.max(max, columns.length), 0)

  // for kubectl get all... the actual entity type of each table is
  // manifested in the name cell, e.g. "_pod_/mypod"
  let entityTypeFromRows: string

  const rows = preTable.map(
    (rows, idx): Row => {
      const name = nameColumnIdx >= 0 ? rows[nameColumnIdx].value : ''
      const nameSplit = name.split(/\//) // for "get all", the name field will be <kind/entityName>
      const nameForDisplay = nameSplit[1] || rows[0].value
      const nameForDrilldown = nameSplit[1] || name
      const css = ''
      const firstColumnCSS = idx === 0 || rows[0].key !== 'CURRENT' ? css : 'selected-entity'

      // if we have a "name split", e.g. "pod/myPod", then keep track of the "pod" part
      if (nameSplit[1]) {
        if (!entityTypeFromRows) {
          entityTypeFromRows = nameSplit[0]
        } else if (entityTypeFromRows !== nameSplit[0]) {
          entityTypeFromRows = undefined
        }
      }

      const rowIsSelected = rows[0].key === 'CURRENT' && rows[0].value === '*'
      const rowCSS = [rowIsSelected ? 'selected-row' : ''].filter(_ => _)

      // if there isn't a global namespace specifier, maybe there is a row namespace specifier
      // we use the row specifier in preference to a global specifier -- is that right?
      const ns =
        (namespaceColumnIdx >= 0 && command !== 'helm' && `-n ${encodeComponent(rows[namespaceColumnIdx].value)}`) ||
        drilldownNamespace ||
        ''

      // idx === 0: don't click on header row
      const onclick0 =
        idx === 0
          ? false
          : drilldownVerb
          ? `${drilldownCommand} ${drilldownVerb}${drilldownKind(nameSplit, rows)} ${encodeComponent(
              nameForDrilldown
            )} ${drilldownFormat} ${ns}`
          : false
      const onclick = args && typeof onclick0 === 'string' ? withKubeconfigFrom(args, onclick0) : onclick0
      const header = idx === 0 ? 'header-cell' : ''

      // for `k get events`, show REASON and MESSAGE columns when sidecar open
      const columnVisibleWithSidecar = new RegExp(/STATUS|REASON|MESSAGE/i)

      // show TrafficLight.Red if it's a failure reason in `k  get events`
      const maybeRed = (reason: string) => {
        return /failed/i.test(reason) ? TrafficLight.Red : ''
      }

      /**
       * rowKey is the unique string that distinguishes each row
       * option 1. name
       * option 2. `first column`-`name`, e.g. --all-namespaces
       * option 3. `first column`-`idx` when there's no name column, e.g. k get events
       *
       */
      const rowKey = name
        ? isForAllNamespaces(options)
          ? `${rows[0].value}-${name}`
          : name
        : `${rows[0].value}-${idx}`

      return {
        key: rows[0].key,
        name: nameForDisplay,
        rowKey,
        fontawesome: idx !== 0 && rows[0].key === 'CURRENT' && 'fas fa-check',
        onclick: nameColumnIdx === 0 && onclick, // if the first column isn't the NAME column, no onclick; see onclick below
        onclickIdempotent: true,
        css: firstColumnCSS + (rows[0].key === nameColumn ? ' kui--table-cell-is-name' : ''),
        rowCSS,
        outerCSS: `${header} ${outerCSSForKey[rows[0].key] || ''}`,
        attributes: rows
          .slice(1)
          .map(
            ({ key, value: column }, colIdx): Cell => ({
              key,
              tag: idx > 0 && tagForKey[key],
              onclick: colIdx + 1 === nameColumnIdx && onclick, // see the onclick comment: above ^^^; +1 because of slice(1)
              outerCSS: (
                header +
                ' ' +
                (outerCSSForKey[key] || '') +
                (colIdx <= 1 || colIdx === nameColumnIdx - 1 || columnVisibleWithSidecar.test(key)
                  ? ''
                  : ' hide-with-sidecar')
              ).trim(), // nameColumnIndex - 1 beacuse of rows.slice(1)
              css: (
                css +
                ' ' +
                ((idx > 0 && cssForKey[key]) || '') +
                ' ' +
                (cssForValue[column] || (key === 'READY' && cssForReadyCount(column)) || maybeRed(column))
              ).trim(),
              value: key === 'STATUS' && idx > 0 ? column || strings('Unknown') : column
            })
          )
          .concat(fillTo(rows.length, maxColumns))
      }
    }
  )

  const breadcrumbs = await getNamespaceBreadcrumbs(entityTypeFromCommandLine, args)

  return {
    header: Object.assign(rows[0], {
      key: rows[0].key || rows[0].name,
      name: initialCapital(rows[0].name),
      attributes: (rows[0].attributes || []).map(_ => Object.assign(_, { value: initialCapital(_.value) }))
    }),
    body: rows.slice(1),
    noSort: true,
    title: entityTypeFromRows || entityTypeFromCommandLine || '',
    breadcrumbs
  }
}

export type KubeTableResponse = Table | MixedResponse | string

export function isKubeTableResponse(response: KubeTableResponse | RawResponse): response is KubeTableResponse {
  return (
    typeof response === 'string' ||
    isTable(response) ||
    (Array.isArray(response) && response.length > 0 && isTable(response[0]))
  )
}

export function withNotFound(table: Table, stderr: string) {
  const notFounds = stderr
    .split(/\n/)
    .filter(_ => /NotFound/.test(_))
    .map(_ => _.match(/"([^"]+)" not found/)[1])

  if (notFounds.length > 0) {
    const statusIdx = table.body.length === 0 ? -1 : table.body[0].attributes.findIndex(_ => /STATUS/i.test(_.key))
    const attributes =
      table.body.length === 0
        ? []
        : Array(table.body[0].attributes.length)
            .fill(undefined)
            .map((_, idx) => {
              const cell = {} as Cell
              if (idx === statusIdx) {
                const value = 'Offline'
                cell.value = value
                cell.tag = tagForKey['STATUS']
                cell.outerCSS = outerCSSForKey['STATUS']
                cell.css = [cssForKey['STATUS'], cssForValue[value]].join(' ')
              }
              return cell
            })

    notFounds.forEach(name => {
      table.body.push({
        name,
        isDeleted: true,
        attributes
      })
    })
  }

  return table
}

/** Part of `getLimit` */
function hasRecord(data: Arguments['execOptions']['data']): data is Record<string, any> {
  return typeof data === 'object' && data.constructor !== Buffer
}

/** Part of `getLimit`: to make TypeScript happy: a Buffer is an 'object', ... */
function hasBuffer(data: Arguments['execOptions']['data']): data is Buffer {
  return typeof data === 'object' && data.constructor === Buffer
}

/** Extract the `limit` execOptions, if it exists */
function getLimit(args: Arguments<KubeOptions>): number | void {
  const { data } = args.execOptions
  if (hasRecord(data) && !hasBuffer(data)) {
    if (typeof data.limit === 'number') {
      return data.limit
    }
  }
}

/**
 * Display the given string as a REPL table
 *
 */
export const stringToTable = async <O extends KubeOptions>(
  decodedResult: string,
  stderr: string,
  args: Arguments<O>,
  command?: string,
  verb?: string,
  entityType?: string,
  nameColumn?: string
): Promise<KubeTableResponse> => {
  // the ?=\s+ part is a positive lookahead; we want to
  // match only "NAME " but don't want to capture the
  // whitespace
  const preTables = preprocessTable(decodedResult.split(/^(?=LAST SEEN|NAMESPACE|NAME\s+)/m))

  if (preTables && preTables.length === 1 && preTables[0].length === 0) {
    // degenerate case of "really not a table"
    return decodedResult || stderr
  } else if (preTables && preTables.length >= 1) {
    // try use display this as a table
    if (preTables.length === 1) {
      const limit = getLimit(args)
      if (limit && preTables[0].length > limit) {
        preTables[0] = [preTables[0][0]].concat(preTables[0].slice(-limit))
      }

      const T = await formatTable(command, verb, entityType, args, preTables[0], nameColumn)
      if (args.execOptions.filter) {
        T.body = args.execOptions.filter(T.body)
      }
      return withNotFound(T, stderr)
    } else {
      return Promise.all(
        preTables.map(async preTable => {
          const T = await formatTable(command, verb, entityType, args, preTable, undefined)
          if (args.execOptions.filter) {
            T.body = args.execOptions.filter(T.body)
          }
          return withNotFound(T, stderr)
        })
      )
    }
  } else {
    // otherwise, display the raw output
    return decodedResult
  }
}

/**
 * Turn START and END columns into a DURATION column.
 *
 * TODO Kubectl gurus: Is there a way to get this directly from a
 * jsonpath or go-template?  I think so from the latter?
 *
 */
export function computeDurations<T extends Table | KResponse>(table: T): T {
  if (isTable(table)) {
    const header = table.header.attributes

    const statusIdx = header.findIndex(_ => _.key === 'STATUS')
    const startIdx = header.findIndex(_ => _.key === 'START')
    const start2Idx = header.findIndex(_ => _.key === 'START2')
    const endIdx = header.findIndex(_ => _.key === 'END')
    const durationIdx = header.findIndex(_ => _.key === 'Duration')

    if (durationIdx >= 0) {
      table.statusColumnIdx = statusIdx
      table.startColumnIdx = startIdx
      table.completeColumnIdx = endIdx
      table.durationColumnIdx = durationIdx
      return table
    }

    table.statusColumnIdx = statusIdx
    if (startIdx >= 0 && endIdx >= 0) {
      table.startColumnIdx = startIdx
      table.completeColumnIdx = endIdx
      table.durationColumnIdx = header.length

      header.push({ key: 'Duration', value: 'Duration' })
      if (start2Idx >= 0) {
        table.coldStartColumnIdx = header.length
        header.push({ key: 'Cold Start', value: 'Cold Start', outerCSS: 'hide-with-sidecar' })
        header[start2Idx].outerCSS = 'hide'
      }

      table.body.forEach(row => {
        const start = row.attributes[startIdx]
        const end = row.attributes[endIdx]
        const startTime = new Date(start.value).getTime()
        const duration = new Date(end.value).getTime() - startTime

        row.attributes.push({ key: 'Duration', value: isNaN(duration) ? '' : duration.toString() })

        if (start2Idx >= 0) {
          const start2Time = new Date(row.attributes[start2Idx].value).getTime()
          const coldStart = start2Time - startTime
          row.attributes[start2Idx].outerCSS = 'hide'
          row.attributes.push({
            key: 'Cold Start',
            value: isNaN(coldStart) ? '' : coldStart.toString(),
            outerCSS: 'hide-with-sidecar'
          })
        }
      })
    }
  }

  return table
}

/** Change the namespace breadcrumb of the given maybe-Table */
export function withNamespaceBreadcrumb(ns: string, table: Table | MixedResponse) {
  if (isTable(table)) {
    const nsCrumb = { label: ns }
    if (table.breadcrumbs) {
      table.breadcrumbs[0] = nsCrumb
    } else {
      table.breadcrumbs = [nsCrumb]
    }
  }

  return table
}

/** Don't hide this attribute with the sidecar open */
export function showAlways(attr: number | string, table: Table) {
  const pattern = typeof attr === 'string' ? new RegExp(`^${attr}$`, 'i') : undefined
  const idx = typeof attr === 'number' ? attr : table.header.attributes.findIndex(_ => pattern.test(_.key))

  if (idx >= 0) {
    const header = table.header.attributes[idx]
    if (header && header.outerCSS) {
      header.outerCSS = header.outerCSS.replace(/kui--hide-in-narrower-windows/, '')
      header.outerCSS = header.outerCSS.replace(/hide-with-sidecar/, '')
    }

    table.body.forEach(row => {
      const attr = row.attributes[idx]
      if (attr && attr.outerCSS) {
        attr.outerCSS = attr.outerCSS.replace(/kui--hide-in-narrower-windows/, '')
        attr.outerCSS = attr.outerCSS.replace(/hide-with-sidecar/, '')
      }
    })
  }
}

/** Don't show this attribute with the sidecar open */
export function hideWithSidecar(attr: number | string, table: Table) {
  const pattern = typeof attr === 'string' ? new RegExp(`^${attr}$`, 'i') : undefined
  const idx = typeof attr === 'number' ? attr : table.header.attributes.findIndex(_ => pattern.test(_.key))

  if (idx >= 0) {
    const header = table.header.attributes[idx]
    header.outerCSS += 'kui--hide-in-narrower-windows'

    table.body.forEach(row => {
      const attr = row.attributes[idx]
      if (attr && attr.outerCSS) {
        attr.outerCSS += 'kui--hide-in-narrower-windows'
      }
    })
  }
}

export async function toKuiTable(
  table: MetaTable,
  kind: string | Promise<string>,
  args: Arguments<KubeOptions>
): Promise<Table> {
  const format = formatOf(args)
  const forAllNamespaces = isForAllNamespaces(args.parsedOptions)
  const includedColumns = table.columnDefinitions.map(_ => format === 'wide' || _.priority === 0)
  const columnDefinitions = table.columnDefinitions.filter(_ => format === 'wide' || _.priority === 0)

  const drilldownCommand = getCommandFromArgs(args)
  const drilldownVerb = 'get'
  const drilldownKind = await kind
  const drilldownFormat = '-o yaml'

  const onclickFor = (row: MetaTable['rows'][0], name: string) => {
    const drilldownNamespace = `-n ${row.object.metadata.namespace}`
    return withKubeconfigFrom(
      args,
      `${drilldownCommand} ${drilldownVerb} ${drilldownKind} ${encodeComponent(
        name
      )} ${drilldownFormat} ${drilldownNamespace}`
    )
  }

  const header = {
    name: forAllNamespaces ? 'Namespace' : columnDefinitions[0].name,
    attributes: columnDefinitions.slice(forAllNamespaces ? 0 : 1).map(_ => ({
      key: _.name,
      value: _.name,
      outerCSS: outerCSSForKey[_.name]
    }))
  }

  const nameColumnIdx = /Name/i.test(header.name) ? 0 : header.attributes.findIndex(_ => /Name/i.test(_.key)) + 1

  const body = table.rows.map((row, idx) => {
    const cells = row.cells.filter((cell, idx) => includedColumns[idx])
    const name = cells[nameColumnIdx].toString()

    /**
     * rowKey is the unique string that distinguishes each row
     * option 1. name
     * option 2. `first column`-`name`, e.g. --all-namespaces
     * option 3. `first column`-`idx` when there's no name column, e.g. k get events
     *
     */
    const rowKey = name
      ? forAllNamespaces
        ? `${forAllNamespaces ? row.object.metadata.namespace : cells[0]}-${name}`
        : name
      : `${cells[0]}-${idx}`

    const onclick = onclickFor(row, name)

    return {
      key: forAllNamespaces ? row.object.metadata.namespace : columnDefinitions[0].name,
      rowKey,
      name: forAllNamespaces ? row.object.metadata.namespace : name,
      onclick: forAllNamespaces ? false : onclick,
      attributes: cells.slice(forAllNamespaces ? 0 : 1).map((cell, idx) => {
        const key = columnDefinitions[forAllNamespaces ? idx : idx + 1].name.toUpperCase()
        const value = cell.toString()

        return {
          key,
          value,
          tag: tagForKey[key],
          onclick: !forAllNamespaces || idx > 0 ? false : onclick,
          outerCSS: outerCSSForKey[key],
          css: [cssForKey[key], cssForValue[value], /Ready/i.test(key) ? cssForReadyCount(value) : ''].join(' ')
        }
      })
    }
  })

  return {
    header,
    body,
    title: await kind,
    resourceVersion: table.metadata.resourceVersion,
    breadcrumbs: await getNamespaceBreadcrumbs(await kind, args)
  }
}
