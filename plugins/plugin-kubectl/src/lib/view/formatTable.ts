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

import { Table, Row, Cell, isTable, encodeComponent, Arguments, MixedResponse, i18n } from '@kui-shell/core'

import TrafficLight from '../model/traffic-light'
import KubeOptions, { isForAllNamespaces } from '../../controller/kubectl/options'
import { RawResponse } from '../../controller/kubectl/response'

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
  MESSAGE: 'not-too-compact hide-with-sidecar',
  TYPE: 'hide-with-sidecar',

  CLUSTER: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // kubectl config get-contexts
  AUTHINFO: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // kubectl config get-contexts
  REFERENCE: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // istio autoscaler

  'CREATED AT': 'hide-with-sidecar',

  // kubectl get deployment
  CURRENT: 'entity-name-group entity-name-group-extra-narrow text-center',
  DESIRED: 'entity-name-group entity-name-group-extra-narrow text-center',

  RESTARTS: 'very-narrow',

  'LAST SEEN': 'hide-with-sidecar entity-name-group-extra-narrow', // kubectl get events
  'FIRST SEEN': 'hide-with-sidecar entity-name-group-extra-narrow', // kubectl get events

  COUNT: 'keep-with-sidecar',

  REVISION: 'hide-with-sidecar', // helm ls
  AGE: 'hide-with-sidecar very-narrow', // e.g. helm status and kubectl get svc
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
  STATUS: 'badge'
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

/** normalize the status badge by capitalization */
const capitalize = (str: string): string => {
  return !str ? '' : str[0].toUpperCase() + str.slice(1).toLowerCase()
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

export const formatTable = <O extends KubeOptions>(
  command: string,
  verb: string,
  entityTypeFromCommandLine: string,
  options: O,
  preTable: Pair[][],
  nameColumn = 'NAME'
): Table => {
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
      const onclick =
        idx === 0
          ? false
          : drilldownVerb
          ? `${drilldownCommand} ${drilldownVerb}${drilldownKind(nameSplit, rows)} ${encodeComponent(
              nameForDrilldown
            )} ${drilldownFormat} ${ns}`
          : false
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
        onclickSilence: true,
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
              outerCSS:
                header +
                ' ' +
                (outerCSSForKey[key] || '') +
                (colIdx <= 1 || colIdx === nameColumnIdx - 1 || columnVisibleWithSidecar.test(key)
                  ? ''
                  : ' hide-with-sidecar'), // nameColumnIndex - 1 beacuse of rows.slice(1)
              css:
                css +
                ' ' +
                ((idx > 0 && cssForKey[key]) || '') +
                ' ' +
                (cssForValue[column] || (key === 'READY' && cssForReadyCount(column)) || maybeRed(column)),
              value: key === 'STATUS' && idx > 0 ? capitalize(column || 'unknown') : column
            })
          )
          .concat(fillTo(rows.length, maxColumns))
      }
    }
  )

  return {
    header: rows[0],
    body: rows.slice(1),
    noSort: true,
    title: capitalize(entityTypeFromRows || entityTypeFromCommandLine),
    breadcrumbs: [{ label: ns || (isForAllNamespaces(options) && strings('all')) || 'default' }]
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

function withNotFound(table: Table, stderr: string) {
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

/**
 * Display the given string as a REPL table
 *
 */
export const stringToTable = <O extends KubeOptions>(
  decodedResult: string,
  stderr: string,
  args: Arguments<O>,
  command?: string,
  verb?: string,
  entityType?: string,
  nameColumn?: string
): KubeTableResponse => {
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
      const T = formatTable(command, verb, entityType, args.parsedOptions, preTables[0], nameColumn)
      if (args.execOptions.filter) {
        T.body = args.execOptions.filter(T.body)
      }
      return withNotFound(T, stderr)
    } else {
      return preTables.map(preTable => {
        const T = formatTable(command, verb, entityType, args.parsedOptions, preTable)
        if (args.execOptions.filter) {
          T.body = args.execOptions.filter(T.body)
        }
        return withNotFound(T, stderr)
      })
    }
  } else {
    // otherwise, display the raw output
    return decodedResult
  }
}
