/*
 * Copyright 2020 The Kubernetes Authors
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
import { basename } from 'path'
import prettyMillis from 'pretty-ms'
import { REPL, Row, Tab, Table, i18n, Util } from '@kui-shell/core'

import Bar from './Bar'
import ErrorCell from './ErrorCell'
import tooltipContent from './Tooltip'
import DefaultColoring from './Coloring'
import ProgressState from './ProgressState'
import trafficLight from './css-for-status'
import { onClickForCell, CellOnClickHandler } from './TableCell'
import KuiConfiguration from '../../Client/KuiConfiguration'

const Ansi = React.lazy(() => import('../Scalar/Ansi'))
const Tooltip = React.lazy(() => import('../../spi/Tooltip'))

import '../../../../web/scss/components/Table/SequenceDiagram/_index.scss'

const strings = i18n('plugin-client-common')

const safePrettyPrintBytes = Util.prettyPrintBytes

function Progress(props: { percent: number; className: string }) {
  return <Bar left={0} width={props.percent} className={props.className} />
}

type Props = ProgressState & {
  response: Table
  tab: Tab
  repl: REPL
  config: KuiConfiguration

  /**
   * Threshold in millis below which two rows will be considered to be
   * part of the same dense region of time. Default: 120s
   *
   */
  denseThreshold?: number

  /** whether the table is currently "live", and responding to updates from the controller */
  isWatching: boolean
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

  /** force a refresh, for the poller */
  iter: number
}

/** @return pretty-printed bytes */
function safePrettyPrintBytesWithPrefix(bytes: string | number, prefix: string): string {
  return prefix + safePrettyPrintBytes(bytes)
}

/** @return bytes per second, formatted to a "N KBps" form */
function prettyPrintThroughput(bytes: string, durationInMillis: number): string {
  try {
    const numerator = parseInt(bytes, 10) // bytes
    const denominator = durationInMillis / 1000 // seconds
    const ratio = numerator / denominator // bytes per second

    return safePrettyPrintBytes(ratio) + '/s'
  } catch (err) {
    return ''
  }
}

function prettyPrintDuration(duration: number): string {
  try {
    return prettyMillis(duration, { millisecondsDecimalDigits: duration < 10 ? 1 : 0 })
  } catch (err) {
    console.error('error formatting duration', duration, err)
    return ''
  }
}

function prettyPrintFraction(a: number, b: number): string {
  const frac = (100 * a) / b
  return frac.toFixed(frac < 10 ? 1 : 0)
}

function prettyPrintDateDelta(row: Row, idx1: number, idx2: number, numerator?: string): string {
  const cell1 = row.attributes[idx1]
  const cell2 = row.attributes[idx2]

  try {
    const startMillis = new Date(cell1.value).getTime()

    if (cell2.value === '<none>') {
      if (cell1.value === '<none>') {
        return ''
      } else {
        // then print delta versus now
        const delta = Date.now() - startMillis
        if (isNaN(delta) || !isFinite(delta)) {
          return ''
        } else if (numerator === undefined) {
          return prettyMillis(delta, { compact: true })
        } else {
          return prettyPrintThroughput(numerator, delta)
        }
      }
    } else {
      const endMillis = new Date(cell2.value).getTime()
      const delta = endMillis - startMillis
      if (isNaN(delta) || !isFinite(delta)) {
        return ''
      } else if (numerator === undefined) {
        return prettyMillis(delta)
      } else {
        return prettyPrintThroughput(numerator, delta)
      }
    }
  } catch (err) {
    console.error('error formatting delta', cell1, cell2, err)
    return ''
  }
}

export default class SequenceDiagram extends React.PureComponent<Props, State> {
  /**
   * @see Props.denseThreshold
   *
   */
  private static readonly DEFAULT_DENSE_THRESHOLD = 120 * 1000

  /** If state.isWatching, we may have pollers to refresh the durations */
  private poller: ReturnType<typeof setInterval>

  public constructor(props: Props) {
    super(props)
    this.state = SequenceDiagram.getDerivedStateFromProps(props)
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    return Object.assign(
      { iter: state ? state.iter : 0 },
      SequenceDiagram.computeGapModel(props.response, props.denseThreshold)
    )
  }

