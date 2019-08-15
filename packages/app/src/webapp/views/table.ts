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
import minimist = require('yargs-parser')

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
import { isHTML } from '@kui-shell/core/util/types'

const debug = Debug('webapp/views/table')

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

const fastPolling = 500 // initial polling rate for watching OnlineLike or OfflineLike state
const mediumPolling = 3000 // initial polling rate for watching a steady state
const finalPolling = (theme && theme.tablePollingInterval) || 5000 // final polling rate (do not increase the interval beyond this!)

debug('table polling intervals', fastPolling, mediumPolling, finalPolling)

/**
 * sort the body of table
 *
 */
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

/**
 * maybe the resources in table have all reach to the final state?
 *
 */
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

/**
 * find the final state from refresh command
 *
 */
const findFinalStateFromCommand = (command: string): string => {
  // parse the refresh command
  const { A: argv } = split(command, true, true) as Split
  const options = minimist(argv)

  return options['final-state'] ? FinalState[options['finalState']] : ''
}

/**
 * calcuate the polling ladder
 *
 */
const calculateLadder = (initial: number): number[] => {
  const ladder = [initial]
  let current = initial

  // increment the polling interval
  while (current < finalPolling) {
    if (current < 1000) {
      current = current + 250 < 1000 ? current + 250 : 1000
      ladder.push(current)
    } else {
      ladder.push(current)
      current = current + 2000 < finalPolling ? current + 2000 : finalPolling
      ladder.push(current)
    }
  }

  debug('ladder', ladder)
  return ladder
}

/**
 * register a watchable job
 *
 */
const registerWatcher = (
  tab: Tab,
  watchLimit: number = 100000,
  command: string,
  resultDom: HTMLElement,
  tableViewInfo: TableViewInfo | TableViewInfo[],
  formatRowOption?: RowFormatOptions
) => {
  let job: WatchableJob // eslint-disable-line prefer-const

  // the final state we want to reach to
  const expectedFinalState = findFinalStateFromCommand(command)

  // establish the initial watch interval,
  // if we're on resource creation/deletion, do fast polling, otherwise we do steady polling
  const initalPollingInterval =
    expectedFinalState === 'OfflineLike' || expectedFinalState === 'OnlineLike' ? fastPolling : mediumPolling

  // increase the table polling interval until it reaches the steady polling interval, store the ladder in an array
  const ladder = calculateLadder(initalPollingInterval)

  /**
   * process the refreshed result
   * @return processed Table info: { table: Row[], reachedFinalState: boolean }, or
   *         processed MultiTable info: { tables: Row[][], reachedFinalState: boolean}
   *
   */
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

  // execute the refresh command and apply the result
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
        job.abort()
      } else {
        // if the refreshed result doesn't reach the expected state,
        // then we increment the table polling interval by ladder until it reaches the steady polling interval
        const newTimer = ladder.shift()
        if (newTimer) {
          // reshedule the job using new polling interval
          job.abort()
          job = new WatchableJob(tab, watchIt, newTimer + ~~(100 * Math.random())) // eslint-disable-line @typescript-eslint/no-use-before-define
          job.start()
        }
      }
    } catch (err) {
      if (err.code === 404) {
        if (expectedFinalState === 'OfflineLike') {
          debug('resource not found after status check, but that is ok because that is what we wanted')
          job.abort()
        }
      } else {
        while (resultDom.firstChild) {
          resultDom.removeChild(resultDom.firstChild)
        }
        job.abort()
        throw err
      }
    }

    // diff the refreshed model from the existing one and apply the change
    const applyRefreshResult = (newRowModel: Row[], tableViewInfo: TableViewInfo) => {
      const diffs = diffTableRows(tableViewInfo.rowsModel, newRowModel)
      applyDiffTable(
        diffs,
        tab,
        tableViewInfo.renderedTable,
        tableViewInfo.renderedRows,
        tableViewInfo.rowsModel,
        formatRowOption
      )
    }

    if (Array.isArray(tableViewInfo)) {
      processedMultiTableRow.forEach((newRowModel, index) => {
        applyRefreshResult(newRowModel, tableViewInfo[index])
      })
    } else {
      applyRefreshResult(processedTableRow, tableViewInfo)
    }
  }

  // timer handler
  const watchIt = () => {
    if (--watchLimit < 0) {
      console.error('watchLimit exceeded')
      job.abort()
    } else {
      try {
        Promise.resolve(refreshTable())
      } catch (err) {
        console.error('Error refreshing table', err)
        job.abort()
      }
    }
  }

  // establish the inital watchable job
  job = new WatchableJob(tab, watchIt, ladder.shift() + ~~(100 * Math.random()))
  job.start()
}

/**
 * Replace fontawesome names with svgs
 *
 */
