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

import { Row, Table } from '@kui-shell/core/webapp/models/table'
const debug = require('debug')('k8s/formatters/formatTable')

import repl = require('@kui-shell/core/core/repl')

/** return an array with at least maxColumns entries */
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
  KIND: 'max-width-id-like entity-kind',

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

  UPDATED: 'min-width-date-like', // helm ls
  'REVISION UPDATED': 'hide-with-sidecar', // helm ls
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
  'CREATED AT': 'lighter-text smaller-text',

  AGE: 'slightly-deemphasize',

  'APP VERSION': 'pre-wrap slightly-deemphasize', // helm ls
  UPDATED: 'slightly-deemphasize somewhat-smaller-text'
}

const tagForKey = {
  STATUS: 'badge'
}

const cssForKeyValue = {}

/** decorate certain values specially */
const cssForValue = {
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
  Failed: 'red-background',
  Running: 'green-background',
  Pending: 'yellow-background',
  Succeeded: 'gray-background', // successfully terminated; don't use a color
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

/**
 * Split the given string at the given split indices
 *
 */
interface Pair {
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
 * Find the column splits
 *
 */
export const preprocessTable = (raw: string[]) => {
  debug('preprocessTable', raw)

  return raw.map(table => {
    const header = table.substring(0, table.indexOf('\n')).replace(/\t/g, ' ')
    const headerCells = header.split(/(\t|\s\s)+\s?/).filter(x => x && !x.match(/(\t|\s\s)/))
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

    debug('columnStarts', columnStarts, headerCells)

    return table
      .split(/\n/)
      .filter(x => x)
      .map(line => split(line, columnStarts, headerCells))
  })
}

/** normalize the status badge by capitalization */
const capitalize = (str: string): string => {
  return !str ? 'Unknown' : str[0].toUpperCase() + str.slice(1).toLowerCase()
}

export const formatTable = (
  command: string,
  verb: string,
  entityTypeFromCommandLine: string,
  options,
  preTable: Pair[][]
): Table => {
  // debug('formatTable', preTable)
  // for helm status, table clicks should dispatch to kubectl;
  // otherwise, stay with the command (kubectl or helm) that we
  // started with
  const isHelmStatus = command === 'helm' && verb === 'status'
  const drilldownCommand = isHelmStatus ? 'kubectl' : command

  const drilldownVerb =
    (verb === 'get'
      ? 'get'
      : command === 'helm' && (verb === 'list' || verb === 'ls')
      ? 'get'
      : isHelmStatus
      ? 'get'
      : undefined) || undefined

  // helm doesn't support --output
  const drilldownFormat = drilldownCommand === 'kubectl' && drilldownVerb === 'get' ? '-o yaml' : ''

  const drilldownNamespace =
    options.n || options.namespace ? `-n ${repl.encodeComponent(options.n || options.namespace)}` : ''

  const kindColumnIdx = preTable[0].findIndex(({ key }) => key === 'KIND')
  const drilldownKind = (nameSplit: string[], row: Pair[]) => {
    debug('drilldownKind', nameSplit)
    if (drilldownVerb === 'get') {
      const kind =
        kindColumnIdx >= 0 ? row[kindColumnIdx].value : nameSplit.length > 1 ? nameSplit[0] : entityTypeFromCommandLine
      return kind ? ' ' + kind : ''
      /* } else if (drilldownVerb === 'config') {
        return ' use-context'; */
    } else {
      return ''
    }
  }

  // maximum column count across all rows
  const nameColumnIdx = Math.max(0, preTable[0].findIndex(({ key }) => key === 'NAME'))
  const namespaceColumnIdx = preTable[0].findIndex(({ key }) => key === 'NAMESPACE')
  const maxColumns = preTable.reduce((max, columns) => Math.max(max, columns.length), 0)

  // for kubectl get all... the actual entity type of each table is
  // manifested in the name cell, e.g. "_pod_/mypod"
  let entityTypeFromRows: string

  const rows = preTable.map(
    (rows, idx): Row => {
      const name = rows[nameColumnIdx].value
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
      const rowKey = rows[0].key
      const rowValue = rows[0].value
      const rowCSS = [
        (cssForKeyValue[rowKey] && cssForKeyValue[rowKey][rowValue]) || '',
        rowIsSelected ? 'selected-row' : ''
      ]

      // if there isn't a global namespace specifier, maybe there is a row namespace specifier
      // we use the row specifier in preference to a global specifier -- is that right?
      const ns =
        (namespaceColumnIdx >= 0 &&
          command !== 'helm' &&
          `-n ${repl.encodeComponent(rows[namespaceColumnIdx].value)}`) ||
        drilldownNamespace ||
        ''

      // idx === 0: don't click on header row
      const onclick =
        idx === 0
          ? false
          : drilldownVerb
          ? `${drilldownCommand} ${drilldownVerb}${drilldownKind(nameSplit, rows)} ${repl.encodeComponent(
              nameForDrilldown
            )} ${drilldownFormat} ${ns}`
          : false

      const header = idx === 0 ? 'header-cell' : ''

      return {
        key: rows[0].key,
        name: nameForDisplay,
        fontawesome: idx !== 0 && rows[0].key === 'CURRENT' && 'fas fa-check',
        onclick: nameColumnIdx === 0 && onclick, // if the first column isn't the NAME column, no onclick; see onclick below
        css: firstColumnCSS,
        rowCSS,
        outerCSS: `${header} ${outerCSSForKey[rows[0].key] || ''}`,
        attributes: rows
          .slice(1)
          .map(({ key, value: column }, colIdx) => ({
            key,
            tag: idx > 0 && tagForKey[key],
            onclick: colIdx + 1 === nameColumnIdx && onclick, // see the onclick comment: above ^^^; +1 because of slice(1)
            outerCSS:
              header +
              ' ' +
              outerCSSForKey[key] +
              (colIdx <= 1 || colIdx === nameColumnIdx - 1 || /STATUS/i.test(key) ? '' : ' hide-with-sidecar'), // nameColumnIndex - 1 beacuse of rows.slice(1)
            css: css + ' ' + ((idx > 0 && cssForKey[key]) || '') + ' ' + (cssForValue[column] || ''),
            value: key === 'STATUS' && idx > 0 ? capitalize(column) : column
          }))
          .concat(fillTo(rows.length, maxColumns))
      }
    }
  )

  return {
    header: rows[0],
    body: rows.slice(1),
    noSort: true,
    title: entityTypeFromRows || entityTypeFromCommandLine
  }
}
