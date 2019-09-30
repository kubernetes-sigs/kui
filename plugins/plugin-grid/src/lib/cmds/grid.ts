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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import * as Debug from 'debug'
import * as prettyPrintDuration from 'pretty-ms'

import { Commands, REPL, UI } from '@kui-shell/core'

import Activation from '../activation'
import { sort, sortActivations, startTimeSorter, countSorter } from '../sorting'
import { GroupData, TimelineData, groupByAction } from '../grouping'
import { formatLegend } from '../legend'
import { renderCell } from '../cell'
import { modes } from '../modes'
import { grid as usage } from '../../usage'
import {
  nbsp,
  optionsToString,
  isSuccess,
  titleWhenNothingSelected,
  latencyBucket,
  formatTimeRange,
  Options,
  visualize
} from '../util'
const debug = Debug('plugins/grid/cmds/grid')

const viewName = 'Grid'

const css = {
  content: 'activation-viz-plugin',
  useDarkTooltips: 'use-dark-tooltips',
  gridGrid: 'grid-grid'
}

interface GridOptions extends Options {
  full?: boolean
  zoom?: number
  fixedHeader?: boolean
  appName?: string
  timeline?: boolean | 'latency' | 'time'
}

const closestSquare = (n: number) => {
  const root = Math.sqrt(n)
  const integralPart = ~~root
  const decimalPart = root - integralPart

  if (decimalPart === 0) {
    return integralPart
  } else {
    return integralPart + 1
  }
}

const makeCellDom = () => {
  const cellDom = document.createElement('div')
  cellDom.className = 'grid-cell grid-cell-occupied'
  return cellDom
}

class Occupancy {
  private readonly width: number

  private readonly height: number

  private readonly rows: HTMLElement[]

  private readonly gridGrid: Element

  constructor(width: number, height: number, nCells: number, grid: HTMLElement, gridGrid: HTMLElement) {
    this.width = width
    this.height = height
    this.rows = new Array(width * height)
    this.gridGrid = gridGrid
    const cells = document.createElement('div')
    cells.className = 'grid-row'
    grid.appendChild(cells)
    for (let count = 0, rowIdx = 0; rowIdx < height; rowIdx++) {
      for (let colIdx = 0; colIdx < width && count < nCells; colIdx++, count++) {
        const cellDom = makeCellDom()
        cells.appendChild(cellDom)
        this.rows[rowIdx * width + colIdx] = cellDom
      }
      // const linebreak = document.createElement('div')
      // linebreak.className = 'grid-line-break'
      // cells.appendChild(linebreak)
    }
    /* this.rows = new Array(height)
        for (let rowIdx = 0; rowIdx < height; rowIdx++) {
            const row = this.rows[rowIdx] = new Array(width),
                  rowDom = document.createElement('div')

            grid.appendChild(rowDom)
            rowDom.className = 'grid-row'

            for (let colIdx = 0; colIdx < width; colIdx++) {
                const cellDom = document.createElement('div')
                cellDom.className = 'grid-cell'
                rowDom.appendChild(cellDom)
                row[colIdx] = cellDom
            }
        } */
  }

  mark(x: number, y: number, width: number, height: number, count: number) {
    const cells: HTMLElement[] = []
    const rowExtent = Math.min(this.height, y + height)
    const colExtent = Math.min(this.width, x + width)

    for (let C = 0, rowIdx = y; rowIdx < rowExtent; rowIdx++) {
      for (let colIdx = x; colIdx < colExtent && C < count; colIdx++, C++) {
        const cell = this.rows[rowIdx * this.width + colIdx]
        // peripheral = /*this.width > 20 &&*/ colIdx < 3 ? 'grid-cell-far-left'
        //                      : /*this.width > 20 &&*/ this.width - colIdx < 3 ? 'grid-cell-far-right'
        //                      : ''
        // const cell = row[colIdx]
        cells.push(cell)
        cell.className = `${cell.className} grid-cell-occupied` // ${peripheral}

        cell.onmouseenter = evt => {
          const win = this.gridGrid.getBoundingClientRect()
          const cell = evt.currentTarget as HTMLElement
          if (win.right - evt.clientX < 80) {
            cell.setAttribute('data-balloon-pos', 'up-right')
          } else if (evt.clientX - win.left < 80) {
            cell.setAttribute('data-balloon-pos', 'up-left')
          }

          if (cell.id && cell['isFailure'] && !cell['failureMessage']) {
            REPL.qexec(`wsk activation get ${cell.id}`).then(({ response }: Activation) => {
              if (response.result.error) {
                const failureMessage =
                  typeof response.result.error === 'string'
                    ? response.result.error
                    : response.result.error.error || response.result.error.message

                cell['failureMessage'] = failureMessage

                cell.setAttribute(
                  'data-balloon',
                  cell.getAttribute('data-balloon') + ` with: ${failureMessage.substring(0, 40)}`
                )
              }
            })
          }
        }
      }
    }

    return cells
  }

