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

const debug = require('debug')('k8s/formatters/formatTable')

import repl = require('../../../../../../build/core/repl')

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
  READY: 'entity-narrow',
  STATUS: 'entity-kind',
  KIND: 'max-width-id-like',

  CLUSTER: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // kubectl config get-contexts
  AUTHINFO: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // kubectl config get-contexts
  REFERENCE: 'entity-name-group entity-name-group-narrow hide-with-sidecar', // istio autoscaler

  'CREATED AT': 'hide-with-sidecar',

  // kubectl get deployment
  CURRENT: 'entity-name-group entity-name-group-extra-narrow text-center',
  DESIRED: 'entity-name-group entity-name-group-extra-narrow text-center',

  'LAST SEEN': 'hide-with-sidecar entity-name-group-extra-narrow', // kubectl get events
  'FIRST SEEN': 'hide-with-sidecar entity-name-group-extra-narrow', // kubectl get events

  AGE: 'entity-name-group-extra-narrow', // helm status
  'PORT(S)': 'entity-name-group entity-name-group-narrow hide-with-sidecar', // helm status for services
  SUBOBJECT: 'entity-name-group entity-name-group-extra-narrow' // helm ls
}

const cssForKey = {
  // kubectl get events
  NAME: 'entity-name',
  SOURCE: 'deemphasize',
  SUBOBJECT: 'deemphasize',
  'CREATED AT': 'slightly-deemphasize',

  STATUS: 'even-smaller-text',
  UPDATED: 'deemphasize'
}

const tagForKey = {
  STATUS: 'badge'
}

const cssForKeyValue = {
}

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
  Succeeded: '', // successfully terminated; don't use a color
  Unknown: '',

  // AWS events
  Ready: 'green-background',
  ProvisionedSuccessfully: 'green-background',

  // kube events
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
 * If the given resource name is of the form <kind>/<name>, then
 * return kind, otherwise return undefined
 *
 */
const resourceNameWithKindPattern = /^([^/]+)\/[^/]+$/
const kindFromResourceName = fqn => {
  const match = fqn.match(resourceNameWithKindPattern)
  const kind = match && match.length === 2 && match[1]
  return kind.charAt(kind.length - 1) === 's' ? kind : `${kind}s`
}

/**
 * Split the given string at the given split indices
 *
 */
interface IPair {
  key: string
  value: string
}
const split = (str: string, splits: Array<number>, headerCells?: Array<string>): Array<IPair> => {
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
export const preprocessTable = (raw: Array<string>) => {
  debug('preprocessTable', raw)

  return raw.map(table => {
    const header = table.substring(0, table.indexOf('\n'))

    const headerCells = header.split(/(\t|\s\s)+\s?/).filter(x => x && !x.match(/(\t|\s\s)/))
    const columnStarts: Array<number> = []
    for (let idx = 0, jdx = 0; idx < headerCells.length; idx++) { // tslint:disable-line
      jdx = header.indexOf(headerCells[idx] + ' ', jdx)
      if (jdx < 0) {
        // last column
        jdx = header.indexOf(headerCells[idx], jdx)
      }
      columnStarts.push(jdx)
    }

    debug('columnStarts', columnStarts, headerCells)

    return table
      .split(/\n/)
      .filter(x => x)
      .map(line => split(line, columnStarts, headerCells))
  })
}

export const formatTable = (command: string, verb: string, entityType: string, options, tables: Array<any>): Array<any> => {
  const drilldownVerb = verb === 'get' ? 'get'
  // : verb === 'config' ? verb
    : command === 'helm' && (verb === 'list' || verb === 'ls') ? 'status'
    : undefined

  // helm doesn't support --output
  const drilldownFormat = command === 'kubectl' && drilldownVerb === 'get' ? '--output=yaml' : ''

  const drilldownNamespace = options.n || options.namespace
    ? `-n ${repl.encodeComponent(options.n || options.namespace)}`
    : ''

  const drilldownKind = nameSplit => {
    if (drilldownVerb === 'get') {
      const kind = nameSplit.length > 1 ? nameSplit[0] : entityType
      return kind ? ' ' + kind : ''
      /*} else if (drilldownVerb === 'config') {
        return ' use-context';*/
    } else {
      return ''
    }
  }

  return tables.map(lines => {
    // maximum column count across all rows
    const nameColumnIdx = Math.max(0, lines[0].findIndex(({ key }) => key === 'NAME'))
    const namespaceColumnIdx = lines[0].findIndex(({ key }) => key === 'NAMESPACE')
    const maxColumns = lines.reduce((max, columns) => Math.max(max, columns.length), 0)

    return lines.map((columns, idx) => {
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
        : drilldownVerb ? () => repl.pexec(`${command} ${drilldownVerb}${drilldownKind(nameSplit)} ${repl.encodeComponent(nameForDrilldown)} ${drilldownFormat} ${ns}`)
        : false

      const header = idx === 0 ? 'header-cell' : ''

      return {
        key: columns[nameColumnIdx].key,
        name: nameForDisplay,
        fontawesome: idx !== 0 && columns[0].key === 'CURRENT' && 'fas fa-network-wired',
        onclick,
        noSort: true,
        css: firstColumnCSS,
        rowCSS,
        title: tables.length > 1 && idx === 0 && lines.length > 1 && kindFromResourceName(lines[1][0].value),
        outerCSS: `${header} ${outerCSSForKey[columns[0].key] || ''}`,
        attributes: columns.slice(1).map(({ key, value: column }, colIdx) => ({
          key,
          tag: idx > 0 && tagForKey[key],
          outerCSS: header + ' ' + outerCSSForKey[key] +
            (colIdx <= 1 || colIdx === nameColumnIdx - 1 ? '' : ' hide-with-sidecar'), // nCI - 1 beacuse of columns.slice(1)
          css: css
            + ' ' + ((idx > 0 && cssForKey[key]) || '') + ' ' + (cssForValue[column] || ''),
          value: column
        })).concat(fillTo(columns.length, maxColumns))
      }
    })
  })
}