  public componentDidUpdate() {
    if (this.props.isWatching && !this.poller) {
      this.poller = setInterval(() => {
        this.setState(curState => ({ iter: curState.iter + 1 }))
      }, 2000)
    } else if (!this.props.isWatching && this.poller) {
      clearInterval(this.poller)
    }
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

  private static sorter(response: Props['response']) {
    if (response.noSort) {
      return () => 0
    } else {
      const idx1 = response.startColumnIdx
      const idx2 = response.completeColumnIdx

      return (a: Row, b: Row) => {
        if (!a.name) {
          console.error('Missing name', a)
          return 0
        } else if (!b.name) {
          console.error('Missing name', b)
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
      }
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
  ): Omit<State, 'iter'> {
    // indices of start and complete attributes
    const idx1 = response.startColumnIdx
    const idx2 = response.completeColumnIdx

    // 1) [SLICE]: need to slice so as not to permute the original table model
    // 2) [SORT]: by startTime, then by delta from start of current gap
    // 3) [INTERVALS]: populate a tuple of intervals, where each interval consists of tasks a) from the same job; and b) not too distant in time from the start of the current interval
    const intervals = response.body
      .slice(0) // [SLICE]
      .sort(SequenceDiagram.sorter(response)) // SORT
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

  private overheads(
    interval: DenseInterval
  ): { coldStartFraction: number; queueingDelaysFraction: number; gapFraction: number } {
    const idx1 = this.props.response.startColumnIdx
    const idx2 = this.props.response.completeColumnIdx
    const idx3 = this.props.response.coldStartColumnIdx
    const idx4 = this.props.response.queueingDelayColumnIdx

    const { coldStarts, queueingDelays, gaps, denominator } = interval.rows.reduce(
      (sums, row) => {
        const startMillisAttr = row.attributes[idx1]
        const endMillisAttr = row.attributes[idx2]
        const coldAttr = idx3 ? row.attributes[idx3] : undefined
        const queueingDelayAttr = idx4 ? row.attributes[idx4] : undefined
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

        if (queueingDelayAttr) {
          sums.queueingDelays += parseInt(queueingDelayAttr.value, 10)
        }

        if (previousEndMillis > 0) {
          const gap = thisStartMillis - previousEndMillis
          if (gap > 0) {
            sums.gaps += gap
          }
        }

        return sums
      },
      { coldStarts: 0, queueingDelays: 0, gaps: 0, denominator: 0, previousEndMillis: 0 }
    )

    return {
      coldStartFraction: coldStarts / denominator,
      queueingDelaysFraction: queueingDelays / denominator,
      gapFraction: gaps / denominator
    }
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

  private findAttrIdx(key: string) {
    if (this.props.response.body.length >= 0) {
      const rowWithAttr = this.props.response.body.find(row =>
        row.attributes ? row.attributes.find(_ => _.key === key) : false
      )
      if (rowWithAttr) {
        return rowWithAttr.attributes.findIndex(_ => _.key === key)
      }
    }
    return -1
  }

  private rows() {
    const idx1 = this.props.response.startColumnIdx
    const idx2 = this.props.response.completeColumnIdx
    const idx4 = this.props.response.statusColumnIdx

    const idx5 = this.findAttrIdx('InputFile')
    const idx6 = this.findAttrIdx('InputFileSize')
    const idx7 = this.findAttrIdx('Message')

    const colorByStatus = this.colorByStatus()
    const durationColoring = new DefaultColoring(this.props.response)
    const durationColor = durationColoring.durationCss.bind(durationColoring)

    return Util.flatten(
      this.state.intervals.map((interval, intervalIdx) =>
        Util.flatten(
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
              width = 1 - left
            }

            const className = colorByStatus
              ? '' /* trafficLight(row.attributes[idx4]) */
              : durationColor(duration, false)

            /** Compute the width of the given attr of overhead */
            const computeOverhead = (attr: 'Cold Start' | 'Queueing Delay') => {
              const idxAttr = attr === 'Cold Start' ? 'coldStartColumnIdx' : 'queueingDelayColumnIdx'
              const idx = this.props.response[idxAttr]

              if (idx !== undefined && idx >= 0) {
                const overhead = row.attributes[idx] ? parseInt(row.attributes[idx].value, 10) : undefined

                if (overhead && overhead > 0) {
                  // tooltip for the overhead bar
                  const titleB = overhead
                    ? tooltipContent(
                        strings(attr),
                        strings(
                          'DurationWithFraction',
                          prettyPrintDuration(overhead),
                          prettyPrintFraction(overhead, duration)
                        )
                      )
                    : undefined

                  // width of the overhead bar
                  let widthB = overhead ? this.getFraction(overhead, interval) : undefined
                  if (left + widthB > 1) {
                    widthB = 1 - left
                  }

                  return { title: titleB, width: widthB, offset: 0 }
                }
              }
            }

            const overheads = ['Queueing Delay', 'Cold Start'].map(computeOverhead).filter(Boolean)

            if (overheads.length > 1) {
              let runningOffset = overheads[0].width
              for (let idx = 1; idx < overheads.length; idx++) {
                overheads[idx].offset = runningOffset
                runningOffset += overheads[idx].width
              }
            }

            // time gap since the run
            const gap = startMillis - interval.startMillis

            const gapText =
              (intervalIdx === 0 && rowIdx === 0) || gap === 0 || isNaN(gap)
                ? '' // very first row or unfinished task (NaN gap)
                : (gap >= 0 ? '+' : '') + prettyPrintDuration(gap)

            // drilldown to underlying resource, e.g. Pod for Kubernetes Jobs
            const onClick = onClickForCell(row, this.props.tab, this.props.repl, row.attributes[0], this.props.response)

            // rows that help to define the contents of the interval; e.g. jobName
            const interGroupGapRow =
              rowIdx === 0 && !colorByStatus ? this.gapRow(startMillis, intervalIdx, onClick) : []

            // does this row represent scheduling overhead?
            const isOverheadRow = /Overhead/i.test(row.attributes[idx4].value)

            const color = trafficLight(row.attributes[idx4])

            return interGroupGapRow.concat([
              <tr
                key={`${intervalIdx}-${rowIdx}`}
                className={
                  'kui--sequence-diagram-data-row' +
                  (rowIdx === interval.rows.length - 1 ? ' kui--sequence-diagram-last-row-in-interval' : '')
                }
              >
                {this.props.progress && this.props.progress[row.rowKey] && this.props.progress[row.rowKey].fileName && (
                  <td className="kui--tertiary-text pf-m-fit-content text-right monospace">
                    <span className="cell-inner">
                      <Ansi noWrap>{this.props.progress[row.rowKey].fileName}</Ansi>
                    </span>
                  </td>
                )}
                {idx5 >= 0 && (
                  <td className="kui--tertiary-text pf-m-fit-content text-right badge-width">
                    <Tooltip
                      content={
                        (row.attributes[idx5] ? basename(row.attributes[idx5].value) : '') +
                        (idx6 < 0 || !row.attributes[idx6]
                          ? ''
                          : safePrettyPrintBytesWithPrefix(row.attributes[idx6].value, ': '))
                      }
                    >
                      <span className="cell-inner">
                        {row.attributes[idx5] ? basename(row.attributes[idx5].value) : ''}
                      </span>
                    </Tooltip>
                  </td>
                )}
                <td className="kui--sequence-diagram-bar-cell pf-m-nowrap" onClick={onClick}>
                  {this.props.progress &&
                  this.props.progress[row.rowKey] &&
                  this.props.progress[row.rowKey].percentComplete < 1 ? (
                    <Progress percent={this.props.progress[row.rowKey].percentComplete} className={className} />
                  ) : (
                    <Bar
                      left={left}
                      width={width}
                      title={tooltipContent(strings('DurationOnly'), prettyPrintDuration(duration))}
                      onClick={onClick}
                      className={className}
                      overheads={overheads}
                    />
                  )}
                </td>
                <td className="kui--tertiary-text pf-m-fit-content">{gapText}</td>
                {colorByStatus && (
                  <td className="kui--secondary-text pf-m-fit-content">
                    <div data-tag="badge" className="cell-inner">
                      <span data-tag="badge-circle" className={color}>
                        {/red-background/.test(color) ? <ErrorCell /> : undefined}
                      </span>
                      <span className={'kui--cell-inner-text'}>{!isOverheadRow && row.attributes[idx4].value}</span>
                    </div>
                  </td>
                )}
                {colorByStatus && idx7 < 0 && (
                  <td className="kui--tertiary-text pf-m-fit-content">
                    <span className="cell-inner">{!isOverheadRow && prettyPrintDateDelta(row, idx1, idx2)}</span>
                  </td>
                )}
                {idx6 >= 0 && idx7 < 0 && (
                  <td className="kui--tertiary-text pf-m-fit-content text-right monospace">
                    <Tooltip content={row.attributes[idx6] && safePrettyPrintBytes(row.attributes[idx6].value)}>
                      <span className="cell-inner">
                        {row.attributes[idx6] ? prettyPrintDateDelta(row, idx1, idx2, row.attributes[idx6].value) : ''}
                      </span>
                    </Tooltip>
                  </td>
                )}
                {this.props.progress && this.props.progress[row.rowKey] && this.props.progress[row.rowKey].message && (
                  <td className="kui--tertiary-text pf-m-fit-content text-right monospace">
                    <span className="cell-inner">
                      <Ansi noWrap>{this.props.progress[row.rowKey].message}</Ansi>
                    </span>
                  </td>
                )}
                {idx7 >= 0 && (
                  <td className="kui--tertiary-text pf-m-fit-content text-right monospace">
                    <Tooltip content={row.attributes[idx7] ? row.attributes[idx7].value : ''}>
                      <span className="cell-inner">{row.attributes[idx7] ? row.attributes[idx7].value : ''}</span>
                    </Tooltip>
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
      <div className="kui--data-table-container kui--data-table-container">
        <table
          className="kui--table-like-wrapper pf-c-table pf-m-compact kui--sequence-diagram"
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