  reserve(group: { x: number; y: number; width: number; height: number; count: number }) {
    return this.mark(group.x, group.y, group.width, group.height, group.count)
  }
}

/**
 * Change the coloring strategy
 *
 */
const colorBy = (strategy: string, gridGrid = document.querySelector(`.${css.content} .${css.gridGrid}`)) => {
  gridGrid.setAttribute('color-by', strategy)
  return true
}

/**
 * Try to be clever about picking a zoom level, if one wasn't specified
 *
 */
const smartZoom = (numCells: number) => {
  if (numCells > 1000) {
    return -2
  } else if (numCells <= 100) {
    return 2
  } else if (numCells <= 200) {
    return 1
  } else {
    return 0
  }
}

/**
 * Return the minimum timestamp in the given list of activations
 *
 */
const minTimestamp = (activations: Activation[]) => {
  return activations.reduce((min, activation) => {
    if (min === 0) {
      return activation.start
    } else {
      return Math.min(min, activation.start)
    }
  }, 0)
}

/**
 * Render the grid as a timeline
 *
 */
const drawAsTimeline = (
  tab: UI.Tab,
  timelineData: TimelineData,
  content: HTMLElement,
  gridGrid: HTMLElement,
  zoomLevelForDisplay: number,
  options: GridOptions
) => {
  debug('drawAsTimeline', zoomLevelForDisplay)

  const { activations, nBuckets } = timelineData

  content.classList.add('grid-as-timeline')

  const grid = document.createElement('div')
  grid.className = 'grid'
  grid.classList.add('scrollable-x')
  gridGrid.appendChild(grid)

  const makeColumn = () => {
    const gridRow = document.createElement('div')
    gridRow.className = 'grid-row'
    grid.appendChild(gridRow)

    return gridRow
  }

  // for each column in the timeline... idx here is a column index
  for (let idx = 0, currentEmptyRunLength = 0, currentRunMinTime = 0; idx < nBuckets; idx++) {
    if (activations[idx].length === 0) {
      // empty column
      if (currentEmptyRunLength++ === 0 && idx > 0) {
        // start of empty run; remember the timestamp
        currentRunMinTime = minTimestamp(activations[idx - 1])
      }

      continue
    } else if (currentEmptyRunLength > 5) {
      // debug('EMPTY SWATH')
      const currentRunMaxTime = minTimestamp(activations[idx])
      const swath = makeColumn()

      swath.classList.add('grid-timeline-empty-swath')

      if (currentRunMinTime && currentRunMaxTime) {
        const swathInner = document.createElement('div')
        swathInner.classList.add('grid-timeline-empty-swath-inner')
        swathInner.innerText = `${prettyPrintDuration(currentRunMaxTime - currentRunMinTime, { compact: true })}`

        swath.appendChild(swathInner)
      }

      currentEmptyRunLength = 0
    }

    const gridRow = makeColumn()

    // sort the activations in the column, according to the user's desire
    if (options.timeline === true || options.timeline === 'latency') {
      // default sort order
      activations[idx].sort((a, b) => {
        const successA = isSuccess(a)
        const successB = isSuccess(b)
        const nA = options.full ? a._duration : a.executionTime
        const nB = options.full ? b._duration : b.executionTime
        return (!successA && !successB) || (successA && successB) ? nA - nB : !successA ? 1 : -1
      })
    } else if (options.timeline === 'time') {
      activations[idx].sort((a, b) => a.start - b.start)
    }

    // now render the cells in the column; jdx here is a row index
    // within the current column's stack of cells
    activations[idx].forEach((activation, jdx) => {
      const success = isSuccess(activation)
      const latBucket = success && latencyBucket(options.full ? activation._duration : activation.executionTime)

      const cell = makeCellDom()
      const nameInTooltip = true
      const balloonPos =
        jdx >= 25
          ? idx < 5
            ? 'down-left'
            : 'down'
          : idx < 10
          ? jdx < 5
            ? 'up-left'
            : 'up'
          : jdx < 5
          ? 'up-right'
          : 'up'

      renderCell(
        tab,
        viewName,
        cell,
        activation,
        !success,
        options.full ? activation._duration : activation.executionTime,
        latBucket,
        { zoom: zoomLevelForDisplay, balloonPos, nameInTooltip }
      )

      gridRow.appendChild(cell)
    })
  }
} // drawAsTimeline

