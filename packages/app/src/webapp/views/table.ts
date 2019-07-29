/*
 * Copyright 2017-18 IBM Corporation
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

import { Tab, isPopup, getCurrentPrompt } from '../cli'
import { pexec, qexec } from '../../core/repl'
import {
  Table,
  MultiTable,
  Row,
  Cell,
  Icon,
  TableStyle,
  WatchableTable,
  diffTableRows,
  isMultiTable,
  isTable
} from '../models/table'
import { isWatchable } from '../models/basicModels'
import { applyDiffTable } from '../views/diffTable'
import { theme } from '@kui-shell/core/core/settings'
import { _split as split, Split } from '@kui-shell/core/core/repl'
import { WatchableJob } from '@kui-shell/core/core/job'
import minimist = require('yargs-parser')

const debug = Debug('webapp/views/table')

const tablePollingInterval = (theme && theme.tablePollingInterval) || 3000
debug('tablePollingInterval', tablePollingInterval)

interface TableFormatOptions {
  usePip?: boolean
}

/** groups of States that mark desired final outcomes */
// NOTE: This is a copy from kubectl plguin, and we should port models/states in kubectl plugin to the core
enum FinalState {
  NotPendingLike,
  OnlineLike,
  OfflineLike
}

// sort the body of table
export const sortBody = (rows: Row[]): Row[] => {
  return rows.sort(
    (a, b) =>
      (a.prettyType || a.type || '').localeCompare(b.prettyType || b.type || '') ||
      (a.packageName || '').localeCompare(b.packageName || '') ||
      a.name.localeCompare(b.name)
  )
}

/**
 * get an array of row models
 *
 */

const prepareTable = (tab: Tab, response: Table | WatchableTable): Row[] => {
  const { header, body, noSort } = response

  if (header) {
    header.outerCSS = `${header.outerCSS || ''} header-cell`

    if (header.attributes) {
      header.attributes.forEach(cell => {
        cell.outerCSS = `${cell.outerCSS || ''} header-cell`
      })
    }
  }
  // sort the list, then format each element, then add the results to the resultDom
  // (don't sort lists of activations. i wish there were a better way to do this)
  return [header].concat(noSort ? body : sortBody(body)).filter(x => x)
}

// maybe the resources in table have all reach to the final state?
const hasReachedFinalState = (response: Table | MultiTable): boolean => {
  let reachedFinalState = false

  if (isTable(response)) {
    if (!response.body.some(row => !row.done)) {
      reachedFinalState = true // stop watching if all resources have reached to the finial state
    }

    return reachedFinalState
  } else if (isMultiTable(response)) {
    let allDone = true // allDone is used to indicate if all resources have reached to the final state

    response.tables.map(table => {
      if (table.body.some(row => !row.done)) {
        allDone = false
      }
    })

    reachedFinalState = allDone
  }

  return reachedFinalState
}

const registerWatcher = (
  tab: Tab,
  watchLimit: number = 100000,
  command: string,
  resultDom: HTMLElement,
  tableViewInfo: TableViewInfo | TableViewInfo[]
) => {
  // the current watch interval; used for clear/reset/stop
  let job: WatchableJob // eslint-disable-line prefer-const

  const stopWatching = () => {
    job.abort()
  }

  const processRefreshResponse = (response: Table | MultiTable) => {
    if (!isTable(response) && !isMultiTable(response)) {
      console.error('refresh result is not a table', response)
      throw new Error('refresh result is not a table')
    }

    const reachedFinalState = hasReachedFinalState(response)

    return isTable(response)
      ? { table: prepareTable(tab, response), reachedFinalState }
      : {
          tables: response.tables.map(table => {
            return prepareTable(tab, table)
          }),
          reachedFinalState
        }
  }

  const refreshTable = async () => {
    debug(`refresh with ${command}`)
    let processedTableRow: Row[] = []
    let processedMultiTableRow: Row[][] = []

    try {
      const response: Table | MultiTable = await qexec(command)

      const processedResponse = processRefreshResponse(response)

      processedTableRow = processedResponse.table
      processedMultiTableRow = processedResponse.tables

      // stop watching if all resources in the table reached to the finial state
      if (processedResponse.reachedFinalState) {
        stopWatching()
      }
    } catch (err) {
      if (err.code === 404) {
        // parse the refresh command
        const { A: argv } = split(command, true, true) as Split
        const options = minimist(argv)

        if (options['final-state'] && FinalState[options['finalState']] === 'OfflineLike') {
          debug('resource not found after status check, but that is ok because that is what we wanted')
          stopWatching()
        }
      } else {
        while (resultDom.firstChild) {
          resultDom.removeChild(resultDom.firstChild)
        }
        stopWatching()
        throw err
      }
    }

    const applyRefreshResult = (newRowModel: Row[], tableViewInfo: TableViewInfo) => {
      const diffs = diffTableRows(tableViewInfo.rowsModel, newRowModel)
      applyDiffTable(diffs, tab, tableViewInfo.renderedTable, tableViewInfo.renderedRows, tableViewInfo.rowsModel)
    }

    if (Array.isArray(tableViewInfo)) {
      processedMultiTableRow.forEach((newRowModel, index) => {
        applyRefreshResult(newRowModel, tableViewInfo[index])
      })
    } else {
      applyRefreshResult(processedTableRow, tableViewInfo)
    }
  }

  const watchIt = () => {
    if (--watchLimit < 0) {
      debug('watchLimit exceeded')
      stopWatching()
    } else {
      try {
        Promise.resolve(refreshTable()) // or refreshTables
      } catch (err) {
        console.error('Error refreshing table', err)
        stopWatching()
      }
    }
  }

  // establish the initial watch interval
  job = new WatchableJob(tab, watchIt, tablePollingInterval + ~~(100 * Math.random()))
  job.start()
}

