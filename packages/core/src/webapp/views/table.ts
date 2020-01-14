/*
 * Copyright 2017-19 IBM Corporation
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

import * as prettyPrintDuration from 'pretty-ms'

import { Tab } from '../tab'
import { isPopup } from '../popup-core'
import { getCurrentPrompt } from '../prompt'
import { isMetadataBearing } from '../../models/entity'
import { Table, Row, Cell, Icon, sortBody, TableStyle, isTable } from '../models/table'
import { isWatchable, Watchable } from '../../core/jobs/watchable'
import { theme } from '../../core/settings'

import { isHTML } from '../../util/types'

/** ExistingTableSpec helps the watcher update the existing `Table` and view */
interface ExistingTableSpec {
  renderedRows: HTMLElement[]
  rowsModel: Row[]
  renderedTable: HTMLElement
  tableModel: Table & Partial<Watchable>
}

/** RowFormatOptions helps FormatOneRowResult render the `Row` */
export interface RowFormatOptions {
  excludePackageName?: boolean
  useRepeatingEffect?: boolean
  usePip?: boolean
}

/**
 * The table renderer treats the header as a Row with some special
 * CSS.
 *
 */
function prepareHeader(header: Row) {
  header.outerCSS = `${header.outerCSS || ''} header-cell`

  if (header.attributes) {
    header.attributes.forEach(cell => {
      cell.outerCSS = `${cell.outerCSS || ''} header-cell`
    })
  }

  return header
}

/**
 * get an array of row models
 *
 */
const prepareTable = (tab: Tab, response: Table & Partial<Watchable>): Row[] => {
  const { header, body, noSort } = response

  if (header) {
    prepareHeader(header)
  }

  // sort the list, then format each element, then add the results to the resultDom
  // (don't sort lists of activations. i wish there were a better way to do this)
  return [header].concat(noSort ? body : sortBody(body)).filter(x => x)
}

/**
 * maybe the resources in table have all reach to the final state?
 *
 */