/**
 * Helper method for drawGrid. This was split out, to allow for
 * re-sorting.
 *
 */
const _drawGrid = (
  tab: UI.Tab,
  options: GridOptions,
  content: HTMLElement,
  groupData: GroupData,
  sorter = countSorter,
  sortDir = +1,
  redraw = false
): { name: string; packageName: string; toolbarText: UI.ToolbarText; legend?: UI.Badge } => {
  const { groups, summary, timeline } = groupData

  sort(groups, sorter, sortDir)
  sortActivations(groups, startTimeSorter, +1)

  const gridGrid: HTMLElement = redraw ? content.querySelector(`.${css.gridGrid}`) : document.createElement('div')
  const totalCount = groupData.totalCount
  const zoomLevel = (options.zoom as number) || smartZoom(totalCount)
  const zoomLevelForDisplay = options.timeline ? -1 : totalCount > 1000 ? -2 : totalCount <= 100 ? zoomLevel : 0 // don't zoom in too far, if there are many cells to display

  gridGrid.className = `${css.gridGrid} overflow-auto cell-container zoom_${zoomLevelForDisplay}`
  gridGrid.setAttribute('data-zoom-level', zoomLevelForDisplay.toString())
  colorBy('duration', gridGrid)

  if (!redraw) {
    content.appendChild(gridGrid)
  }

  let name: string
  let packageName: string
  let legend: UI.Badge

  // add activation name to header
  if (groups.length === 1 && !options.fixedHeader && !options.appName) {
    const group = groups[0]
    const pathComponents = group.path.split('/')

    name = group.name
    packageName = pathComponents.length === 4 ? pathComponents[2] : ''

    // const onclick = drilldownWith(`action get "${group.path}"`)
    legend = formatLegend(tab, viewName, group, gridGrid)
  } else {
    // const onclick = options.appName ? drilldownWith(`app get "${options.appName}"`) : undefined
    const pathComponents = (options.appName || '').toString().split('/')

    packageName =
      pathComponents.length === 4
        ? pathComponents[2]
        : pathComponents.length === 2 && options.appName.toString().charAt(0) !== '/'
        ? pathComponents[0]
        : ''
    name =
      pathComponents.length > 1
        ? pathComponents[pathComponents.length - 1]
        : (options.appName || titleWhenNothingSelected).toString()

    if (groups.length > 0) {
      legend = formatLegend(tab, viewName, summary, gridGrid)
    }
  }

  // add time range to the sidecar header
  const toolbarText = formatTimeRange(groupData)

  if (options.timeline) {
    drawAsTimeline(tab, timeline, content, gridGrid, zoomLevelForDisplay, options)
    return
  }

  groups.forEach(group => {
    // prepare the grid structure
    const gridDom: HTMLElement = redraw
      ? gridGrid.querySelector(`.grid[data-action-path="${group.path}"]`)
      : document.createElement('div')
    gridDom.className = 'grid'
    gridDom.setAttribute('data-action-name', group.name)
    gridDom.setAttribute('data-action-path', group.path)
    if (!redraw) gridGrid.appendChild(gridDom)

    // adjust z-index to help tooltips
    // not yet supported by browsers gridDom.setAttribute('data-grid-index', groupIdx)
    // gridDom.style.zIndex = groups.length - groupIdx + 1

    // add a label to the grid
    const gridLabel = document.createElement('div')
    const labelInner = document.createElement('div')
    const labelAction = document.createElement('div')
    const labelSplit = group.groupKey.split('/')
    const hasPackage = labelSplit.length === 4 // this action is part of a pacakge?
    const actionName = labelSplit[labelSplit.length - 1] // the action name to display

    if (!redraw /* zoomLevel === 0 || groups.length > 1 || options.fixedHeader */) {
      gridLabel.className = 'grid-label'
      gridLabel.appendChild(labelInner)
      gridDom.appendChild(gridLabel)

      if (hasPackage) {
        const packageName = hasPackage ? labelSplit[2] : nbsp // the package name to display
        const labelPackage = document.createElement('div')
        labelInner.appendChild(labelPackage)
        labelPackage.innerText = packageName
        labelPackage.className = 'package-prefix grid-label-part'
      }

      labelInner.appendChild(labelAction)
      labelAction.innerText = actionName
      labelAction.className = 'grid-label-part' // was also: clickable
      // labelAction.onclick = drilldownWith(`grid "${group.path}" ${optionsToString(options)}`)
    }

    // render the grid
    let cells: HTMLElement[]
    if (!redraw) {
      const L = closestSquare(group.count)
      const width = L
      const height = L
      const grid = new Occupancy(width, height, group.activations.length, gridDom, gridGrid)
      group.x = 0
      group.y = 0
      group.width = L
      group.height = L
      cells = grid.reserve(group)

      gridDom.setAttribute('data-width', width.toString())

      // try to make the gridDom mostly squarish
      const vws =
        zoomLevelForDisplay === 0
          ? 2.75
          : zoomLevelForDisplay === -1
          ? 1.25
          : zoomLevelForDisplay === 1
          ? 3
          : zoomLevelForDisplay === 2
          ? 4
          : 1

      // now that we know the width of the grid, adjust the width of the label
      if (zoomLevel === 0) {
        gridLabel.style.maxWidth = `${Math.max(8, width * vws)}vw` // 2.75vw is the width in table.css; 1.1x to give a bit of overflow
      }

      ;(gridDom.querySelector('.grid-row') as HTMLElement).style.maxWidth = `${Math.max(8, width * vws)}vw`

      let idx = 0
      group.activations.forEach(activation => {
        renderCell(tab, viewName, cells[idx], activation, !isSuccess(activation), undefined, undefined, {
          zoom: zoomLevelForDisplay
        })
        idx++
      })
    } else {
      const cellContainer = gridDom.querySelector('.grid-row')
      /* const existingCells = existingContent.querySelectorAll('.grid-cell')
      const exists = {} // map by activationId
      for (let idx = 0; idx < existingCells.length; idx++) {
        const id = existingCells[idx].getAttribute('data-activation-id')
        if (id) {
          exists[id] = true
        }
      }
      debug('exists', exists) */

      group.activations.forEach(activation => {
        // if (!exists[activation.activationId]) {
        // if (!cellContainer.querySelector(`data-activation-id="${activation.activationId}"`)) {
        try {
          if (!document.getElementById(activation.activationId)) {
            const cell = makeCellDom()
            cellContainer.appendChild(cell)
            cell.classList.add('grid-cell-newly-created')
            renderCell(
              tab,
              viewName,
              cell,
              activation,
              !isSuccess(activation),
              options.full ? activation._duration : activation.executionTime,
              undefined,
              { zoom: zoomLevelForDisplay }
            )
          }
        } catch (e) {
          console.error(e)
        }
      })
    }
  })

  return { name, packageName, toolbarText, legend }
} // _drawGrid