/**
 * Format one row in the table
 *
 */
export const formatOneRowResult = (tab: Tab, options: RowFormatOptions = {}) => (entity: Row): HTMLElement => {
  // debug('formatOneRowResult', entity)
  const isHeaderCell = /header-cell/.test(entity.outerCSS)

  const dom = document.createElement(isHeaderCell ? 'thead' : 'tbody')
  dom.className = `entity ${entity.prettyType || ''} ${entity.type}`
  dom.setAttribute('data-name', entity.name)

  // row selection
  entity.setSelected = () => {
    const currentSelection = dom.parentNode.querySelector('.selected-row') as HTMLElement
    if (currentSelection) {
      currentSelection.classList.remove('selected-row')
    }
    dom.querySelector('.row-selection-context').classList.add('selected-row')
    getCurrentPrompt().focus()
  }
  entity.setUnselected = () => {
    dom.querySelector('.row-selection-context').classList.remove('selected-row')
  }

  if (entity.packageName) {
    dom.setAttribute('data-package-name', entity.packageName)
  }

  const entityName = document.createElement('tr')
  entityName.className = 'entity-attributes row-selection-context'
  dom.appendChild(entityName)

  if (entity.rowCSS) {
    if (Array.isArray(entity.rowCSS)) {
      entity.rowCSS.forEach(_ => _ && entityName.classList.add(_))
    } else {
      entityName.classList.add(entity.rowCSS)
    }
  }

  const entityNameGroup = document.createElement(isHeaderCell ? 'th' : 'td')
  entityNameGroup.className = `entity-name-group ${entity.outerCSS}`

  // now add the clickable name
  if (isHeaderCell) {
    entityName.classList.add('header-row')
    ;(entityName.parentNode as HTMLElement).classList.add('header-row')
  }
  if ((!options || !options.excludePackageName) && entity.packageName) {
    const packagePrefix = document.createElement('span')
    packagePrefix.className = 'package-prefix lighter-text smaller-text'
    packagePrefix.innerText = entity.packageName + '/'
    entityNameGroup.appendChild(packagePrefix)
  }
  const entityNameClickable = document.createElement('span')
  entityNameClickable.className = 'entity-name cell-inner'
  if (!isHeaderCell) {
    entityNameClickable.classList.add('clickable')
  } else {
    entityNameClickable.classList.add('bx--table-header-label')
  }
  if (entity.nameCss) {
    if (Array.isArray(entity.nameCss)) {
      entity.nameCss.forEach(_ => entityNameClickable.classList.add(_))
    } else {
      entityNameClickable.classList.add(entity.nameCss)
    }
  }
  entityNameGroup.appendChild(entityNameClickable)
  entityName.appendChild(entityNameGroup)

  if (entity.key) {
    entityNameClickable.setAttribute('data-key', entity.key)
  } else {
    // if we have no key field, and this is the first column, let us
    // use NAME as the default key; e.g. we style NAME columns
    // slightly differently
    entityNameClickable.setAttribute('data-key', 'NAME')
  }

  // name of the entity
  const name = entity.prettyName || entity.name

  // click handler for the list result
  if (entity.fontawesome) {
    if (/fa-check/.test(entity.fontawesome)) {
      // the first svg is radio-checked; the second is
      // radio-unchecked; we will use css to swap between the two,
      // governed by either :hover or .selected-row
      const icon1 = document.createElement('i')
      const icon2 = document.createElement('i')
      icon1.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"></path><path d="M16 10a6 6 0 1 0 6 6 6 6 0 0 0-6-6z"></path></svg>'
      icon2.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"></path></svg>'
      icon1.classList.add('kui--radio-checked')
      icon2.classList.add('kui--radio-unchecked')
      entityNameClickable.appendChild(icon1)
      entityNameClickable.appendChild(icon2)
    } else {
      const icon = document.createElement('i')
      entityNameClickable.appendChild(icon)
      icon.classList.add('cell-inner')

      if (/fa-network/.test(entity.fontawesome)) {
        icon.innerHTML =
          '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M26 14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4.1a5 5 0 0 0-3.9 3.9H14v-2a2 2 0 0 0-2-2h-2v-4.1a5 5 0 1 0-2 0V18H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2h4.1a5 5 0 1 0 5.9-5.9V14zM6 9a3 3 0 1 1 3 3 3 3 0 0 1-3-3zm6 17H6v-6h6zm14-3a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 6h6v6h-6z"></path></svg>'
      } else {
        icon.className = entity.fontawesome
      }
    }
  } else if (typeof name === 'string') {
    entityNameClickable.title = name
    entityNameClickable.innerText = isHeaderCell ? name.toLowerCase() : name
  } else if (name) {
    entityNameClickable.appendChild(name)
  }

  entityNameClickable.setAttribute('data-value', name) // in case tests need the actual value, not the icon
  if (entity.fullName) {
    entityNameClickable.setAttribute('title', entity.fullName)
  }

  if (entity.css) {
    if (Array.isArray(entity.css)) {
      entity.css.forEach(_ => entityNameClickable.classList.add(_))
    } else {
      entityNameClickable.classList.add(entity.css)
    }
  }
  if (!entity.onclick) {
    // the provider has told us the entity name is not clickable
    entityNameClickable.classList.remove('clickable')
  } else {
    if (isPopup() || options.usePip) {
      entityNameClickable.onclick = async (evt: MouseEvent) => {
        const { drilldown } = await import('../picture-in-picture')
        return drilldown(tab, entity.onclick, undefined, '.custom-content .padding-content', 'previous view')(evt)
      }
    } else if (typeof entity.onclick === 'string') {
      entityNameClickable.onclick = () => pexec(entity.onclick, { tab })
    } else {
      entityNameClickable.onclick = entity.onclick
    }
  }

  /** add a cell to the current row of the table view we are generating. "entityName" is the current row */
  const addCellToRow = (theCell: Cell) => {
    const {
      className,
      value,
      valueDom,
      innerClassName = '',
      parent = entityName,
      onclick,
      watch,
      key,
      fontawesome,
      css = '',
      watchLimit = 100000,
      tag = 'span',
      tagClass
    } = theCell

    const cell = document.createElement(isHeaderCell ? 'th' : 'td')
    const inner = document.createElement(tag)

    cell.className = className

    inner.className = innerClassName
    inner.classList.add('cell-inner')
    if (isHeaderCell) {
      inner.classList.add('bx--table-header-label')
    }

    if (tagClass) {
      inner.classList.add(tagClass)
    }

    if (key) {
      inner.setAttribute('data-key', key)
    }

    if (css) {
      inner.classList.add(css)
    }

    if (fontawesome) {
      const addIcon = (theIcon: Icon) => {
        const icon = document.createElement('i')
        icon.className = theIcon.fontawesome
        icon.classList.add('cell-inner')

        if (typeof onclick === 'function') {
          icon.onclick = onclick
          icon.classList.add('clickable')
        }

        if (theIcon.balloon) {
          // tooltip; careful: both balloon and fontawesome want to
          // use :before and :after; so we need a wrapper
          const iconWrapper = document.createElement('span')
          iconWrapper.setAttribute('data-balloon', theIcon.balloon)
          iconWrapper.setAttribute('data-balloon-pos', theIcon.balloonPos || 'right')
          if (theIcon.balloonLength) {
            iconWrapper.setAttribute('data-balloon-length', theIcon.balloonLength)
          }
          iconWrapper.appendChild(icon)
          inner.appendChild(iconWrapper)
        } else {
          inner.appendChild(icon)
        }
      }

      if (Array.isArray(fontawesome)) {
        // for an array of icons, keep them centered
        cell.classList.add('text-center')
        cell.classList.add('larger-text')
        fontawesome.forEach(font => addIcon({ fontawesome: font }))
      } else {
        addIcon({ fontawesome })
        inner.setAttribute('data-value', value) // in case tests need the actual value, not the icon
      }
    } else if (valueDom) {
      // array of dom elements
      if (Array.isArray(valueDom)) {
        const container = valueDom.reduce((container, node) => {
          container.appendChild(node)
          return container
        }, document.createElement('div'))

        inner.appendChild(container)
      } else {
        Promise.resolve(valueDom).then(valueDom =>
          inner.appendChild(valueDom.nodeName ? valueDom : document.createTextNode(valueDom.toString()))
        )
      }
    } else if (value !== undefined) {
      // value could be an empty string
      Promise.resolve(value).then(value => {
        inner.title = value
        inner.appendChild(document.createTextNode(isHeaderCell ? value.toLowerCase() : value))
      })
    } else {
      console.error('Invalid cell model, no value field', theCell)
    }

    cell.appendChild(inner)
    parent.appendChild(cell)

    if (cell.classList.contains('header-cell')) {
      parent.classList.add('header-row')
      ;(parent.parentNode as HTMLElement).classList.add('header-row')
    }

    if (onclick) {
      cell.classList.add('clickable')
      cell.onclick = async (evt: MouseEvent) => {
        evt.stopPropagation() // don't trickle up to the row click handler
        if (isPopup() || options.usePip) {
          const { drilldown } = await import('../picture-in-picture')
          return drilldown(tab, onclick, undefined, '.custom-content .padding-content', 'previous view')(evt)
        } else if (typeof onclick === 'string') {
          // TODO: define types here carefully
          pexec(onclick, { tab })
        } else {
          onclick(evt)
        }
      }
    }

    const pulse = 'repeating-pulse'
    if (
      options.useRepeatingEffect &&
      key === 'STATUS' &&
      (css.includes('yellow-background') || innerClassName.includes('yellow-background'))
    ) {
      cell.classList.add(pulse)
    }

    if (watch) {
      cell.classList.add(pulse)
      // we'll ping the watcher at most watchLimit times
      let count = watchLimit

      // the current watch interval; used for clear/reset/stop
      let job: WatchableJob

      // are we currently slowPolling?
      let slowPolling = false

      const stopWatching = () => {
        job.abort()
        cell.classList.remove(pulse)
      }

      // if we are presenting in popup mode, then when the sidecar is
      // replaced, also terminate watching
      // revisit this when we can handle restoring after a back and forth
      /* if (isPopup()) {
        eventBus.once('/sidecar/replace', stopWatching)
      } */

      /** the watch interval handler */
      const watchIt = () => {
        if (--count < 0) {
          debug('watchLimit exceeded', value)
          stopWatching()
          return
        }

        try {
          Promise.resolve(watch(watchLimit - count - 1)).then(
            ({ value, done = false, css, onclick, others = [], unchanged = false, outerCSS, slowPoll = false }) => {
              if (unchanged) {
                // nothing to do, yet
                return
              }

              // debug('watch update', done)
              // stopWatching()

              // are we done polling for updates?
              if (value === null || value === undefined || done) {
                stopWatching()
              }

              // update onclick
              if (onclick) {
                debug('updating onclick', entity.onclick)
                entityNameClickable.classList.add('clickable')
                if (typeof onclick === 'string') {
                  entityNameClickable.onclick = () => {
                    return pexec(onclick, { tab })
                  }
                } else {
                  entityNameClickable.onclick = onclick
                }
              }

              // update the styling
              if (css) {
                inner.className = css
              }

              // update the outer styling i.e. of the table cell
              if (outerCSS !== undefined && outerCSS !== false) {
                const isPulsing = cell.classList.contains(pulse)
                cell.className = outerCSS
                if (isPulsing) {
                  cell.classList.add(pulse)
                }
              }

              // update the text
              if (value) {
                inner.innerText = ''
                inner.appendChild(value.nodeName ? value : document.createTextNode(value.toString()))
              }

              // any other cells to update?
              others.forEach(({ key, value, css, fontawesome }) => {
                const otherInner = parent.querySelector(`.cell-inner[data-key="${key}"]`) as HTMLElement
                if (otherInner) {
                  otherInner.setAttribute('data-value', value)
                  if (css) {
                    otherInner.className = `cell-inner ${css}`
                  }
                  if (fontawesome) {
                    otherInner.querySelector('i').className = fontawesome
                  } else {
                    otherInner.innerText = ''
                    otherInner.appendChild(value.nodeName ? value : document.createTextNode(value.toString()))
                  }
                }
              })

              // here we manage the slowPoll transitions
              if (slowPoll) {
                // the model provider has requested a new, "slow polling" watch
                if (!slowPolling) {
                  debug('entering slowPoll mode', slowPoll)
                  slowPolling = true
                  stopWatching() // this will remove the "pulse" effect, which is what we want
                  job = new WatchableJob(tab, watchIt, slowPoll)
                  job.start()
                  // job = registerWatchableJob(tab, watchIt, slowPoll) // this will NOT re-establish the pulse, which is also what we want
                }
              } else if (slowPolling) {
                // we were told not to slowPoll, but we are currently
                // slowPolling, and so we exit slowPoll mode
                debug('exiting slowPoll mode')
                slowPolling = false
                cell.classList.add(pulse)
                stopWatching()
                job = new WatchableJob(tab, watchIt, tablePollingInterval + ~~(100 * Math.random()))
                job.start()
              }
            }
          )
        } catch (err) {
          console.error('Error watching value', err)
          stopWatching()
          cell.classList.remove(pulse)
        }
      }

      // establish the initial watch interval
      job = new WatchableJob(tab, watchIt, tablePollingInterval + ~~(100 * Math.random()))
      job.start()
    }

    return cell
  }

  // add any attributes that should appear *before* the name column
  if (entity.beforeAttributes) {
    entity.beforeAttributes.forEach(({ key, value, css = '', outerCSS = '', onclick, fontawesome }) =>
      addCellToRow({
        className: outerCSS,
        value,
        innerClassName: css,
        onclick,
        key,
        fontawesome
      })
    )
  }

  //
  // case-specific cells
  //
  if (entity.attributes) {
    // the entity provider wants to take complete control
    entity.attributes.forEach(
      ({ key, value, css = '', outerCSS = '', watch, watchLimit, onclick, fontawesome, tag }) => {
        addCellToRow({
          className: outerCSS,
          value,
          innerClassName: css,
          onclick,
          watch,
          key,
          fontawesome,
          watchLimit,
          tag
        })
      }
    )
  } else {
    // otherwise, we have some generic attribute handlers, here
    const addKind = () => {
      if (entity.kind || entity.prettyKind) {
        addCellToRow({
          className: 'entity-kind',
          value: entity.prettyKind || entity.kind
        })
      }
    }
    const addStatus = () => {
      if (entity.status) {
        const cell = addCellToRow({
          className: `entity-rule-status`,
          value: 'Pending', // delay status display
          innerClassName: 'repeating-pulse', // css
          tag: 'badge',
          tagClass: 'gray-background'
        })

        /** normalize the status badge by capitalization */
        const capitalize = (str: string): string => {
          return str[0].toUpperCase() + str.slice(1).toLowerCase()
        }

        Promise.resolve(entity.status).then(status => {
          const badge = cell.querySelector('badge') as HTMLElement
          badge.innerText = capitalize(status)
          badge.classList.remove('gray-background')
          badge.classList.add(status === 'active' ? 'green-background' : 'red-background')
          badge.classList.remove('repeating-pulse')
        })
      }
    }
    const addVersion = () => {
      if (entity.version || entity.prettyVersion) {
        addCellToRow({
          className: 'entity-version hide-with-sidecar',
          value: entity.prettyVersion || entity.version,
          innerClassName: 'slightly-deemphasize'
        })
      }
    }

    addKind()
    addStatus()
    addVersion()
  }

  return dom
}

