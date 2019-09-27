/*
 * Copyright 2017, 2019 IBM Corporation
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

import { EventEmitter } from 'events'
import * as prettyPrintDuration from 'pretty-ms'

import { Commands, UI, REPL } from '@kui-shell/core'

import Activation from '../activation'
import { drilldownWith } from '../drilldown'
import { sort, versionSorter, statDataSorter } from '../sorting'
import { GroupData, OutlierReason, groupByAction } from '../grouping'
import { modes } from '../modes'
import { summary as usage } from '../../usage'
import {
  leftArrowHead,
  rightArrowHead,
  enDash,
  emDash,
  optionsToString,
  titleWhenNothingSelected,
  formatTimeRange,
  visualize
} from '../util'

const defaultBottom = 25
const defaultTop = 75 // default range to show in summary

const viewName = 'Summary'

interface State {
  eventBus: EventEmitter
  showOutliers: boolean
}

interface Range {
  bottom: number | string
  top: number | string
  label: string
  text?: string
}

/**
 * Mode switchers
 *
 */
const choices: Range[] = [
  { bottom: 25, top: 75, label: '25-75%' },
  // { bottom: 25, top: 90 },
  { bottom: 25, top: 95, label: '25-95%' },
  // { bottom: 25, top: 99 },
  {
    bottom: 'min',
    top: 'max',
    label: 'Min-Max',
    text: 'mininum to maximum'
  }
]

const choicesArray: UI.Mode[] = choices.map((choice, idx) => {
  const { bottom, top, label, text } = choice
  const mode = label || `${bottom}-${top}`
  return {
    mode,
    label: mode,
    flush: 'right',
    // labelBelow: true,
    balloon: `Show the ${text || bottom + 'th to the ' + top + 'th percentile of'} latency`,
    actAsButton: true,
    selected: idx === 0,
    direct: (tab: UI.Tab, state: State) => {
      state.eventBus.emit('/summary/range/change', choice)
    }
  }
})
const tableModes: UI.Mode[] = choicesArray.concat([
  // this is the bottom stripe button that toggles whether outliers are shown
  // note how we specify that this is a radio button, i.e. a toggler
  {
    mode: 'outliers',
    fontawesome: 'fas fa-exclamation',
    flush: 'right',
    balloon: 'Include outlier activations with very high latency',
    actAsButton: true,
    radioButton: true,
    selected: false,
    direct: (tab: UI.Tab, state: State) => {
      const showOutliers = !state.showOutliers
      state.showOutliers = showOutliers
      state.eventBus.emit(`/summary/range/outliers/toggle`, { showOutliers })
    }
  }
])

/**
 * Render the given fractional value as a CSS percent
 *
 */
const percent = (fraction: number) => `${100 * fraction}%`

interface Options extends Commands.ParsedOptionsFull {
  ticks?: number
  outliers?: boolean
}

/**
 * Helper method for drawTable. This was split out, to allow for
 * re-sorting.
 *
 */