/**
 * Visualize the activation data
 *
 */
const drawGrid = (tab: UI.Tab, options: GridOptions, uuid: string) => (
  activations: Activation[]
): Commands.Response => {
  const content = document.createElement('div')

  content.classList.add(css.content)
  content.classList.add(css.useDarkTooltips)

  const { name, packageName, toolbarText, legend } = _drawGrid(
    tab,
    options,
    content,
    groupByAction(activations, options),
    undefined,
    undefined
  )

  /** zoom update button click handler */
  const rezoom = (change: (current: number) => number) => () => {
    const gridGrid = content.querySelector(`.${css.gridGrid}`)
    const currentZoom = parseInt(gridGrid.getAttribute('data-zoom-level'), 10)
    const newZoom = change(currentZoom)
    const zoomMin = -2
    const zoomMax = 2

    if (newZoom !== currentZoom) {
      gridGrid.setAttribute('data-zoom-level', newZoom.toString())
      gridGrid.classList.remove(`zoom_${currentZoom}`)
      gridGrid.classList.add(`zoom_${newZoom}`)

      // and try to make the gridDom mostly squarish
      const grids = gridGrid.querySelectorAll('.grid')
      for (let idx = 0; idx < grids.length; idx++) {
        const gridDom = grids[idx]
        const gridLabel = gridDom.querySelector('.grid-label') as HTMLElement
        const gridRow = gridDom.querySelector('.grid-row') as HTMLElement
        const width = parseInt(gridDom.getAttribute('data-width'), 10)
        const vws = newZoom === 0 ? 2.75 : newZoom === -1 ? 1.25 : newZoom === 1 ? 3 : newZoom === 2 ? 4 : 1

        gridRow.style.maxWidth = `${Math.max(8, width * vws)}vw`
        if (gridLabel) {
          gridLabel.style.maxWidth = `${Math.max(8, width * vws)}vw`
        }
      }

      if (newZoom === zoomMax) {
        return {
          toggle: [
            { mode: 'zoom-in', disabled: true }, // can't zoom in any further
            { mode: 'zoom-out', disabled: false }
          ]
        }
      } else if (newZoom === zoomMin) {
        return {
          toggle: [
            { mode: 'zoom-out', disabled: true }, // can't zoom out any further
            { mode: 'zoom-in', disabled: false }
          ]
        }
      } else {
        return {
          toggle: [{ mode: 'zoom-out', disabled: false }, { mode: 'zoom-in', disabled: false }]
        }
      }
    }
  }
  const zoomIn: UI.Mode = {
    mode: 'zoom-in',
    fontawesome: 'fas fa-search-plus',
    balloon: 'Use larger grid cells',
    flush: 'right',
    actAsButton: true,
    direct: rezoom(_ => Math.min(2, _ + 1))
  }
  const zoomOut: UI.Mode = {
    mode: 'zoom-out',
    fontawesome: 'fas fa-search-minus',
    balloon: 'Use smaller grid cells',
    flush: 'right',
    actAsButton: true,
    direct: rezoom(_ => Math.max(-2, _ - 1))
  }
  const asTimeline: UI.Mode = {
    mode: 'as-timeline',
    fontawesome: 'fas fa-chart-bar',
    balloon: 'Display as timeline',
    flush: 'right',
    actAsButton: true,
    direct: () => REPL.pexec(`grid ${optionsToString(options)} -t`)
  }
  const asGrid: UI.Mode = {
    mode: 'as-grid',
    fontawesome: 'fas fa-th',
    balloon: 'Display as grid',
    flush: 'right',
    actAsButton: true,
    direct: () => REPL.pexec(`grid ${optionsToString(options, ['timeline', 't'])}`)
  }

  const switcher = options.timeline ? asGrid : asTimeline // switch between timeline and grid mode

  return {
    type: 'custom',
    kind: viewName,
    metadata: {
      name,
      namespace: packageName
    },
    toolbarText,
    badges: legend && [legend],
    uuid,
    content,
    presentation: UI.Presentation.SidecarFullscreenForPopups,

    // add zoom buttons to the mode button model
    modes: modes('grid', options).concat([switcher, zoomIn, zoomOut])
  }
}