/**
 * Carbon Components has its own classes of table compactness
 *
 */
function adoptCarbonTableStyle(tableDom: HTMLElement) {
  if (tableDom.getAttribute('kui-table-style') === 'Light') {
    tableDom.classList.add('bx--data-table--compact')
  } else if (tableDom.getAttribute('kui-table-style') === 'Medium') {
    tableDom.classList.add('bx--data-table--short')
  }
}

/**
 * Set the table style attribute for the given table container
 *
 */
function setStyle(tableDom: HTMLElement, table: Table) {
  if (table.style !== undefined) {
    tableDom.setAttribute('kui-table-style', TableStyle[table.style].toString())
  } else if (theme.tableStyle) {
    tableDom.setAttribute('kui-table-style', theme.tableStyle)
  }

  adoptCarbonTableStyle(tableDom)
}

// This helps multi-table view handler to use the the processed data from single-table view handler
interface TableViewInfo {
  renderedRows: HTMLElement[]
  rowsModel: Row[]
  renderedTable: HTMLElement
  tableModel: Table | WatchableTable
}

export const formatTable = (
  tab: Tab,
  response: Table | MultiTable,
  resultDom: HTMLElement,
  options: TableFormatOptions = {}
) => {
  const format = (table: Table) => {
    const tableDom = document.createElement('table')
    tableDom.classList.add('result-table')
    tableDom.classList.add('bx--data-table')

    let container: HTMLElement
    if (table.title) {
      const tableOuterWrapper = document.createElement('div')
      const tableOuter = document.createElement('div')
      const titleOuter = document.createElement('div')
      const titleInner = document.createElement('div')

      tableOuterWrapper.classList.add('result-table-outer-wrapper')
      tableOuter.appendChild(titleOuter)
      titleOuter.appendChild(titleInner)
      tableOuterWrapper.appendChild(tableOuter)
      resultDom.appendChild(tableOuterWrapper)

      if (table.flexWrap) {
        const tableScroll = document.createElement('div')
        tableScroll.classList.add('scrollable')
        tableScroll.classList.add('scrollable-auto')
        tableScroll.setAttribute(
          'data-table-max-rows',
          typeof table.flexWrap === 'number' ? table.flexWrap.toString() : '8'
        )
        tableScroll.appendChild(tableDom)
        tableOuter.appendChild(tableScroll)
      } else {
        tableOuter.appendChild(tableDom)
      }

      tableOuter.classList.add('result-table-outer')
      titleOuter.classList.add('result-table-title-outer')
      titleInner.classList.add('result-table-title')
      titleInner.innerText = table.title

      if (table.tableCSS) {
        tableOuterWrapper.classList.add(table.tableCSS)
      }

      if (table.fontawesome) {
        const awesomeWrapper = document.createElement('div')
        const awesome = document.createElement('i')
        awesomeWrapper.appendChild(awesome)
        titleOuter.appendChild(awesomeWrapper)

        awesome.className = table.fontawesome

        if (table.fontawesomeCSS) {
          awesomeWrapper.classList.add(table.fontawesomeCSS)
          delete table.fontawesomeCSS
        }

        if (table.fontawesomeBalloon) {
          awesomeWrapper.setAttribute('data-balloon', table.fontawesomeBalloon)
          awesomeWrapper.setAttribute('data-balloon-pos', 'left')
          delete table.fontawesomeBalloon
        }

        // otherwise, the header row renderer will pick this up
        delete table.fontawesome
      }

      container = tableOuterWrapper
    } else {
      resultDom.appendChild(tableDom)
      container = tableDom
    }

    container.classList.add('big-top-pad')

    const prepareRows = prepareTable(tab, table)
    const rows = prepareRows.map(
      formatOneRowResult(
        tab,
        Object.assign(options, {
          useRepeatingEffect: !hasReachedFinalState(response) && isWatchable(response) && response.watchByDefault
        })
      )
    )
    rows.map(row => tableDom.appendChild(row))

    setStyle(tableDom, table)

    const rowSelection = tableDom.querySelector('.selected-row')
    if (rowSelection) {
      tableDom.classList.add('has-row-selection')
    }

    return {
      renderedRows: rows,
      renderedTable: tableDom,
      rowsModel: prepareRows,
      tableModel: table
    }
  }

  const tableViewInfo = isMultiTable(response) ? response.tables.map(table => format(table)) : format(response)

  if (!hasReachedFinalState(response) && isWatchable(response) && response.watchByDefault) {
    registerWatcher(tab, response.watchLimit, response.refreshCommand, resultDom, tableViewInfo)
  }
}