const _drawTable = (
  tab: UI.Tab,
  options: Options,
  content: Element,
  groupData: GroupData,
  eventBus: EventEmitter,
  uuid: string,
  sorter = statDataSorter(defaultTop),
  sortDir = +1
): Commands.Response => {
  const { groups } = groupData
  const tableHeader = document.createElement('table')
  const tableScrollContainer = document.createElement('div')
  const table = document.createElement('table')

  // number of ticks on the x axis of the bar chart
  const { ticks = 4 } = options
  const numTicks = ticks

  // clean the container
  UI.empty(content)

  // x axis
  const headerRow = tableHeader.insertRow(-1)
  const xAxisLabels: HTMLElement[] = []
  const xAxisLeftPad = headerRow.insertCell(-1)
  tableHeader.classList.add('table-header')
  xAxisLeftPad.className = 'x-axis-left-pad cell-numeric'
  xAxisLeftPad.innerText = 'Action'
  if (numTicks === 0) {
    // we still need to insert a cell to fill in the bar column
    headerRow.insertCell(-1) // .classList.add('x-axis-label')
  } else {
    for (let idx = 0; idx < numTicks; idx++) {
      xAxisLabels[idx] = headerRow.insertCell(-1)
      xAxisLabels[idx].classList.add('x-axis-label')
    }
  }
  const xAxisFocusLabelCell = headerRow.insertCell(-1)
  const xAxisFocusLabelRange = document.createElement('div')
  const xAxisFocusLabelLeft = document.createElement('div')
  const xAxisFocusLabelMiddle = document.createElement('div')
  const xAxisFocusLabelRight = document.createElement('div')
  xAxisFocusLabelCell.className = 'x-axis-focus-label-cell'
  xAxisFocusLabelRange.className = 'x-axis-focus-label-range'
  xAxisFocusLabelLeft.className = 'x-axis-focus-label'
  xAxisFocusLabelRight.className = 'x-axis-focus-label'
  xAxisFocusLabelCell.appendChild(xAxisFocusLabelRange)
  xAxisFocusLabelRange.appendChild(xAxisFocusLabelLeft)
  xAxisFocusLabelRange.appendChild(xAxisFocusLabelMiddle)
  xAxisFocusLabelRange.appendChild(xAxisFocusLabelRight)

  const xAxisRightPad1 = headerRow.insertCell(-1)
  const xAxisRightPad2 = headerRow.insertCell(-1)
  const xAxisRightPad3 = headerRow.insertCell(-1)
  xAxisRightPad1.className = 'cell-numeric cell-successes cell-hide-when-outliers-shown cell-hide-when-focus-shown'
  xAxisRightPad2.className = 'cell-numeric cell-failures cell-hide-when-outliers-shown cell-hide-when-focus-shown'
  xAxisRightPad3.className = 'cell-numeric cell-failures cell-show-only-when-outliers-shown cell-hide-when-focus-shown'
  xAxisRightPad1.innerText = 'Success'
  xAxisRightPad2.innerText = 'Fail'
  xAxisRightPad3.innerText = 'Outliers'

  // set the focus range to be in the middle so we get some animation on first hover
  xAxisFocusLabelRange.style.left = percent(0.5)
  xAxisFocusLabelRange.style.width = '0'

  /** Render a selected range on the x axis */
  const xAxisResetFocus = (barWrapper: HTMLElement) => () => {
    content.classList.remove('x-axis-focus')
    barWrapper.classList.remove('focus')
  }
  const xAxisToggleFocus = ({
    barWrapper,
    this25,
    this75,
    left,
    right
  }: {
    barWrapper: HTMLElement
    this25: number
    this75: number
    left: number
    right: number
  }) => {
    const inFocus = content.classList.toggle('x-axis-focus')
    barWrapper.classList.toggle('focus')

    if (inFocus) {
      // this will house the enDash for e.g. 1.1-1.3s
      xAxisFocusLabelMiddle.innerText = ''

      const pretty25 = prettyPrintDuration(this25)
      const pretty75 = prettyPrintDuration(this75)
      const split25 = pretty25.match(/[^\d]/).index
      const split75 = pretty75.match(/[^\d]/).index
      const num25 = parseInt(pretty25.substring(0, split25), 10)
      const unit25 = pretty25.substring(split25)
      const num75 = parseInt(pretty75.substring(0, split75), 10)
      const unit75 = pretty75.substring(split75)
      const sameUnit = unit25 === unit75
      const rangeLessThanOne = sameUnit && num75 - num25 < 1
      const superNarrow = right - left < 0.05
      const veryNarrow = right - left < 0.25

      if (superNarrow) {
        xAxisFocusLabelRight.classList.add('no-border')
      } else {
        xAxisFocusLabelRight.classList.remove('no-border')
      }

      if (rangeLessThanOne || superNarrow) {
        // e.g. 32-32ms, just show 32ms!
        xAxisFocusLabelLeft.innerText = pretty75
        xAxisFocusLabelMiddle.innerText = ''
        xAxisFocusLabelRight.innerText = ''
      } else if (veryNarrow && sameUnit) {
        // or close together? here, we need a prettyPrint on
        // the lower bound; e.g. 1.2-1.6s
        xAxisFocusLabelLeft.innerText = num25.toString()
        xAxisFocusLabelMiddle.innerText = enDash
        xAxisFocusLabelRight.innerText = pretty75
      } else {
        xAxisFocusLabelLeft.innerText = pretty25
        xAxisFocusLabelMiddle.innerText = ''
        xAxisFocusLabelRight.innerText = pretty75
      }

      xAxisFocusLabelRange.style.left = percent(left)
      xAxisFocusLabelRange.style.width = percent(right - left)
    } else {
      // on mouseleave, move the labels to the center
      xAxisFocusLabelRange.style.left = percent(0.5)
      xAxisFocusLabelRange.style.width = '0'
    }
  }

  // add the new elements to the container
  tableScrollContainer.appendChild(table)
  content.appendChild(tableHeader)
  content.appendChild(tableScrollContainer)

  sort(groups, sorter, sortDir)

  table.className = 'data-table cell-container'
  table.setAttribute('color-by', 'duration')
  tableHeader.classList.add('data-table')
  tableScrollContainer.className = 'data-table-scroll-container'

  // header title
  const onclick = options.name ? drilldownWith(`app get "${options.name}"`) : undefined
  const name = options.name || titleWhenNothingSelected
  // addNameToSidecarHeader(getSidecar(tab), options.name || titleWhenNothingSelected, undefined, onclick)

  // cache rows for redraw
  const rowMap: Record<string, HTMLTableRowElement> = {}

  interface DrawArgs {
    bottom: string | number
    top: string | number
    redraw?: boolean
    showOutliers?: boolean
  }
  const draw = ({ bottom: stat25, top: stat75, redraw = false, showOutliers = false }: DrawArgs) => {
    const { min25, max75, maxBarRange, max2BarRange, maxRange } = groups.reduce(
      (MM, group) => {
        const thisLeft = group.statData.n[stat25]
        const thisBarRight = group.statData.n[stat75]
        const thisRight = (showOutliers && group.statData.outlierMax) || thisBarRight // outlierMax might not be defined for this group, if no outliers
        const thisBarRange = thisBarRight - thisLeft
        const thisRange = thisRight - thisLeft
        if (MM.min25 === 0 || thisLeft < MM.min25) MM.min25 = thisLeft
        if (MM.max75 === 0 || thisRight > MM.max75) MM.max75 = thisRight
        if (MM.maxBarRange === 0 || thisBarRange > MM.maxBarRange) {
          MM.max2BarRange = MM.maxBarRange
          MM.maxBarRange = thisBarRange
        }
        if ((MM.max2BarRange === 0 || thisBarRange > MM.max2BarRange) && thisBarRange < MM.maxBarRange) {
          MM.max2BarRange = thisBarRange
        }
        if (MM.maxRange === 0 || thisRange > MM.maxRange) MM.maxRange = thisRange
        return MM
      },
      { min25: 0, max75: 0, maxBarRange: 0, max2BarRange: 0, maxRange: 0 }
    )

    // turn a value into a x axis coordinate
    const normalize = (value: number) => (value - min25) / (max75 - min25)

    // draw the x axis labels
    const labelMin = min25
    const labelRange = maxRange / numTicks
    for (let idx = 0; idx < numTicks; idx++) {
      xAxisLabels[idx].innerText = prettyPrintDuration(labelMin + idx * labelRange)
    }

    // for each group of activations, render a table row
    let lastTimeWeRenderedARangeIndicator: number // render the range indicator every once and a while
    let lastTimeWeRenderedAMedianIndicator: number // render the median indicator every once and a while

    groups.forEach((group, idx) => {
      // for redraw, we need to walk through the columns...
      let columnIdx = 0

      const row = redraw ? rowMap[group.groupKey] : table.insertRow(-1)
      const label = redraw ? row.cells[columnIdx++] : row.insertCell(-1)
      const splitOptions = options.split
        ? `--split${options.split === true ? '' : ' "' + options.split + '"'} --key "${group.groupKey}"`
        : ''
      const { outliers = [] } = group.statData // extract the list of outliers from the model

      if (!redraw) {
        const labelInner = document.createElement('div')
        const labelPackage = document.createElement('div')
        const labelAction = document.createElement('div')
        const labelSplit = group.groupKey.split('/')
        const packageName = labelSplit.length === 4 && labelSplit[2]
        const actionName = labelSplit[labelSplit.length - 1]
        const nameWithoutNamespace = labelSplit.slice(2).join('/')

        label.appendChild(labelInner)
        if (packageName) {
          labelInner.appendChild(labelPackage)
          labelPackage.innerText = packageName
          labelPackage.className = 'package-prefix'
        }
        labelInner.appendChild(labelAction)
        labelAction.innerText = actionName

        // cache the row for redrawing later
        rowMap[group.groupKey] = row

        row.setAttribute('data-action-name', nameWithoutNamespace)
        row.className = 'grid-cell-occupied'

        label.className = 'cell-label'
        labelAction.className = 'clickable'
        label.onclick = drilldownWith(`wsk action get ${group.path}`)

        if (nameWithoutNamespace.length > 20) {
          label.setAttribute('data-balloon', nameWithoutNamespace) // line break
          label.setAttribute('data-balloon-pos', 'right')
          label.setAttribute('data-balloon-length', nameWithoutNamespace.length < 20 ? 'fit' : 'large')
        }

        if (options.split) {
          const version = row.insertCell(-1)
          version.className = 'cell-version'
          version.innerText = group.version
        }
      }

      // render bar chart cell
      {
        const cell = redraw ? row.cells[columnIdx++] : row.insertCell(-1)
        const barWrapper: HTMLElement = redraw ? cell.querySelector('.stat-bar-wrapper') : document.createElement('div')
        const bar: HTMLElement = redraw ? cell.querySelector('.stat-bar') : document.createElement('div')
        const medianDot: HTMLElement = redraw ? cell.querySelector('.stat-median-dot') : document.createElement('div')

        if (!redraw) {
          cell.appendChild(barWrapper)
          barWrapper.appendChild(bar)
          barWrapper.appendChild(medianDot)
          cell.className = 'cell-stats'
          barWrapper.className = 'stat-bar-wrapper'
          bar.className = 'stat-bar'
          medianDot.className = 'stat-median-dot'
        } else {
          // if we're redrawing, we need to remove any previous range annotations
          const indicators = barWrapper.querySelectorAll('.stat-indicator')
          indicators.forEach(indicator => barWrapper.removeChild(indicator))
        }
        const this25 = group.statData.n[stat25]
        const thisMedian = group.statData.n['50']
        const this75 = group.statData.n[stat75]
        const left = normalize(this25)
        const right = normalize(this75)
        const medianLeft = normalize(thisMedian)

        // 25th versus min
        const th = (stat: number | string) => `${stat}${typeof stat === 'number' ? 'th' : ''}`
        const th2 = (stat: number | string) => `${stat}${typeof stat === 'number' ? 'th percentile' : ''}`

        bar.style.left = percent(left)
        bar.style.width = percent(right - left)

        // fancy focus, to show the extent of the bar on the x axis!
        const resetFocus = xAxisResetFocus(barWrapper)
        const doFocus = () => xAxisToggleFocus({ barWrapper, this25, this75, left, right })
        const focus = (dom: HTMLElement) => {
          dom.onmouseenter = doFocus
          dom.onmouseleave = doFocus
        }

        // drill down to grid view; note how we pass through a name filter
        // query, to filter based on the clicked-upon row
        cell.onclick = drilldownWith(
          `grid ${REPL.encodeComponent(group.path)} ${optionsToString(options)} ${splitOptions}`,
          [resetFocus]
        )

        // install the fancy focus handlers
        focus(bar)

        // add 25th and 75th explainers to widest bar
        if (
          this75 - this25 === maxBarRange ||
          ((lastTimeWeRenderedARangeIndicator === undefined || idx - lastTimeWeRenderedARangeIndicator > 20) &&
            (this75 - this25) / maxBarRange > 0.9)
        ) {
          // render the < 25th and 75th > indicators inside the bar
          lastTimeWeRenderedARangeIndicator = idx

          // e.g. 25th versus min; and 75th percentile versus max
          const kindaNarrow = right - left < 0.4
          const veryNarrow = right - left < 0.25
          const veryFarRight = right > 0.95
          const veryFarLeft = left < 0.05

          const thFor75 = kindaNarrow ? th : th2 // no space for "percentile"
          const rightPad = (stat: number | string) => (typeof stat === 'number' && !kindaNarrow ? '10.5em' : '3.5em') // extra room for "th percentile"

          const indicator25 = document.createElement('div')
          const indicator75 = document.createElement('div')
          barWrapper.appendChild(indicator25)
          barWrapper.appendChild(indicator75)
          indicator25.className = 'stat-indicator'
          indicator75.className = 'stat-indicator'
          if (!veryNarrow) {
            indicator25.innerText = `${leftArrowHead} ${th(stat25)}`
            indicator25.style.left = percent(left + 0.02)
            indicator75.innerText = `${thFor75(stat75)} ${rightArrowHead}`
            indicator75.style.left = `calc(${percent(right - 0.02)} - ${rightPad(stat75)})`
          } else if (veryFarRight) {
            // bar is not wide at all, and ends very far to the RIGHT
            indicator25.innerText = `${th(stat25)} ${rightArrowHead}`
            indicator25.style.left = `calc(${percent(left)} - 8ex)`
            indicator75.innerText = `${thFor75(stat75)} ${rightArrowHead}`
            indicator75.style.left = `calc(${percent(right - 0.02)} - ${rightPad(stat75)})`
          } else if (veryFarLeft) {
            // bar is not wide at all, and ends very far to the LEFT
            indicator25.innerText = `${leftArrowHead} ${th(stat25)}`
            indicator25.style.left = percent(left + 0.02)
            indicator75.innerText = `${leftArrowHead} ${thFor75(stat75)}`
            indicator75.style.left = `calc(${percent(right)} + 1ex)`
          }

          // still focus when the mouse flies over the indicators
          focus(indicator25)
          focus(indicator75)
        }

        // add < median indicator to the second widest bar
        // whose median isn't "too far right"
        const showMedianIndicator =
          max2BarRange > 0 &&
          (lastTimeWeRenderedAMedianIndicator === undefined || idx - lastTimeWeRenderedAMedianIndicator > 20) &&
          idx !== lastTimeWeRenderedARangeIndicator && // don't render a median indicator alongside a range indicator
          (this75 - this25 === max2BarRange || (this75 - this25) / max2BarRange > 0.75)

        if (showMedianIndicator) {
          lastTimeWeRenderedAMedianIndicator = idx

          const indicator50 = document.createElement('div')
          barWrapper.appendChild(indicator50)
          indicator50.className = 'stat-indicator'
          if (medianLeft < 0.85) {
            indicator50.innerText = `${leftArrowHead} median`
            indicator50.style.left = `calc(${percent(medianLeft)} + 1ex + 0.3em)`
          } else {
            // otherwise, place the median indicator on the left side
            indicator50.innerText = `median ${rightArrowHead}`
            indicator50.style.left = `calc(${percent(medianLeft)} - 10ex - 0.3em)`
          }
          // 0.3em must match .activation-viz-plugin .data-table td.cell-stats .stat-median-dot width

          // still focus when the mouse flies over the indicator
          focus(indicator50)
        }

        // an element to show the median of this bar
        medianDot.style.left = percent(medianLeft)

        // check to see if the median dot is flush right; if
        // so, then we'll need to make a little room for it
        if (medianLeft === 1) {
          content.classList.add('median-dot-flush-right')
        }

        medianDot.setAttribute('data-balloon', `median: ${prettyPrintDuration(thisMedian)}`)
        medianDot.setAttribute('data-balloon-length', 'medium')
        medianDot.setAttribute('data-balloon-pos', 'right')
        focus(medianDot)

        // outlier activations
        outliers.forEach(outlier => {
          // render a dot for each outlier
          const dot = redraw ? outlier.dom : document.createElement('div')
          const { activation } = outlier
          const { total: duration, reasons } = group.statData.explainOutlier(activation)
          const left = normalize(duration)

          if (!redraw) {
            outlier.dom = dot
            dot.className = 'outlier-dot cell-show-only-when-outliers-shown'
            dot.onclick = drilldownWith(`wsk activation get ${activation.activationId}`)
            barWrapper.appendChild(dot)

            const tooltip = `${prettyPrintDuration(duration)} (versus median ${prettyPrintDuration(thisMedian)})`
            dot.setAttribute('data-balloon', tooltip)
            dot.setAttribute('data-balloon-break', 'data-balloon-break')
            dot.setAttribute('data-balloon-length', 'large')
            dot.setAttribute('data-balloon-pos', 'left')
            // if (left > 0.8) dot.setAttribute('data-balloon-far', 'right')

            // try to explain why it's slow
            if (reasons.length > 0) {
              const { why } = reasons[0]
              const render = (reasons: OutlierReason[]) => {
                reasons.sort((a, b) => a.cover - b.cover)
                const { why } = reasons[0]
                return `due to increased ${why.toLowerCase()}`
              }
              dot.setAttribute('why-is-it-slow', why)

              // append the reasons to the tooltip
              const currentTooltip = dot.getAttribute('data-balloon')
              const amendedTooltip = `${currentTooltip}\u000a${render(reasons)}`
              dot.setAttribute('data-balloon', amendedTooltip)
            } else {
              // console.error('no reasons', group.statData.explainOutlier(activation), activation)
            }
          }

          // focus the x axis on the bar, even when hovering over the outlier dots
          focus(dot)
          dot.style.left = percent(Math.min(left, 1)) // if we aren't showing outliers, yet, they'll flow off the right
        })
      }

      // successful count
      if (!redraw) {
        const cell = row.insertCell(-1)
        const countPart = document.createElement('span')
        cell.className = 'cell-count cell-numeric cell-successes cell-hide-when-outliers-shown'
        cell.setAttribute('data-successes', group.count.toString())
        if (group.nSuccesses === 0) {
          cell.classList.add('count-is-zero')
          cell.classList.remove('clickable')
        } else {
          // drill down to grid, showing just successes
          cell.classList.add('clickable')
          cell.onclick = drilldownWith(`grid "${group.path}" ${optionsToString(options)} --success ${splitOptions}`)
        }
        cell.appendChild(countPart)
        countPart.innerText = group.nSuccesses.toString()
        // countPart.setAttribute('data-balloon', `Successful Activations: ${group.nSuccesses}`)
        // countPart.setAttribute('data-balloon-pos', 'left')
      }

      // failure count
      if (!redraw) {
        const cell = row.insertCell(-1)
        cell.className = 'cell-failures cell-numeric red-text cell-hide-when-outliers-shown'
        cell.setAttribute('data-failures', group.nFailures.toString())

        const errorPart = document.createElement('span')
        // errorPartIcon = document.createElement('span')
        // \u000a is a line break
        // errorPart.setAttribute('data-balloon', `Failed Activations: ${group.nFailures}`)
        // errorPart.setAttribute('data-balloon-break', 'data-balloon-break')
        // errorPart.setAttribute('data-balloon-pos', 'left')
        errorPart.className = 'count-part'
        // errorPartIcon.className = 'count-icon'
        cell.appendChild(errorPart)
        // cell.appendChild(errorPartIcon)
        errorPart.innerText = group.nFailures ? group.nFailures.toString() : emDash // show emDash when the value is zero
        // errorPartIcon.innerText = '\u26a0'
        errorPart.className = 'cell-errors'

        // drill down to grid, showing just failures
        cell.classList.add('clickable')
        cell.onclick = drilldownWith(`grid "${group.path}" ${optionsToString(options)} --failure ${splitOptions}`)
        if (group.nFailures === 0) {
          cell.classList.add('count-is-zero')
          cell.classList.remove('clickable')
        }
      }

      // outlier count
      if (!redraw) {
        const cell = row.insertCell(-1)
        const countPart = document.createElement('span')
        const nOutliers = outliers.length
        cell.className = 'cell-count cell-numeric cell-successes cell-show-only-when-outliers-shown clickable'
        cell.setAttribute('data-outliers', nOutliers.toString())
        if (nOutliers === 0) {
          cell.classList.add('count-is-zero')
          cell.classList.remove('clickable')
        }
        cell.appendChild(countPart)
        countPart.innerText = nOutliers.toString()
        countPart.setAttribute('data-balloon', `Number of Outliers: ${nOutliers}`)
        countPart.setAttribute('data-balloon-pos', 'left')
        // cell.onclick = showGridForActivationList(tab, outliers.map(_ => _.activation))
      }

      /* addNumericCell('count')
              addNumericCell('nFailures', true) */

      /*
              addStat('disparity', '+').classList.add('cell-extra-wide')
              const why = row.insertCell(-1)
              why.classList.add('cell-label')
              why.appendChild(group.statData.why)
            */
    })
  }

  // here is the initial rendering
  draw({
    bottom: defaultBottom,
    top: defaultTop,
    showOutliers: options.outliers
  })

  if (options.outliers) {
    // user asked for this as the initial state
    content.classList.toggle('show-outliers')
  }

  const toolbarText = formatTimeRange(groupData)

  const state = {
    type: 'custom',
    kind: viewName,
    metadata: {
      name
    },
    onclick,
    toolbarText,
    currentRange: choices[0],
    uuid,
    content,
    eventBus,
    presentation: UI.Presentation.SidecarFullscreenForPopups,
    modes: modes(viewName.toLowerCase(), options).concat(tableModes)
  }

  eventBus.on('/summary/range/change', (range: Range) => {
    state.currentRange = range
    const args: DrawArgs = Object.assign({}, range, { redraw: true })
    draw(args)
  })

  // user requested that we toggle the display of outliers
  eventBus.on('/summary/range/outliers/toggle', ({ showOutliers }: { showOutliers: boolean }) => {
    content.classList.toggle('show-outliers')
    const args: DrawArgs = Object.assign({}, state.currentRange, { redraw: true, showOutliers })
    draw(args)
  })

  return state
}

