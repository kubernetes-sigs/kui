/*
 * Copyright 2020 IBM Corporation
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

import React from 'react'
import prettyMillis from 'pretty-ms'
import { REPL, Row, Tab, Table, flatten, i18n } from '@kui-shell/core'

import Bar from './Bar'
import DefaultColoring from './Coloring'
import trafficLight from './css-for-status'
import { /* renderCell, */ onClickForCell, CellOnClickHandler } from './TableCell'

import '../../../../web/scss/components/Table/SequenceDiagram/_index.scss'

const strings = i18n('plugin-client-common')

interface Props {
  response: Table
  tab: Tab
  repl: REPL

  /**
   * Threshold in millis below which two rows will be considered to be
   * part of the same dense region of time. Default: 120s
   *
   */
  denseThreshold?: number
}

/**
 * An "Interval" is a maximal contiguous sequence of Tasks that are
 * both a) from the same Job; and b) not too far away in time from the
 * start of the Interval
 *
 */
interface DenseInterval {
  startMillis: number
  endMillis: number
  jobName: string
  rows: Row[]
}

interface State {
  /** The intervals! */
  intervals: DenseInterval[]

  /** To help normalize the width of bars, we stash the max, across
   * `this.intervals` of `endMills-startMillis` */
  maxIntervalTimeSpan: number

  /** To help render in-progress tasks, where we don't have a task
   * completion time, we can at least use the maximum completion time
   * across the tasks that *have* completed */
  maxEndMillis: number
}

function prettyPrintDuration(duration: number): string {
  try {
    return prettyMillis(duration)
  } catch (err) {
    console.error('error formatting duration', duration, err)
    return ''
  }
}

export default class SequenceDiagram extends React.PureComponent<Props, State> {
  /**
   * @see Props.denseThreshold
   *
   */
  private static readonly DEFAULT_DENSE_THRESHOLD = 120 * 1000

  public constructor(props: Props) {
    super(props)
    this.state = SequenceDiagram.computeGapModel(props.response, props.denseThreshold)
  }

  public static getDerivedStateFromProps(props: Props) {
    return SequenceDiagram.computeGapModel(props.response, props.denseThreshold)
  }

  /** @return numerator/interval formatted */
  private getFraction(numerator: number, interval: DenseInterval): number {
    if (interval && (!interval.startMillis || !interval.endMillis)) {
      return 0
    } else {
      const fraction = Math.min(
        1,
        numerator / (interval ? interval.endMillis - interval.startMillis : this.state.maxIntervalTimeSpan)
      )
      return isNaN(fraction) ? undefined : fraction
    }
  }

