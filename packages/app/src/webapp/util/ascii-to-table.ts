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
const debug = Debug('core/webapp/util/ascii-to-table')

import stripClean from 'strip-ansi'

import * as repl from '@kui-shell/core/core/repl'
import { ParsedOptions } from '@kui-shell/core/models/command'
import { Cell, Row, Table } from '@kui-shell/core/webapp/models/table'

/**
 * Find the column splits
 *
 */
export const preprocessTable = (raw: string[]): { rows?: IPair[][]; trailingString?: string }[] => {
  debug('preprocessTable', raw)

  return raw.map(table => {
    const header = table
      .substring(0, table.indexOf('\n'))

    const headerCells = header
      .split(/(\t|\s\s)+\s?/)
      .filter(x => x && !x.match(/(\t|\s\s)/))
      .map(_ => _.trim())

    // now we scan the header row to determine the column start indices
    const columnStarts: number[] = []

    for (let idx = 0, jdx = 0; idx < headerCells.length; idx++) {
      const { offset, prefix } = idx === 0
        ? { offset: 0, prefix: '' }
        : { offset: 1, prefix: ' ' }

      const newJdx = header.indexOf(prefix + headerCells[idx] + ' ', jdx)
      if (newJdx < 0) {
        // last column
        jdx = header.indexOf(' ' + headerCells[idx], jdx)
      } else {
        jdx = newJdx
      }
      columnStarts.push(jdx + offset)
    }

    debug('columnStarts', columnStarts, headerCells)

    // do we have just tiny columns? if so, it's not worth tabularizing
    const tinyColumns = columnStarts.reduce((yup, start, idx) => {
      return yup || (idx > 0 && start - columnStarts[idx - 1] <= 2)
    }, false)

    if (columnStarts.length <= 1 || tinyColumns) {
      // probably not a table
      return {
        trailingString: table
      }
    } else {
      const lowerBoundLastColumnEnd = columnStarts[columnStarts.length - 1]

      const possibleRows = table
        .split(/\n/)
      debug('possibleRows', possibleRows)

      // look to see if any of the possibleRows violate the
      // columnStarts alignment; this is a good indication that the
      // possibleRows are not really rows of a table
      const endOfTable = possibleRows.findIndex((row, rowIdx) => {
        const nope = columnStarts.findIndex(idx => {
          return idx > 0 && !/\s/.test(row[idx - 1])
        })

        return nope !== -1
      })
      debug('endOfTable', endOfTable, possibleRows)

      const rows = endOfTable === -1 ? possibleRows : possibleRows.slice(0, endOfTable)

      const preprocessed = rows.map((line, idx) => {
        return split(line, columnStarts, headerCells)
      }).filter(x => x)
      debug('preprocessed', preprocessed)

      const trailingString = endOfTable !== -1 && possibleRows.slice(endOfTable).join('\n')
      debug('trailingString', trailingString)

      return {
        trailingString,
        rows: preprocessed
      }
    }
  })
}

/** normalize the status badge by capitalization */
const capitalize = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Several commands seem to be cropping up that give a facade over
 * kubectl; this is a start at such a list
 *
 * 1) kubectl, bien sûr
 * 2) oc, redhat openshift CLI
 *
 */
const kubelike = /kubectl|oc/
const isKubeLike = (command: string): boolean => kubelike.test(command)

/**
 * Turn an IPair[][], i.e. a table of key-value pairs into a Table,
 * i.e. kui Table model. IPair is defined below, it is internal just
 * to this file.
 *
 * TODO factor out kube-specifics to plugin-k8s
 *
 */