interface RowFormatOptions extends TableFormatOptions {
  excludePackageName?: boolean
  useRepeatingEffect?: boolean
}

/**
 * Format one row in the table
 * @deprecated in favor of new formatOneRowResult()
 *
 */
export const formatOneListResult = (tab: Tab, options?) => entity => {
  const isHeaderCell = /header-cell/.test(entity.outerCSS)

  const dom = document.createElement(isHeaderCell ? 'thead' : 'tbody')
  dom.className = `entity ${entity.prettyType || ''} ${entity.type}`
  dom.setAttribute('data-name', entity.name)

  // row selection
  entity.setSelected = () => {
    const currentSelection = dom.parentNode.querySelector('.selected-row') as HTMLElement
    if (currentSelection) {
      currentSelection.classList.remove('selected-row')
    }
    dom.querySelector('.row-selection-context').classList.add('selected-row')
    getCurrentPrompt().focus()
  }
  entity.setUnselected = () => {
    dom.querySelector('.row-selection-context').classList.remove('selected-row')
  }

  if (entity.packageName) {
    dom.setAttribute('data-package-name', entity.packageName)
  }

  const entityName = document.createElement('tr')
  entityName.className = 'entity-attributes row-selection-context'
  dom.appendChild(entityName)

  if (entity.rowCSS) {
    if (Array.isArray(entity.rowCSS)) {
      entity.rowCSS.forEach(_ => _ && entityName.classList.add(_))
    } else {
      entityName.classList.add(entity.rowCSS)
    }
  }

  // now add the clickable name
  const entityNameGroup = document.createElement(isHeaderCell ? 'th' : 'td')
  entityNameGroup.className = `entity-name-group ${entity.outerCSS}`
  if (entityNameGroup.classList.contains('header-cell')) {
    entityName.classList.add('header-row')
    ;(entityName.parentNode as HTMLElement).classList.add('header-row')
  }
  if ((!options || !options.excludePackageName) && entity.packageName) {
    const packagePrefix = document.createElement('span')
    packagePrefix.className = 'package-prefix lighter-text smaller-text'
    packagePrefix.innerText = entity.packageName + '/'
    entityNameGroup.appendChild(packagePrefix)
  }
  const entityNameClickable = document.createElement('span')
  entityNameClickable.className = 'entity-name cell-inner'
  if (!entityNameGroup.classList.contains('header-cell')) {
    entityNameClickable.classList.add('clickable')
  }
  if (isHeaderCell) {
    entityNameClickable.classList.add('bx--table-header-label')
  }
  if (entity.nameCss) {
    if (Array.isArray(entity.nameCss)) {
      entity.nameCss.forEach(_ => entityNameClickable.classList.add(_))
    } else {
      entityNameClickable.classList.add(entity.nameCss)
    }
  }
  entityNameGroup.appendChild(entityNameClickable)
  entityName.appendChild(entityNameGroup)

  if (entity.key) {
    entityNameClickable.setAttribute('data-key', entity.key)
  } else {
    // if we have no key field, and this is the first column, let us
    // use NAME as the default key; e.g. we style NAME columns
    // slightly differently
    entityNameClickable.setAttribute('data-key', 'NAME')
  }

  // name of the entity
  const name = entity.prettyName || entity.name

  // click handler for the list result
  if (entity.fontawesome) {
    const icon = document.createElement('i')
    entityNameClickable.appendChild(icon)
    icon.className = entity.fontawesome
    icon.classList.add('cell-inner')
  } else if (typeof name === 'string') {
    entityNameClickable.title = name
    entityNameClickable.innerText = name
  } else {
    entityNameClickable.appendChild(name)
  }

  entityNameClickable.setAttribute('data-value', name) // in case tests need the actual value, not the icon
  if (entity.fullName) {
    entityNameClickable.setAttribute('title', entity.fullName)
  }

  if (entity.css) {
    if (Array.isArray(entity.css)) {
      entity.css.forEach(_ => entityNameClickable.classList.add(_))
    } else {
      entityNameClickable.classList.add(entity.css)
    }
  }
  if (entity.onclick === false) {
    // the provider has told us the entity name is not clickable
    entityNameClickable.classList.remove('clickable')
  } else {
    if (isPopup()) {
      entityNameClickable.onclick = async (evt: MouseEvent) => {
        const { drilldown } = await import('../picture-in-picture')
        return drilldown(tab, entity.onclick, undefined, '.custom-content .padding-content', 'previous view')(evt)
      }
    } else if (typeof entity.onclick === 'string') {
      entityNameClickable.onclick = () => pexec(entity.onclick, { tab })
    } else {
      entityNameClickable.onclick = entity.onclick
    }
  }

  /** add a cell to the current row of the list view we] are generating. "entityName" is the current row */
  const addCell = (
    className,
    value,
    innerClassName = '',
    parent = entityName,
    onclick?,
    watch?,
    key?,
    fontawesome?,
    css?,
    watchLimit = 100000,
    tag = 'span',
    tagClass?: string
  ) => {
    const cell = document.createElement(isHeaderCell ? 'th' : 'td')
    const inner = document.createElement(tag)

    cell.className = className

    inner.className = innerClassName
    inner.classList.add('cell-inner')
    if (tagClass) {
      inner.classList.add(tagClass)
    }
    if (isHeaderCell) {
      inner.classList.add('bx--table-header-label')
    }

    if (key) {
      inner.setAttribute('data-key', key)
    }

    if (css) {
      inner.classList.add(css)
    }

    if (fontawesome) {
      const addIcon = ({
        fontawesome,
        onclick = undefined,
        balloon = undefined,
        balloonLength = undefined,
        balloonPos = 'right'
      }) => {
        const icon = document.createElement('i')
        icon.className = fontawesome
        icon.classList.add('cell-inner')

        if (onclick) {
          icon.onclick = onclick
          icon.classList.add('clickable')
        }

        if (balloon) {
          // tooltip; careful: both balloon and fontawesome want to
          // use :before and :after; so we need a wrapper
          const iconWrapper = document.createElement('span')
          iconWrapper.setAttribute('data-balloon', balloon)
          iconWrapper.setAttribute('data-balloon-pos', balloonPos)
          if (balloonLength) {
            iconWrapper.setAttribute('data-balloon-length', balloonLength)
          }
          iconWrapper.appendChild(icon)
          inner.appendChild(iconWrapper)
        } else {
          inner.appendChild(icon)
        }
      }
      if (Array.isArray(fontawesome)) {
        // for an array of icons, keep them centered
        cell.classList.add('text-center')
        cell.classList.add('larger-text')
        fontawesome.forEach(addIcon)
      } else {
        addIcon({ fontawesome })
        inner.setAttribute('data-value', value) // in case tests need the actual value, not the icon
      }
    } else if (Array.isArray(value) && value[0] && value[0].nodeName) {
      // array of dom elements
      const container = value.reduce((container, node) => {
        container.appendChild(node)
        return container
      }, document.createElement('div'))

      inner.appendChild(container)
    } else if (value !== undefined) {
      Promise.resolve(value).then(value =>
        inner.appendChild(value.nodeName ? value : document.createTextNode(value.toString()))
      )
    } else {
      console.error('Invalid cell model, no value field')
    }
    cell.appendChild(inner)
    parent.appendChild(cell)

    if (cell.classList.contains('header-cell')) {
      parent.classList.add('header-row')
      ;(parent.parentNode as HTMLElement).classList.add('header-row')
    }

    if (onclick) {
      cell.classList.add('clickable')
      cell.onclick = async (evt: MouseEvent) => {
        evt.stopPropagation() // don't trickle up to the row click handler
        if (isPopup()) {
          const { drilldown } = await import('../picture-in-picture')
          return drilldown(tab, onclick, undefined, '.custom-content .padding-content', 'previous view')(evt)
        } else if (typeof onclick === 'string') {
          pexec(onclick, { tab })
        } else {
          onclick(evt)
        }
      }
    }

    if (watch) {
      const pulse = 'repeating-pulse'
      cell.classList.add(pulse)

      // we'll ping the watcher at most watchLimit times
      let count = watchLimit

      // the current watch interval; used for clear/reset/stop
      let job: WatchableJob

      // are we currently slowPolling?
      let slowPolling = false

      const stopWatching = () => {
        job.abort()
        cell.classList.remove(pulse)
      }

      // if we are presenting in popup mode, then when the sidecar is
      // replaced, also terminate watching
      // revisit this when we can handle restoring after a back and forth
      /* if (isPopup()) {
        eventBus.once('/sidecar/replace', stopWatching)
      } */

      /** the watch interval handler */
      const watchIt = () => {
        if (--count < 0) {
          debug('watchLimit exceeded', value)
          stopWatching()
          return
        }

        try {
          Promise.resolve(watch(watchLimit - count - 1)).then(
            ({ value, done = false, css, onclick, others = [], unchanged = false, outerCSS, slowPoll = false }) => {
              if (unchanged) {
                // nothing to do, yet
                return
              }

              // debug('watch update', done)
              // stopWatching()

              // are we done polling for updates?
              if (value === null || value === undefined || done) {
                stopWatching()
              }

              // update onclick
              if (onclick) {
                debug('updating onclick', entity.onclick)
                entityNameClickable.classList.add('clickable')
                if (typeof onclick === 'string') {
                  entityNameClickable.onclick = () => {
                    return pexec(onclick, { tab })
                  }
                } else {
                  entityNameClickable.onclick = onclick
                }
              }

              // update the styling
              if (css) {
                inner.className = css
              }

              // update the outer styling i.e. of the table cell
              if (outerCSS !== undefined && outerCSS !== false) {
                const isPulsing = cell.classList.contains(pulse)
                cell.className = outerCSS
                if (isPulsing) {
                  cell.classList.add(pulse)
                }
              }

              // update the text
              if (value) {
                inner.innerText = ''
                inner.appendChild(value.nodeName ? value : document.createTextNode(value.toString()))
              }

              // any other cells to update?
              others.forEach(({ key, value, css, fontawesome }) => {
                const otherInner = parent.querySelector(`.cell-inner[data-key="${key}"]`) as HTMLElement
                if (otherInner) {
                  otherInner.setAttribute('data-value', value)
                  if (css) {
                    otherInner.className = `cell-inner ${css}`
                  }
                  if (fontawesome) {
                    otherInner.querySelector('i').className = fontawesome
                  } else {
                    otherInner.innerText = ''
                    otherInner.appendChild(value.nodeName ? value : document.createTextNode(value.toString()))
                  }
                }
              })

              // here we manage the slowPoll transitions
              if (slowPoll) {
                // the model provider has requested a new, "slow polling" watch
                if (!slowPolling) {
                  debug('entering slowPoll mode', slowPoll)
                  slowPolling = true
                  stopWatching() // this will remove the "pulse" effect, which is what we want
                  job = new WatchableJob(tab, watchIt, slowPoll)
                  job.start()
                }
              } else if (slowPolling) {
                // we were told not to slowPoll, but we are currently
                // slowPolling, and so we exit slowPoll mode
                debug('exiting slowPoll mode')
                slowPolling = false
                cell.classList.add(pulse)
                stopWatching()
                job = new WatchableJob(tab, watchIt, tablePollingInterval + ~~(100 * Math.random()))
                job.start()
              }
            }
          )
        } catch (err) {
          console.error('Error watching value', err)
          stopWatching()
          cell.classList.remove(pulse)
        }
      }

      // establish the initial watch interval
      job = new WatchableJob(tab, watchIt, tablePollingInterval + ~~(100 * Math.random()))
      job.start()
    }

    return cell
  }

  // add any attributes that should appear *before* the name column
  if (entity.beforeAttributes) {
    entity.beforeAttributes.forEach(({ key, value, css = '', outerCSS = '', onclick, fontawesome }) =>
      addCell(outerCSS, value, css, undefined, onclick, undefined, key, fontawesome)
    )
  }

  //
  // case-specific cells
  //
  if (entity.attributes) {
    // the entity provider wants to take complete control
    entity.attributes.forEach(
      ({ key, value, css = '', outerCSS = '', watch, watchLimit, onclick, fontawesome, tag }) => {
        addCell(outerCSS, value, css, undefined, onclick, watch, key, fontawesome, undefined, watchLimit, tag)
      }
    )
  } else {
    // otherwise, we have some generic attribute handlers, here
    const addKind = () => {
      if (entity.kind || entity.prettyKind) {
        addCell('entity-kind', entity.prettyKind || entity.kind)
      }
    }
    const addStatus = () => {
      if (entity.status) {
        const cell = addCell(
          `entity-rule-status`,
          'Pending', // delay status display
          'repeating-pulse', // css
          // ugh: i know, this needs to be cleaned up:
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          'badge',
          'gray-background'
        )

        /** normalize the status badge by capitalization */
        const capitalize = (str: string): string => {
          return str[0].toUpperCase() + str.slice(1).toLowerCase()
        }

        Promise.resolve(entity.status).then(status => {
          const badge = cell.querySelector('badge') as HTMLElement
          badge.innerText = capitalize(status)
          badge.classList.remove('gray-background')
          badge.classList.add(status === 'active' ? 'green-background' : 'red-background')
          badge.classList.remove('repeating-pulse')
        })
      }
    }
    const addVersion = () => {
      if (entity.version || entity.prettyVersion) {
        addCell('entity-version hide-with-sidecar', entity.prettyVersion || entity.version, 'slightly-deemphasize')
      }
    }

    addKind()
    addStatus()
    addVersion()
  }

  return dom
}