  /**
   * This computes the `State` for this component from the given
   * `response` Table model.
   *
   */
  private static computeGapModel(
    response: Table,
    denseThreshold = response.colorBy === 'status' ? Number.MAX_SAFE_INTEGER : SequenceDiagram.DEFAULT_DENSE_THRESHOLD
  ): State {
    // indices of start and complete attributes
    const idx1 = response.startColumnIdx
    const idx2 = response.completeColumnIdx

    // 1) [SLICE]: need to slice so as not to permute the original table model
    // 2) [SORT]: by startTime, then by delta from start of current gap
    // 3) [INTERVALS]: populate a tuple of intervals, where each interval consists of tasks a) from the same job; and b) not too distant in time from the start of the current interval
    const intervals = response.body
      .slice(0) // [SLICE]
      .sort((a, b) => {
        // [SORT]
        if (response.noSort) {
          return 0
        }

        const jobNameComparo = a.name.localeCompare(b.name)
        if (jobNameComparo === 0) {
          // same job name; then compare by startTime
          const aStartCell = a.attributes[idx1]
          const bStartCell = b.attributes[idx1]
          if (!aStartCell || !bStartCell || !aStartCell.value || !bStartCell.value) {
            return 0
          } else {
            const startDelta = new Date(aStartCell.value).getTime() - new Date(bStartCell.value).getTime()
            if (startDelta === 0) {
              const aEndCell = a.attributes[idx2]
              const bEndCell = b.attributes[idx2]
              if (!aEndCell || !bEndCell || !aEndCell.value || !bEndCell.value) {
                return 0
              } else {
                const endDelta = new Date(aEndCell.value).getTime() - new Date(bEndCell.value).getTime()
                return endDelta
              }
            } else {
              return startDelta
            }
          }
        } else {
          // different job names
          return jobNameComparo
        }
      })
      .reduce((intervals, row) => {
        // [INTERVALS]
        const jobName = row.name
        const startMillis = new Date(row.attributes[idx1].value).getTime()
        const endMillis =
          !row.attributes[idx2].value || row.attributes[idx2].value === '<none>'
            ? startMillis
            : new Date(row.attributes[idx2].value).getTime()

        // if (isNaN(endMillis)) {
        // }

        if (intervals.length === 0) {
          // case 1: first interval
          return [{ startMillis, endMillis, jobName, rows: [row] }]
        } else {
          const currentInterval = intervals[intervals.length - 1]
          const gap = endMillis - currentInterval.startMillis

          if (gap < denseThreshold && (response.colorBy === 'status' || currentInterval.jobName === jobName)) {
            // case 2: the gap is small relative to the start of the
            // current interval and for the same job as the current
            // interval, in which case we add to current interval
            currentInterval.endMillis = Math.max(endMillis, currentInterval.endMillis)
            currentInterval.startMillis = Math.min(startMillis, currentInterval.startMillis)
            currentInterval.rows.push(row)
          } else {
            // case 3: gap too long, or new job -- create new interval
            intervals.push({ startMillis, endMillis, jobName, rows: [row] })
          }

          return intervals
        }
      }, [] as DenseInterval[])

    return {
      maxIntervalTimeSpan: Math.min(
        denseThreshold,
        intervals.reduce((max, interval) => Math.max(max, interval.endMillis - interval.startMillis), 0)
      ),
      maxEndMillis: intervals.reduce((max, interval) => Math.max(max, interval.endMillis), 0),
      intervals
    }
  }

  private header() {
    return (
      <thead>
        <tr>
          {/*  <th className="kui--header-cell">Name</th> */}
          <th className="kui--header-cell">Interval</th>
          <th className="kui--header-cell">Delta</th>
          {/* this.props.response.statusColumnIdx >= 0 && <th className="kui--header-cell">Status</th> */}
        </tr>
      </thead>
    )
  }

  private nSpanCols() {
    return 2 // this.props.response.statusColumnIdx >= 0 ? 4 : 3
  }

  private overheads(interval: DenseInterval): { coldStartFraction: number; gapFraction: number } {
    const idx1 = this.props.response.startColumnIdx
    const idx2 = this.props.response.completeColumnIdx
    const idx3 = this.props.response.coldStartColumnIdx

    const { coldStarts, gaps, denominator } = interval.rows.reduce(
      (sums, row) => {
        const startMillisAttr = row.attributes[idx1]
        const endMillisAttr = row.attributes[idx2]
        const coldAttr = idx3 ? row.attributes[idx3] : undefined
        let thisStartMillis: number
        const { previousEndMillis } = sums

        if (endMillisAttr) {
          thisStartMillis = new Date(startMillisAttr.value).getTime()
          const thisEndMillis = new Date(endMillisAttr.value).getTime()

          sums.denominator += thisEndMillis - thisStartMillis
          sums.previousEndMillis = thisEndMillis
        }

        if (coldAttr) {
          sums.coldStarts += parseInt(coldAttr.value, 10)
        }

        if (previousEndMillis > 0) {
          const gap = thisStartMillis - previousEndMillis
          if (gap > 0) {
            sums.gaps += gap
          }
        }

        return sums
      },
      { coldStarts: 0, gaps: 0, denominator: 0, previousEndMillis: 0 }
    )

    return { coldStartFraction: coldStarts / denominator, gapFraction: gaps / denominator }
  }