const hasReachedFinalState = (response: Table): boolean => {
  let reachedFinalState = false

  if (isTable(response)) {
    if (response.body.length !== 0 && response.body.every(row => row.done)) {
      reachedFinalState = true // stop watching if all resources have reached to the finial state
    }

    return reachedFinalState
  }

  return reachedFinalState
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

const formatCellValue = (key: string, value: string) => {
  const dateKey: Record<string, boolean> = { 'FIRST SEEN': true, 'LAST SEEN': true }
  /**
   * Compute the differece between the timestamp and the current time
   * And format the output in: hours minutes, or minutes seconds
   *
   */
  const formatAge = (value: string) => {
    const timestamp = new Date(value).getTime()
    if (isNaN(timestamp)) {
      return value
    }

    const ms = Date.now() - timestamp
    return prettyPrintDuration(ms)
  }

  return dateKey[key] && !dateKey[value] ? formatAge(value) : value
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
    packagePrefix.className = 'package-prefix sub-text'
    packagePrefix.innerText = entity.packageName + '/'
    entityNameGroup.appendChild(packagePrefix)
  }
  const entityNameClickable = document.createElement('span')
  entityNameClickable.className = 'entity-name cell-inner'
  if (!isHeaderCell) {
    entityNameClickable.classList.add('clickable')
    // entityNameClickable.setAttribute('tabindex', '0') <-- see https://github.com/IBM/kui/issues/2507
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
  const name = entity.nameDom || entity.prettyName || entity.name

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

  // in case tests need the actual value, not the icon
  entityNameClickable.setAttribute('data-value', entity.prettyName || entity.name)
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
        return drilldown(tab, entity.onclick, undefined, undefined, 'previous view')(evt)
      }
    } else if (typeof entity.onclick === 'string') {
      entityNameClickable.onclick = async () => {
        if (!entity.onclickExec || entity.onclickExec === 'pexec') {
          const { pexec } = await import('../../repl/exec')
          pexec(entity.onclick, { tab, echo: !entity.onclickSilence })
        } else {
          const { qexec } = await import('../../repl/exec')
          qexec(entity.onclick, undefined, undefined, { tab })
        }
      }
    } else if (isMetadataBearing(entity.onclick)) {
      entityNameClickable.onclick = async () => {
        const { show } = await import('../../models/mmr/show')
        return show(tab, entity.onclick)
      }
    } else {
      entityNameClickable.onclick = entity.onclick
    }
  }

  const rowFrag = document.createDocumentFragment()

  /** add a cell to the current row of the table view we are generating. "entityName" is the current row */
  const addCellToRow = (theCell: Cell) => {
    const {
      className,
      value,
      valueDom,
      innerClassName = '',
      onclick,
      key,
      fontawesome,
      css = '',
      tag = 'span',
      tagClass
    } = theCell

    const parent = rowFrag
    const cell = document.createElement(isHeaderCell ? 'th' : 'td')
    const inner = document.createElement(tag)

    cell.className = className || 'not-too-compact'

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
        const formatedValue = formatCellValue(key, value)
        inner.title = formatedValue
        inner.appendChild(
          document.createTextNode(isHeaderCell ? formatedValue.toLowerCase() : formatedValue || '\u00a0')
        )
      })
    } else {
      console.error('Invalid cell model, no value field', theCell)
    }

    cell.appendChild(inner)
    parent.appendChild(cell)

    if (onclick) {
      cell.classList.add('clickable')
      cell.onclick = async (evt: MouseEvent) => {
        evt.stopPropagation() // don't trickle up to the row click handler
        if (isPopup() || options.usePip) {
          const { drilldown } = await import('../picture-in-picture')
          return drilldown(tab, onclick, undefined, '.custom-content .padding-content', 'previous view')(evt)
        } else if (typeof onclick === 'string') {
          // TODO: define types here carefully
          const { pexec } = await import('../../repl/exec')
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
    entity.attributes.forEach(({ key, value, valueDom, css = '', outerCSS = '', onclick, fontawesome, tag }) => {
      addCellToRow({
        className: outerCSS,
        value,
        valueDom,
        innerClassName: css,
        onclick,
        key,
        fontawesome,
        tag
      })
    })
  }

  entityName.appendChild(rowFrag)
  return dom
}

/**
 * Update a row in the exiting table
 *
 */
const udpateTheRow = (newRow: Row, updateIndex: number, existingTable: ExistingTableSpec) => (
  tab: Tab,
  option?: RowFormatOptions
) => {
  const newRowView = formatOneRowResult(tab, option)(newRow)
  existingTable.renderedTable.replaceChild(newRowView, existingTable.renderedRows[updateIndex])
  existingTable.renderedRows[updateIndex] = newRowView

  // apply the change to the exiting rows
  existingTable.rowsModel[updateIndex] = newRow
}

/**
 * Insert a new row to the existing table
 *
 */
const insertTheRow = (newRow: Row, insertBeforeIndex: number, existingTable: ExistingTableSpec) => (
  tab: Tab,
  option?: RowFormatOptions
) => {
  const newRowView = formatOneRowResult(tab, option)(newRow)
  existingTable.renderedTable.insertBefore(newRowView, existingTable.renderedRows[insertBeforeIndex])
  existingTable.renderedRows.splice(insertBeforeIndex, 0, newRowView)
  existingTable.rowsModel.splice(insertBeforeIndex, 0, newRow)
}

/**
 * Delete a row from the existing table
 *
 */
const deleteTheRow = (deleteRow: Row, deleteIndex: number, existingTable: ExistingTableSpec) => {
  // change the status badge to `offline`
  deleteRow.attributes.forEach(attr => {
    if (attr.key === 'STATUS') {
      attr.value = 'Offline'
      attr.css = 'red-background'
    }
  })

  // apply the change to the exiting rows
  existingTable.rowsModel[deleteIndex] = deleteRow

  // render the status badge change
  const status = existingTable.renderedRows[deleteIndex].querySelector('.cell-inner[data-key="STATUS"]') as HTMLElement
  if (status) {
    status.className = 'cell-inner red-background'
    status.innerText = 'Offline'
  }

  // remove the repeating pulse effect remained from the previous state, e.g. Terminating
  const pulse = existingTable.renderedRows[deleteIndex].querySelector('.repeating-pulse') as HTMLElement
  if (pulse) pulse.classList.remove('repeating-pulse')
}

/**
 * Carbon Components has its own classes of table compactness
 *
 */
function adoptCarbonTableStyle(tableDom: HTMLElement) {
  if (tableDom.getAttribute('kui-table-style') === 'Light') {
    tableDom.classList.add('bx--data-table--short')
  } else if (tableDom.getAttribute('kui-table-style') === 'Medium') {
    tableDom.classList.add('bx--data-table--short')
  }
}

/**
 * Set the table style attribute for the given table container
 *
 */
function setStyle(tableDom: HTMLElement, table: Table) {
  if (table.style !== undefined && TableStyle[table.style] !== undefined) {
    tableDom.setAttribute('kui-table-style', TableStyle[table.style].toString())
  } else if (theme.tableStyle) {
    tableDom.setAttribute('kui-table-style', theme.tableStyle)
  }

  adoptCarbonTableStyle(tableDom)
}

/**
 * Format the table view
 *
 */
export const formatTable = (tab: Tab, response: Table, resultDom: HTMLElement, options: { usePip?: boolean } = {}) => {
  const formatRowOption = Object.assign(options, {
    useRepeatingEffect: !hasReachedFinalState(response) && isWatchable(response)
  })

  const format = (table: Table) => {
    const tableDom = document.createElement('table')
    tableDom.classList.add('result-table')
    tableDom.classList.add('bx--data-table')

    const prepareRows = prepareTable(tab, table)

    const rows = prepareRows.map(formatOneRowResult(tab, formatRowOption))
    const rowFrag = document.createDocumentFragment()
    rows.map(row => rowFrag.appendChild(row))
    tableDom.appendChild(rowFrag)

    setStyle(tableDom, table)

    const rowSelection = tableDom.querySelector('.selected-row')
    if (rowSelection) {
      tableDom.classList.add('has-row-selection')
    }

    // depending on whether or not we have a title, we may introduce a
    // wrapper around the table; we want to defer attaching this to
    // the live DOM, in hopes that this will help with createElement,
    // ec. performance
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
      titleOuter.classList.add('bx--data-table-header')
      titleInner.classList.add('result-table-title')
      titleInner.classList.add('bx--data-table-header__title')
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
      container = tableDom
    }

    // we deferred attaching the table (or, rather, the container we
    // may have created around the table) to help with DOM insertion
    // performance
    container.classList.add('big-top-pad')
    resultDom.appendChild(container)

    return {
      renderedRows: rows,
      renderedTable: tableDom,
      rowsModel: prepareRows,
      tableModel: table
    }
  }

  const existingTable = format(response)

  if (isWatchable(response)) {
    const watch = response.watch
    tab.state.captureJob(watch)

    /** offline takes the rowKey of the row to be deleted and applies this to the table view */
    const offline = (rowKey: string) => {
      const existingRows = existingTable.rowsModel
      const foundIndex = existingRows.findIndex(_ => (_.rowKey || _.name) === rowKey)
      if (foundIndex >= 0) {
        deleteTheRow(existingRows[foundIndex], foundIndex, existingTable)
      }
    }

    /** allOffline allows pollers to indicate that all resources are not to be found */
    const allOffline = () => {
      const existingRows = existingTable.rowsModel
      existingRows.forEach((existingRow, foundIndex) => {
        deleteTheRow(existingRow, foundIndex, existingTable)
      })
    }

    /** update consumes the update notification and apply it to the table view */
    const update = (newRow: Row) => {
      const existingRows = existingTable.rowsModel
      const foundIndex = existingRows.findIndex(_ => (_.rowKey || _.name) === newRow.name)

      if (foundIndex === -1) {
        // To get the insertion index, first concat the new row with the existing rows, then sort the rows
        const index = sortBody([newRow].concat(existingRows)).findIndex(_ => (_.rowKey || _.name) === newRow.name)
        insertTheRow(newRow, index + 1, existingTable)(tab, formatRowOption)
      } else {
        const doUpdate = JSON.stringify(newRow) !== JSON.stringify(existingRows[foundIndex])
        if (doUpdate) udpateTheRow(newRow, foundIndex, existingTable)(tab, formatRowOption)
      }
    }

    /** new header */
    const header = (header: Row) => {
      const existingRows = existingTable.rowsModel
      const foundIndex = existingRows.findIndex(_ => /header-cell/.test(_.outerCSS))

      const newHeader = prepareHeader(header)
      if (foundIndex) {
        insertTheRow(newHeader, 0, existingTable)(tab, formatRowOption)
      } else {
        udpateTheRow(newHeader, 0, existingTable)(tab, formatRowOption)
      }
    }

    /** done watching? */
    const done = () => {
      if (isWatchable(existingTable.tableModel)) {
        delete existingTable.tableModel.watch
      }
    }

    // initiate the pusher watch
    watch.init({ update, offline, done, allOffline, header })
  }
}
