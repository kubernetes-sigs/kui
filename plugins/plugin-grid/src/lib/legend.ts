/*
 * Copyright 2017 IBM Corporation
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

import { Tab } from '@kui-shell/core'

import { renderCell } from './cell'
import { enDash, latencyBuckets } from './util'

// for future reference, here is a platform way to render percents
// const locale = window.navigator.userLanguage || window.navigator.language
// corrected = isNaN(errorRate) ? 0 : errorRate // we'll get a NaN if there are no activations
// corrected.toLocaleString(locale, { style:'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }),

/**
 * Render the legend in the sidecar header
 *
 * @param options user options from the CLI
 *
 */
export const drawLegend = (
  tab: Tab,
  viewName: string,
  rightHeader: HTMLElement,
  { statData, nFailures },
  gridContainer: HTMLElement
) => {
  const existing = rightHeader.querySelector('.grid-header-key')
  const wrapper = existing || document.createElement('div')
  const existing2 = wrapper.querySelector('.cell-container')
  const wrapper2 = existing2 || document.createElement('div')

  /** user asked to toggle the latency bucket filter */
  const toggleFilter = idx => (): boolean | void => {
    // isRemove: user deselected current filter
    const isRemove = parseInt(gridContainer.getAttribute('data-latency-filter'), 10) === idx
    const containers = [wrapper2, gridContainer] // legend and main grid

    containers.forEach(container => {
      if (isRemove) {
        container.classList.remove('has-latency-filter')
        container.removeAttribute('data-latency-filter')
      } else {
        container.classList.add('has-latency-filter')
        container.setAttribute('data-latency-filter', idx)
      }
    })
  }

  if (!existing) {
    rightHeader.appendChild(wrapper)
    wrapper.appendChild(wrapper2)
    wrapper.className = 'activation-viz-plugin grid-header-key'
    wrapper2.className = 'grid-grid zoom_1 cell-container'
  }
  wrapper2.setAttribute('color-by', 'duration')

  /**
   * Render one legend entry
   *
   */
  interface EntryOptions {
    zoom: number
    labelAsTooltip?: boolean
    useThisLabelInstead?: string
    balloonPos?: string
    balloonLength?: string
    onclick?: () => boolean | void
  }
  const entry = (labelText, labelValue, isFailure, latBucket, options: EntryOptions) => {
    const existing3 = wrapper2.querySelector(`.grid[label="${labelText}"]`)
    const wrapper3 = existing3 || document.createElement('div')
    const existingEntry = wrapper3.querySelector('table')
    const entry = existingEntry || document.createElement('table')

    let valueDom
    if (!existing3) {
      const labelRow = entry.insertRow(-1)
      const valueRow = entry.insertRow(-1)
      const gridCellCell = valueRow.insertCell(-1)
      const cell = document.createElement('div')
      const valueCell = document.createElement('div')

      wrapper2.appendChild(wrapper3)
      wrapper3.className = `grid zoom_${options.zoom}`
      wrapper3.setAttribute('label', labelText)
      gridCellCell.appendChild(cell)
      wrapper3.appendChild(entry)
      cell.className = 'grid-cell grid-cell-occupied'

      // value for the legend entry
      valueDom = document.createElement('div')
      valueCell.classList.add('kind')
      gridCellCell.appendChild(valueCell)

      renderCell(tab, 'Legend', cell, null, isFailure, 0, latBucket, {
        zoom: options.zoom
      }) // null means no activation associated with cell

      if (options.onclick) {
        cell.onclick = options.onclick
      } else {
        cell.classList.add('grid-no-hover')
      }

      if (options.labelAsTooltip) {
        const attachTo = cell
        attachTo.setAttribute('data-balloon', labelText)
        attachTo.setAttribute('data-balloon-pos', options.balloonPos)
        attachTo.setAttribute('data-balloon-length', options.balloonLength)
      }

      if (options.useThisLabelInstead) {
        const labelCell = labelRow.insertCell(-1)
        labelCell.appendChild(document.createTextNode(options.useThisLabelInstead))
        labelCell.setAttribute('colspan', '2')
        labelCell.className = 'activation-viz-legend-label'
      } else if (!options.labelAsTooltip) {
        const labelCell = labelRow.insertCell(-1)
        labelCell.appendChild(document.createTextNode(labelText))
        labelCell.className = 'activation-viz-legend-label'
      }
      valueCell.appendChild(valueDom)
      // valueCell.style.lineHeight = '1em'
      // gridCellCell.style.paddingRight = '0.5ex'
    } else {
      valueDom = entry.querySelector('.kind > div')
    }

    valueDom.innerText = labelValue
  }

  //
  // if we have at least one non-zero performance bucket, then
  // render the buckets up to that last non-zero bucket
  //
  latencyBuckets.forEach((latencyRange, idx, A) => {
    const last = idx === A.length - 1
    const lower = idx === 0 ? 0 : A[idx - 1]
    const upper = latencyRange
    const roughlySame = upper - lower < 1000 && ((lower < 1000 && upper < 1000) || (lower > 1000 && upper > 1000))

    // roughlySame means e.g. 50-100ms versus 500ms-1s; both
    // are "close", but the second one splits into a new range

    const labelText =
      '' +
      (last
        ? `${prettyPrintDuration(latencyRange)}+` // special label for the last latency bucket
        : roughlySame
        ? `${lower}${enDash}${prettyPrintDuration(upper)}`
        : `${prettyPrintDuration(lower)}${enDash}${prettyPrintDuration(upper)}`)

    // number of cells with this coloration
    const count = statData.latBuckets[idx]

    const opts: EntryOptions = {
      zoom: -1,
      useThisLabelInstead:
        (idx === A.length - 1 ? '>' : '') +
        (upper >= 500 && upper < 1000 ? `${(upper / 1000).toLocaleString()}s` : prettyPrintDuration(upper))
    }

    if (count > 0) {
      // only add an onclick handler if there is something to filter by
      opts.onclick = toggleFilter(idx)
    }

    entry(labelText, count, false, idx, opts) // false means not a failure
  })

  //
  // render the legend entry for failures
  //
  const opts: EntryOptions = { zoom: -1, useThisLabelInstead: 'fail' }
  if (nFailures > 0) {
    opts.onclick = toggleFilter(-1)
  }
  entry(
    'these cells represent activation failures',
    nFailures,
    true,
    -1, // true means render as failure
    opts
  )
}