  private gapRow(startMillis: number, intervalIdx: number, onClick: CellOnClickHandler) {
    const interval = this.state.intervals[intervalIdx]
    const endMillis = interval.endMillis
    const hasStart = startMillis !== undefined && !isNaN(startMillis)
    const overheads = this.overheads(interval)

    const gap = [
      <tr key={`gaprowB-${intervalIdx}`} className="kui--interval-start">
        {/* <td /> */}
        <td className="kui--gap-cell" colSpan={this.nSpanCols()}>
          <span className="flex-layout">
            {!hasStart ? '' : new Date(startMillis).toLocaleString()}
            {hasStart && endMillis && (
              <span className="flex-fill flex-align-end left-pad">
                {endMillis - startMillis === 0 ? '' : `${prettyPrintDuration(endMillis - startMillis)}`}
                {overheads.coldStartFraction > 0 || overheads.gapFraction > 0 ? ' (' : ''}
                {overheads.coldStartFraction > 0
                  ? `${Math.round(100 * overheads.coldStartFraction).toFixed(0)}% cold starts`
                  : ''}
                {overheads.gapFraction > 0
                  ? `${overheads.coldStartFraction > 0 ? ', ' : ''}${Math.round(100 * overheads.gapFraction).toFixed(
                      0
                    )}% scheduling gaps`
                  : ''}
                {overheads.coldStartFraction > 0 || overheads.gapFraction > 0 ? ')' : ''}
              </span>
            )}
          </span>
        </td>
      </tr>,
      <tr key={`gaprowB-${intervalIdx}-jobName`} className="kui--interval-start-jobName">
        <td
          className={['kui--gap-cell', 'kui--table-cell-is-name', onClick ? 'clickable' : ''].join(' ')}
          colSpan={this.nSpanCols()}
          onClick={onClick}
        >
          {interval.jobName}
        </td>
      </tr>
    ]

    return this.blankRow(intervalIdx).concat(gap)
  }

  private blankRow(intervalIdx: number) {
    return intervalIdx === 0
      ? []
      : [
          <tr key={`gaprowA-${intervalIdx}`} className="kui--interval-blank">
            <td colSpan={this.nSpanCols()} />
          </tr>
        ]
  }

  private colorByStatus() {
    return this.props.response.colorBy === 'status' && this.props.response.statusColumnIdx >= 0
  }