function formatIcon(fontawesome: string, cell: HTMLElement) {
  if (/fa-check$/.test(fontawesome)) {
    // the first svg is radio-checked; the second is
    // radio-unchecked; we will use css to swap between the two,
    // governed by either :hover or .selected-row
    cell.classList.add('radio-button-width')

    const icon1 = document.createElement('i')
    const icon2 = document.createElement('i')
    icon1.innerHTML =
      '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"></path><path d="M16 10a6 6 0 1 0 6 6 6 6 0 0 0-6-6z"></path></svg>'
    icon2.innerHTML =
      '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"></path></svg>'
    icon1.classList.add('kui--radio-checked')
    icon2.classList.add('kui--radio-unchecked')

    const iconContainer = document.createElement('span')
    iconContainer.appendChild(icon1)
    iconContainer.appendChild(icon2)
    return iconContainer
  } else {
    const icon = document.createElement('i')
    icon.classList.add('cell-inner')
    icon.classList.add('graphical-icon')

    if (/fa-network/.test(fontawesome)) {
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M26 14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4.1a5 5 0 0 0-3.9 3.9H14v-2a2 2 0 0 0-2-2h-2v-4.1a5 5 0 1 0-2 0V18H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2h4.1a5 5 0 1 0 5.9-5.9V14zM6 9a3 3 0 1 1 3 3 3 3 0 0 1-3-3zm6 17H6v-6h6zm14-3a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 6h6v6h-6z"></path></svg>'
    } else if (/fa-times-circle/.test(fontawesome)) {
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M2 16A14 14 0 1 0 16 2 14 14 0 0 0 2 16zm23.15 7.75L8.25 6.85a12 12 0 0 1 16.9 16.9zM8.24 25.16a12 12 0 0 1-1.4-16.89l16.89 16.89a12 12 0 0 1-15.49 0z"></path></svg>'
    } else if (/fa-question-circle/.test(fontawesome)) {
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M2 16A14 14 0 1 0 16 2 14 14 0 0 0 2 16zm23.15 7.75L8.25 6.85a12 12 0 0 1 16.9 16.9zM8.24 25.16a12 12 0 0 1-1.4-16.89l16.89 16.89a12 12 0 0 1-15.49 0z"></path></svg>'
    } else if (/fa-check-circle/.test(fontawesome)) {
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"></path><path d="M14 21.5l-5-4.96 1.59-1.57L14 18.35 21.41 11 23 12.58l-9 8.92z"></path></svg>'
    } else {
      icon.className = fontawesome
    }

    return icon
  }
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
    const icon = formatIcon(entity.fontawesome, entityNameGroup)
    entityNameClickable.appendChild(icon)
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
      entityNameClickable.onclick = () => {
        if (!entity.onclickExec || entity.onclickExec === 'pexec') {
          pexec(entity.onclick, { tab })
        } else {
          qexec(entity.onclick, undefined, undefined, { tab })
        }
      }
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
        const icon = formatIcon(theIcon.fontawesome, cell)

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
        Promise.resolve(valueDom).then(valueDom => {
          if (isHTML(valueDom)) {
            inner.appendChild(valueDom)
          } else {
            valueDom.appendChild(document.createTextNode(valueDom.toString()))
          }
        })
      }
    } else if (value !== undefined) {
      // value could be an empty string
      Promise.resolve(value).then(value => {
        inner.title = value
        inner.appendChild(document.createTextNode(isHeaderCell ? value.toLowerCase() : value || '\u00a0'))
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
      // NOTE: the cell watcher is only used by outdated sidecar table
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
                  // NOTE: the cell watcher is only used by outdated sidecar table
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
                // NOTE: the cell watcher is only used by outdated sidecar table
                job = new WatchableJob(tab, watchIt, mediumPolling + ~~(100 * Math.random()))
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
      // NOTE: the cell watcher is only used by outdated sidecar table
      job = new WatchableJob(tab, watchIt, mediumPolling + ~~(100 * Math.random()))
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

/**
 * Format the table view
 *
 */
export const formatTable = (
  tab: Tab,
  response: Table | MultiTable,
  resultDom: HTMLElement,
  options: TableFormatOptions = {}
) => {
  const formatRowOption = Object.assign(options, {
    useRepeatingEffect: !hasReachedFinalState(response) && isWatchable(response) && response.watchByDefault
  })

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

    const rows = prepareRows.map(formatOneRowResult(tab, formatRowOption))
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
    registerWatcher(tab, response.watchLimit, response.refreshCommand, resultDom, tableViewInfo, formatRowOption)
  }
}

export interface RowFormatOptions extends TableFormatOptions {
  excludePackageName?: boolean
  useRepeatingEffect?: boolean
}

/**
 * Format a tabular view
 *
 */
export const formatTableResult = (tab: Tab, response: Table): HTMLElement[] => {
  debug('formatTableResult', response)
  return prepareTable(tab, response).map(formatOneRowResult(tab))
}