export const formatTable = (command: string, verb: string, entityType: string, options: ParsedOptions, lines: IPair[][]): Table => {
  // for helm status, table clicks should dispatch to kubectl;
  // otherwise, stay with the command (kubectl or helm) that we
  // started with
  const isHelmStatus = command === 'helm' && verb === 'status'
  const drilldownCommand = isHelmStatus ? 'kubectl' : command
  const isKube = isKubeLike(drilldownCommand)

  const drilldownVerb = (
    verb === 'get' ? 'get'
      : command === 'helm' && (verb === 'list' || verb === 'ls') ? 'status'
        : isHelmStatus ? 'get' : undefined
  ) || undefined

  // helm doesn't support --output
  const drilldownFormat = isKube && drilldownVerb === 'get' ? '-o yaml' : ''

  const drilldownNamespace = options.n || options.namespace
    ? `-n ${repl.encodeComponent(options.n || options.namespace)}`
    : ''

  const config = options.config
    ? `--config ${repl.encodeComponent(options.config)}`
    : ''

  const drilldownKind = nameSplit => {
    debug('drilldownKind', nameSplit)
    if (drilldownVerb === 'get') {
      const kind = nameSplit.length > 1 ? nameSplit[0] : entityType
      return kind ? ' ' + kind : ''
      /* } else if (drilldownVerb === 'config') {
        return ' use-context'; */
    } else {
      return ''
    }
  }

  // maximum column count across all rows
  const nameColumnIdx = Math.max(0, lines[0].findIndex(({ key }) => key === 'NAME'))
  const namespaceColumnIdx = lines[0].findIndex(({ key }) => key === 'NAMESPACE')
  const maxColumns = lines.reduce((max, columns) => Math.max(max, columns.length), 0)

  const allRows: Row[] = lines.map((columns, idx) => {
    const name = columns[nameColumnIdx].value
    const nameSplit = name.split(/\//) // for "get all", the name field will be <kind/entityName>
    const nameForDisplay = columns[0].value
    const nameForDrilldown = nameSplit[1] || name
    const css = ''
    const firstColumnCSS = idx === 0 || columns[0].key !== 'CURRENT'
      ? css : 'selected-entity'

    const rowIsSelected = columns[0].key === 'CURRENT' && nameForDisplay === '*'
    const rowKey = columns[0].key
    const rowValue = columns[0].value
    const rowCSS = [
      (cssForKeyValue[rowKey] && cssForKeyValue[rowKey][rowValue]) || '',
      rowIsSelected ? 'selected-row' : ''
    ]

    // if there isn't a global namespace specifier, maybe there is a row namespace specifier
    // we use the row specifier in preference to a global specifier -- is that right?
    const ns = (namespaceColumnIdx >= 0 &&
      command !== 'helm' &&
      `-n ${repl.encodeComponent(columns[namespaceColumnIdx].value)}`) || drilldownNamespace || ''

    // idx === 0: don't click on header row
    const onclick = idx === 0 ? false
      : drilldownVerb ? `${drilldownCommand} ${drilldownVerb}${drilldownKind(nameSplit)} ${repl.encodeComponent(nameForDrilldown)} ${drilldownFormat} ${ns} ${config}`
        : false

    const attributes: Cell[] = columns.slice(1).map(({ key, value: column }, colIdx) => ({
      key,
      tag: idx > 0 && tagForKey[key],
      onclick: colIdx + 1 === nameColumnIdx && onclick, // see the onclick comment: above ^^^; +1 because of slice(1)
      outerCSS: outerCSSForKey[key] +
        (colIdx <= 1 || colIdx === nameColumnIdx - 1 || /STATUS/i.test(key) ? '' : ' hide-with-sidecar'), // nameColumnIndex - 1 beacuse of rows.slice(1)
      css: css
        + ' ' + ((idx > 0 && cssForKey[key]) || '') + ' ' + (cssForValue[column] || ''),
      value: idx > 0 && /STATUS|STATE/i.test(key) ? capitalize(column) : column
    })).concat(fillTo(columns.length, maxColumns))

    const row: Row = {
      key: columns[nameColumnIdx].key,
      name: nameForDisplay,
      fontawesome: idx !== 0 && columns[0].key === 'CURRENT' && 'fas fa-network-wired',
      onclick: nameColumnIdx === 0 && onclick, // if the first column isn't the NAME column, no onclick; see onclick below
      css: firstColumnCSS,
      rowCSS,
      // title: tables.length > 1 && idx === 0 && lines.length > 1 && kindFromResourceName(lines[1][0].value),
      outerCSS: outerCSSForKey[columns[0].key] || '',
      attributes
    }

    return row
  })

  const hasHeader = !/[:/]/.test(allRows[0].name)
  const header = hasHeader ? allRows[0] : undefined
  const body = hasHeader ? allRows.slice(1) : allRows

  return {
    title: entityType,
    header,
    body,
    noSort: true
  }
}

/**
 * Split the given string at the given split indices
 *
 */
interface IPair {
  key: string
  value: string
}
const split = (str: string, splits: number[], headerCells?: string[]): IPair[] => {
  return splits.map((splitIndex, idx) => {
    return {
      key: headerCells && headerCells[idx],
      value: str.substring(splitIndex, splits[idx + 1] || str.length).trim()
    }
  })
}

/**
 * Return an array with at least maxColumns entries
 *
 */
const fillTo = (length, maxColumns) => {
  if (length >= maxColumns) {
    return []
  } else {
    return new Array(maxColumns - length).fill('')
  }
}

/** decorate certain columns specially */
const outerCSSForKey = {
  NAME: 'entity-name-group',
  READY: 'a-few-numbers-wide',
  STATE: 'badge-width',
  STATUS: 'badge-width',
  KIND: 'max-width-id-like entity-kind',

  NAMESPACE: 'entity-name-group entity-name-group-narrow',

  DISPLAY: 'hide-with-sidecar',
  TYPE: 'hide-with-sidecar',
  ENDPOINT: 'hide-with-sidecar',

  CLUSTER: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // kubectl config get-contexts
  AUTHINFO: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // kubectl config get-contexts
  REFERENCE: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // istio autoscaler

  'CREATED': 'hide-with-sidecar',
  'CREATED AT': 'hide-with-sidecar',

  ID: 'max-width-id-like',

  // kubectl get deployment
  CURRENT: 'entity-name-group entity-name-group-extra-narrow text-center',
  DESIRED: 'entity-name-group entity-name-group-extra-narrow text-center',

  RESTARTS: 'very-narrow',

  'LAST SEEN': 'hide-with-sidecar entity-name-group-extra-narrow', // kubectl get events
  'FIRST SEEN': 'hide-with-sidecar entity-name-group-extra-narrow', // kubectl get events

  UPDATED: 'min-width-date-like', // helm ls
  REVISION: 'hide-with-sidecar', // helm ls
  AGE: 'very-narrow', // e.g. helm status and kubectl get svc
  'PORT(S)': 'entity-name-group entity-name-group-narrow hide-with-sidecar', // helm status for services
  SUBOBJECT: 'entity-name-group entity-name-group-extra-narrow' // helm ls
}

const cssForKey = {
  // kubectl get events
  NAME: 'entity-name',
  SOURCE: 'lighter-text smaller-text',
  SUBOBJECT: 'lighter-text smaller-text',
  'CREATED AT': 'lighter-text smaller-text',

  AGE: 'slightly-deemphasize',

  'APP VERSION': 'pre-wrap slightly-deemphasize', // helm ls
  UPDATED: 'slightly-deemphasize somewhat-smaller-text'
}

const tagForKey = {
  PHASE: 'badge',
  STATE: 'badge',
  STATUS: 'badge'
}

const cssForKeyValue = {
}

/** decorate certain values specially */
const cssForValue = {
  // generic
  NORMAL: 'green-background',
  Normal: 'green-background',
  normal: 'green-background',

  // helm lifecycle
  UNKNOWN: '',
  DEPLOYED: 'green-background',
  DELETED: '',
  SUPERSEDED: 'yellow-background',
  FAILED: 'red-background',
  DELETING: 'yellow-background',

  // pod lifecycle
  'Init:0/1': 'yellow-background',
  PodScheduled: 'yellow-background',
  PodInitializing: 'yellow-background',
  Initialized: 'yellow-background',
  Terminating: 'yellow-background',

  // kube lifecycle
  CrashLoopBackOff: 'red-background',
  Error: 'red-background',
  Failed: 'red-background',
  Running: 'green-background',
  Pending: 'yellow-background',
  Completed: 'gray-background', // successfully terminated; don't use a color
  Unknown: '',

  // AWS events
  Ready: 'green-background',
  ProvisionedSuccessfully: 'green-background',

  // kube events
  Active: 'green-background',
  Online: 'green-background',
  NodeReady: 'green-background',
  Pulled: 'green-background',
  Rebooted: 'green-background',
  Started: 'green-background',
  Created: 'green-background',
  Succeeded: 'green-background',
  SuccessfulCreate: 'green-background',
  SuccessfulMountVol: 'green-background',
  ContainerCreating: 'yellow-background',
  Starting: 'yellow-background',
  NodeNotReady: 'yellow-background',
  Killing: 'yellow-background',
  Deleting: 'yellow-background',
  Pulling: 'yellow-background',
  BackOff: 'yellow-background',
  FailedScheduling: 'red-background',
  FailedKillPod: 'red-background'
}