/**
 * Format a tabular view
 *
 */
export const formatTableResult = (tab: Tab, response: Table): HTMLElement[] => {
  debug('formatTableResult', response)
  return prepareTable(tab, response).map(formatOneRowResult(tab))
}

/**
 * Format a tabular view
 * @deprecated in favor of new formatTableResult()
 *
 */
export const formatListResult = (tab: Tab, response): HTMLElement[] => {
  debug('formatListResult', response)

  // sort the list, then format each element, then add the results to the resultDom
  // (don't sort lists of activations. i wish there were a better way to do this)
  const sort = () => {
    if (response[0] && response[0].noSort) {
      return response
    } else {
      return response.sort(
        (a, b) =>
          (a.prettyType || a.type).localeCompare(b.prettyType || b.type) ||
          (a.packageName || '').localeCompare(b.packageName || '') ||
          a.name.localeCompare(b.name)
      )
    }
  }

  return sort().map(formatOneListResult(tab))
}

/**
 * Format a table of tables view
 *
 */
export const formatMultiListResult = async (tab: Tab, response, resultDom: Element) => {
  debug('formatMultiListResult', response)

  return Promise.all(
    response
      .filter(x => x.length > 0)
      .map(async (table, idx, tables) => {
        const tableDom = document.createElement('table')
        tableDom.classList.add('result-table')
        tableDom.classList.add('bx--data-table')

        setStyle(tableDom, table)

        let container: HTMLElement
        if (table[0].title) {
          const tableOuterWrapper = document.createElement('div')
          const tableOuter = document.createElement('div')
          const titleOuter = document.createElement('div')
          const titleInner = document.createElement('div')

          tableOuterWrapper.classList.add('result-table-outer-wrapper')
          if (tables.length > 1) {
            tableOuterWrapper.classList.add('row-selection-context')
          }

          if (table[0].style !== undefined) {
            tableOuter.setAttribute('kui-table-style', TableStyle[table[0].style].toString())
            adoptCarbonTableStyle(tableDom)
          }

          tableOuter.appendChild(titleOuter)
          titleOuter.appendChild(titleInner)
          tableOuterWrapper.appendChild(tableOuter)
          resultDom.appendChild(tableOuterWrapper)

          if (table[0].flexWrap) {
            const tableScroll = document.createElement('div')
            tableScroll.classList.add('scrollable')
            tableScroll.classList.add('scrollable-auto')
            tableScroll.setAttribute(
              'data-table-max-rows',
              typeof table[0].flexWrap === 'number' ? table[0].flexWrap : 8
            )
            tableScroll.appendChild(tableDom)
            tableOuter.appendChild(tableScroll)
          } else {
            tableOuter.appendChild(tableDom)
          }

          tableOuter.classList.add('result-table-outer')
          titleOuter.classList.add('result-table-title-outer')
          titleInner.classList.add('result-table-title')
          titleInner.innerText = table[0].title

          if (table[0].tableCSS) {
            tableOuterWrapper.classList.add(table[0].tableCSS)
          }

          if (table[0].fontawesome) {
            const awesomeWrapper = document.createElement('div')
            const awesome = document.createElement('i')
            awesomeWrapper.appendChild(awesome)
            titleOuter.appendChild(awesomeWrapper)

            awesome.className = table[0].fontawesome

            if (table[0].fontawesomeCSS) {
              awesomeWrapper.classList.add(table[0].fontawesomeCSS)
              delete table[0].fontawesomeCSS
            }

            if (table[0].fontawesomeBalloon) {
              awesomeWrapper.setAttribute('data-balloon', table[0].fontawesomeBalloon)
              awesomeWrapper.setAttribute('data-balloon-pos', 'left')
              delete table[0].fontawesomeBalloon
            }

            // otherwise, the header row renderer will pick this up
            delete table[0].fontawesome
          }

          container = tableOuterWrapper
        } else {
          resultDom.appendChild(tableDom)
          container = tableDom
        }

        container.classList.add('big-top-pad')

        // render(table, { echo: false, resultDom: tableDom })
        const rows = await formatListResult(tab, table)
        rows.map(row => tableDom.appendChild(row))

        const rowSelection = tableDom.querySelector('.selected-row')
        if (rowSelection) {
          tableDom.classList.add('has-row-selection')
        }
      })
  )
}