/**
 * This is the module
 *
 */
export default async (commandTree: Commands.Registrar) => {
  debug('init')

  const mkCmd = (cmd: string, extraOptions?: { live: boolean }) =>
    visualize<GridOptions>(cmd, viewName, drawGrid, extraOptions)
  const fixedGrid = mkCmd('grid')
  const pollingGrid = mkCmd('...', { live: true })

  // a command that is a bit instructional as to what is going on
  // this if for the tray-launched scenario
  commandTree.listen(
    '/loading/activity/grid/...',
    function() {
      return (
        /* REPL.qexec('mirror poll') */ Promise.resolve(true)
          // eslint-disable-next-line prefer-rest-params, prefer-spread
          .then(() => pollingGrid.apply(undefined, arguments))
      )
    },
    { hide: true }
  )

  const route = `/wsk/grid`
  debug('installing command', route)

  commandTree.listen(route, fixedGrid, {
    usage,
    needsUI: true,
    viewName,
    noAuthOk: true // the underlying data queries will ensure whatever auth they need
  })

  // coloring
  /* const cmd = commandTree.listen(`/wsk/${syn}/color/grid/by`, ({ argvNoOptions }) => {
            const strategy = argvNoOptions[argvNoOptions.indexOf('by') + 1]
            if (strategy === 'pass/fail') {
                return colorBy('pass/fail')
            } else if (strategy === 'duration' || strategy === 'default' || strategy === 'reset') {
                return colorBy('duration')
            } else {
                throw new Error('Usage: color by default|pass/fail|duration')
            }
        }, { docs: 'Change the coloring strategy of the activation grid' })
        commandTree.listen('/wsk/$dur', () => colorBy('duration'), cmd)
        commandTree.listen('/wsk/$pf', () => colorBy('pass/fail'), cmd) */
}