  private rows() {
    const idx1 = this.props.response.startColumnIdx
    const idx2 = this.props.response.completeColumnIdx
    const idx4 = this.props.response.statusColumnIdx

    const colorByStatus = this.colorByStatus()
    const durationColoring = new DefaultColoring(this.props.response)
    const durationColor = durationColoring.durationCss.bind(durationColoring)

    return flatten(
      this.state.intervals.map((interval, intervalIdx) =>
        flatten(
          interval.rows.map((row, rowIdx) => {
            const startDate = new Date(row.attributes[idx1].value)
            const startMillis = startDate.getTime()
            const endMillis = !row.attributes[idx2].value
              ? this.state.maxEndMillis || startMillis
              : new Date(row.attributes[idx2].value).getTime()

            const durationCol =
              this.props.response.durationColumnIdx >= 0 && row.attributes[this.props.response.durationColumnIdx]
                ? parseInt(row.attributes[this.props.response.durationColumnIdx].value, 10)
                : undefined
            const duration = durationCol || (!endMillis ? 0 : endMillis - startMillis)

            const left = this.getFraction(startMillis - interval.startMillis, interval)
            let width = !duration ? undefined : this.getFraction(duration, interval)
            if (left + width > 1) {
              /* console.error(
                'oops',
                left,
                width,
                duration,
                startMillis - interval.startMillis,
                interval.endMillis - interval.startMillis,
                interval.endMillis - duration - interval.startMillis,
                interval,
                this.state.maxEndMillis
              ) */
              width = 1 - left
            }
            const coldStart =
              this.props.response.coldStartColumnIdx >= 0 && row.attributes[this.props.response.coldStartColumnIdx]
                ? parseInt(row.attributes[this.props.response.coldStartColumnIdx].value, 10)
                : undefined
            let widthB = coldStart ? this.getFraction(coldStart, interval) : undefined
            const title = strings('Duration', prettyPrintDuration(duration))
            const titleB = coldStart ? strings('Cold Start', prettyPrintDuration(coldStart), title) : undefined
            const className = colorByStatus ? '' /* trafficLight(row.attributes[idx4]) */ : durationColor(duration, false)
            if (left + widthB > 1) {
              /* console.error(
                'oopsB',
                left,
                widthB,
                startMillis - interval.startMillis,
                interval,
                interval.endMillis - interval.startMillis,
                interval
                ) */
              widthB = 1 - left
            }

            const gap =
              intervalIdx === 0 && rowIdx === 0
                ? 0
                : rowIdx === 0
                ? 0 // startMillis - this.state.intervals[intervalIdx - 1].endMillis
                : startMillis - new Date(interval.rows[0].attributes[idx1].value).getTime()

            const gapText =
              (intervalIdx === 0 && rowIdx === 0) || gap === 0 || isNaN(gap)
                ? '' // very first row or unfinished task (NaN gap)
                : (gap >= 0 ? '+' : '') + prettyPrintDuration(gap)

            // drilldown to underlying resource, e.g. Pod for Kubernetes Jobs
            const onClick = onClickForCell(row, this.props.tab, this.props.repl, row.attributes[0])

            // rows that help to define the contents of the interval; e.g. jobName
            const interGroupGapRow =
              rowIdx === 0 && !colorByStatus ? this.gapRow(startMillis, intervalIdx, onClick) : []

            // does this row represent scheduling overhead?
            const isOverheadRow = /Overhead/i.test(row.attributes[idx4].value)

            return interGroupGapRow.concat([
              <tr
                key={`${intervalIdx}-${rowIdx}`}
                className={
                  'kui--sequence-diagram-data-row' +
                  (rowIdx === interval.rows.length - 1 ? ' kui--sequence-diagram-last-row-in-interval' : '')
                }
              >
                {false && colorByStatus && (
                  <td className="kui--secondary-text">
                    <span
                      className={
                        'kui--table-cell-is-name cell-inner ' + (row.onclick ? 'clickable' : '') + (row.css || '')
                      }
                      onClick={onClick}
                    >
                      {row.name}
                    </span>
                  </td>
                )}
                <td className="kui--sequence-diagram-bar-cell" onClick={onClick}>
                  <Bar
                    left={left}
                    width={width}
                    widthOverlay={widthB}
                    className={className}
                    onClick={onClick}
                    title={title}
                    titleOverlay={titleB}
                  />
                </td>
                <td className="kui--tertiary-text">{gapText}</td>
                {colorByStatus && (
                  <td className="kui--secondary-text">
                    <span className={'cell-inner ' + trafficLight(row.attributes[idx4])}>
                      {!isOverheadRow && row.attributes[idx4].value}
                    </span>
                  </td>
                )}
                {/* this.props.response.statusColumnIdx >= 0
                  ? renderCell(
                      this.props.response,
                      row,
                      false,
                      this.props.tab,
                      this.props.repl
                    )(
                      {
                        id: '',
                        value: row.attributes[this.props.response.statusColumnIdx].value,
                        info: { header: 'Status' },
                        isEditable: false,
                        isEditing: false,
                        isValid: true
                      },
                      this.props.response.statusColumnIdx + 1
                    )
                  : undefined */}
              </tr>
            ])
          })
        )
      )
    )
  }

  /** To help with adjusting row height, a data-size attribute */
  private size() {
    const nRows = this.props.response.body.length
    return nRows <= 10 ? 'small' : nRows <= 40 ? 'medium' : nRows <= 200 ? 'large' : 'huge'
  }

  public render() {
    if (!this.state) {
      return <React.Fragment />
    }

    return (
      <div className="kui--data-table-container bx--data-table-container">
        <table
          className="bx--data-table bx--data-table--compact kui--sequence-diagram"
          data-size={this.size()}
          data-color-by="duration"
        >
          {/* this.header() */}
          <tbody>{this.rows()}</tbody>
        </table>
      </div>
    )
  }
}
