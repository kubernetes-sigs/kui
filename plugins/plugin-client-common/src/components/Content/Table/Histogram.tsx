/*
 * Copyright 2021 The Kubernetes Authors
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
import stringColoring from 'string-similarity-coloring'
import { REPL, Row, sameRow, Tab, Table } from '@kui-shell/core'
import { Chart, ChartAxis, ChartBar, ChartLabel } from '@patternfly/react-charts'

interface Props {
  response: Table
  tab: Tab
  repl: REPL

  /** whether the table is currently "live", and responding to updates from the controller */
  isWatching: boolean
}

interface State {
  rows: Row[]
  animate: boolean
  counts: number[]
  colors: string[]
  scale: 'linear' | 'log'
}

function sameState(A: State, B: State): boolean {
  return (
    A.scale === B.scale &&
    A.counts &&
    A.counts.length === B.counts.length &&
    A.counts.every((countBefore, idx) => countBefore === B.counts[idx]) &&
    A.rows &&
    A.rows.every((rowBefore, idx) => sameRow(rowBefore, B.rows[idx]))
  )
}

export default class Histogram extends React.PureComponent<Props, State> {
  private static readonly domainPadding = 10
  private readonly horizontal = true
  private readonly barHeight = 10
  private readonly barSpacing = 0.15 // 15% of barHeight spacing between bars
  private readonly axisLabelFontSize = 0.9 * this.barHeight
  private readonly minAxisLabelChars = 4
  private readonly maxAxisLabelChars = 13
  private readonly barLabelFontSize = 0.65 * this.barHeight
  private readonly minBarLabelChars = 1
  private readonly maxBarLabelChars = 6

  public constructor(props: Props) {
    super(props)
    this.state = Histogram.filterRows(props.response.body, props.response.colorBy !== undefined)
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    const newState = Histogram.filterRows(props.response.body, props.response.colorBy !== undefined)

    // to avoid re-renders when nothing has changed...
    if (state && sameState(state, newState)) {
      // nothing has changed, disable animation
      // see https://github.com/IBM/kui/issues/7175
      return {
        animate: false
      }
    } else {
      // otherwise, we have changes to the state
      return newState
    }
  }

  private static filterRows(rows: Props['response']['body'], useFancyColoring: boolean): State {
    const countOf = (row: Row) => parseInt(row.attributes.find(_ => _.key && /^count$/i.test(_.key)).value, 10)
    const counts = rows.map(countOf)
    const yMax = counts.reduce((yMax, count) => Math.max(yMax, count), 0)

    const filteredRowsPriorToSorting = rows.filter((row, ridx) => (!Histogram.isTiny(counts[ridx], yMax) ? 1 : 0))

    if (!useFancyColoring) {
      const filteredRows = filteredRowsPriorToSorting
      return {
        animate: true,
        rows: filteredRows,
        counts: filteredRows.map(countOf),
        scale: filteredRows.length === rows.length ? 'linear' : 'log',
        colors: undefined
      }
    } else {
      // assign colors to the rows, and then sort the rows to group
      // nearby colors(in the color space) so that they are also close
      // geographically
      const sortedByCount = filteredRowsPriorToSorting.slice().sort((a, b) => countOf(b) - countOf(a))
      const colors = stringColoring(
        sortedByCount.map(_ => _.rowKey || _.name),
        { theme: 'patternfly4' }
      )

      const filteredRowsForSorting = sortedByCount
        .map((row, idx) => ({ row, color: colors[idx] }))
        .sort((a, b) => {
          // note how we move the "random" color assignments to the
          // bottom; these are color assignments due to running out of
          // primary colors; they should only affect the smaller buckets
          return a.color.isRandomAssignment
            ? -1
            : b.color.isRandomAssignment
            ? 1
            : b.color.primary - a.color.primary ||
              countOf(a.row) - countOf(b.row) ||
              b.color.secondary - a.color.secondary
        })

      const filteredRows = filteredRowsForSorting.map(_ => _.row)

      return {
        animate: true,
        rows: filteredRows,
        counts: filteredRows.map(countOf),
        scale: filteredRows.length === rows.length ? 'linear' : 'log',
        colors: filteredRowsForSorting.map(_ => _.color.color)
      }
    }
  }

  /** heuristic to allow "just enough" space for axis labels */
  private leftPad() {
    const longestAxisLabel = this.state.rows.reduce(
      (maxLength, row) => Math.max(maxLength, (row.rowKey || row.name).length),
      0
    )

    const leftPad = Math.min(
      this.maxAxisLabelChars * this.axisLabelFontSize,
      Math.max(this.minAxisLabelChars * this.axisLabelFontSize, longestAxisLabel * this.axisLabelFontSize)
    )

    return leftPad
  }

  /** heuristic to allow right space for bar labels */
  private rightPad() {
    const longestBarLabel = this.state.counts.reduce((maxLength, count) => Math.max(maxLength, `${count}`.length), 0)

    const rightPad = Math.min(
      this.maxBarLabelChars * this.barLabelFontSize,
      Math.max(this.minBarLabelChars * this.barLabelFontSize, longestBarLabel * this.barLabelFontSize)
    )

    return rightPad
  }

  private rows() {
    // re: 0.375, see https://github.com/IBM/kui/issues/7209
    return (
      <Chart
        domainPadding={Histogram.domainPadding}
        height={
          0.375 * Histogram.domainPadding + this.state.rows.length * this.barHeight * (1 + this.barSpacing) + 10 * 2
        }
        horizontal={this.horizontal}
        padding={{
          left: this.leftPad(),
          right: this.rightPad(),
          top: 0,
          bottom: 0
        }}
      >
        {this.axis()}
        {this.bars()}
      </Chart>
    )
  }

  private axis() {
    return (
      <ChartAxis
        style={{
          axis: { stroke: 'var(--color-base04)' },
          tickLabels: {
            fontFamily: 'var(--font-sans-serif)',
            fontSize: this.axisLabelFontSize,
            fill: 'var(--color-text-02)'
          }
        }}
      />
    )
  }

  private static isTiny(count: number, yMax: number): boolean {
    return count / yMax < 0.01
  }

  private bars() {
    return (
      <ChartBar
        animate={this.state.animate && { onLoad: { duration: 0 }, duration: 200 }}
        barWidth={this.barHeight}
        scale={{ y: this.state.scale }}
        style={{
          data: {
            fill: !this.state.colors
              ? 'var(--color-base05)'
              : ({ index }) => this.state.colors[index] || 'var(--color-base05)',
            stroke: !this.state.colors ? 'var(--color-base04)' : undefined,
            strokeWidth: 0.5
          },
          labels: { fontFamily: 'var(--font-sans-serif)', fontSize: this.barLabelFontSize }
        }}
        data={this.state.rows.map((row, ridx) => ({
          x: row.rowKey || row.name,
          y: this.state.counts[ridx]
        }))}
        labels={_ => Math.round(_.datum.y)}
        labelComponent={<ChartLabel />}
      />
    )
  }

  public render() {
    if (!this.state || !this.state.rows || this.state.rows.length === 0) {
      return <React.Fragment />
    }

    return (
      <div className="kui--data-table-container kui--data-table-container">
        <div className="kui--table-like-wrapper pf-c-table pf-m-compact kui--histogram">{this.rows()}</div>
      </div>
    )
  }
}