/**
 * Visualize the activation data
 *
 */
const drawTable = (tab: UI.Tab, options: Options, uuid: string) => (activations: Activation[]): Commands.Response => {
  const eventBus = new EventEmitter()
  const content = document.createElement('div')
  content.className = 'activation-viz-plugin'

  if (options.w) {
    // user asked for the action name column to be wider
    content.classList.add('wide-label')
  } else if (options.ww) {
    // user asked for the action name column to be wider
    content.classList.add('extra-wide-label')
  }

  // add time range to the sidecar header
  const groupData = groupByAction(activations, Object.assign({ groupBySuccess: true }, options))

  return _drawTable(
    tab,
    options,
    content,
    groupData,
    eventBus,
    uuid,
    options.split && versionSorter // if we were asked to split by version, then sort by name
  )
}

/**
 * This is the module
 *
 */
export default async (commandTree: Commands.Registrar) => {
  const tableIt = (cmd: string) => visualize(cmd, 'summary', drawTable)

  const opts = {
    usage,
    needsUI: true,
    viewName,
    noAuthOk: true // the underlying data queries will ensure whatever auth they need
  }

  commandTree.listen(`/wsk/table`, tableIt('table'), opts)

  commandTree.listen(`/wsk/summary`, tableIt('summary'), opts)
}
