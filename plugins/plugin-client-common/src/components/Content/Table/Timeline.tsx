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
import { REPL, Tab, Table, i18n } from '@kui-shell/core'

import DefaultColoring, { Coloring } from './Coloring'
import '../../../../web/scss/components/Table/Timeline.scss'

const strings = i18n('plugin-client-common')

interface Bucket {
  startMillis: number
  endMillis: number
  coldStart: number
  execution: number
  durationSplit: { coldStart: number; execution: number }[]
}

interface Props {
  response: Table
  tab: Tab
  repl: REPL
  nBuckets?: number
}

interface State {
  bucketTimeRange: number
  maxBucketOccupancy: number
  buckets: Bucket[]
  coloring: Coloring
}

export default class Timeline extends React.PureComponent<Props, State> {
  /**
   * Default number of buckets in the timeline
   *
   */
  private static readonly defaultNBuckets = 50

  public constructor(props: Props) {
    super(props)
    this.state = Timeline.computeBuckets(props.response, props.nBuckets || Timeline.defaultNBuckets)
  }

  public static getDerivedStateFromProps(props: Props) {
    return Timeline.computeBuckets(props.response, props.nBuckets || Timeline.defaultNBuckets)
  }

  private static computeBuckets(response: Table, nBuckets: number) {
    const idx1 = response.startColumnIdx
    const idx2 = response.completeColumnIdx

    const coloring = new DefaultColoring(response)

    const { minStart, maxEnd } = response.body.reduce(
      (range, row) => {
        const startCell = row.attributes[idx1]
        const startTime = startCell && startCell.value ? new Date(startCell.value).getTime() : 0

        const endCell = row.attributes[idx2]
        const endTime = endCell && endCell.value ? new Date(endCell.value).getTime() : 0

        if (range.minStart === 0 || startTime < range.minStart) {
          range.minStart = startTime
        }

        if (endTime > range.maxEnd) {
          range.maxEnd = endTime
        }

        return range
      },
      { minStart: 0, maxEnd: 0 }
    )

    const bucketTimeRange = Math.max(1, maxEnd - minStart)
    const timeRangePerBucket = Math.floor(bucketTimeRange / nBuckets)

    const bucketOf = (millis: number) => Math.min(nBuckets - 1, Math.floor((millis - minStart) / timeRangePerBucket))

    const initialBuckets: Bucket[] = Array(nBuckets)
      .fill(0)
      .map((_, idx) => ({
        startMillis: minStart + timeRangePerBucket * idx,
        endMillis: idx === nBuckets - 1 ? maxEnd : minStart + timeRangePerBucket * (idx + 1),
        coldStart: 0,
        execution: 0,
        durationSplit: Array(coloring.nDurationBuckets())
          .fill(0)
          .map(() => ({ execution: 0, coldStart: 0 }))
      }))

    // need to slice so as not to permute the original table model
    const buckets = response.body.reduce((buckets, row) => {
      const startMillis = new Date(row.attributes[idx1].value).getTime()
      const endMillis =
        !row.attributes[idx2].value || row.attributes[idx2].value === '<none>'
          ? startMillis
          : new Date(row.attributes[idx2].value).getTime()

      // const coldStart =
      // response.coldStartColumnIdx >= 0 ? parseInt(row.attributes[response.coldStartColumnIdx].value, 10) : 0

      const startBucketIdx = bucketOf(startMillis)
      const coldStartEndBucketIdx = startBucketIdx // bucketOf(startMillis + coldStart)
      const endBucketIdx = bucketOf(endMillis)

      // const nColdBucketsSpanned = coldStartEndBucketIdx - startBucketIdx + 1
      // const nExecutionBucketsSpanned = endBucketIdx - coldStartEndBucketIdx + 1

      const splitIdx = coloring.durationBucket(endMillis - startMillis)
      /* for (let bucketIdx = startBucketIdx; bucketIdx < coldStartEndBucketIdx + 1; bucketIdx++) {
        buckets[bucketIdx].coldStart++
        buckets[bucketIdx].durationSplit[splitIdx].coldStart++
      } */
      for (let bucketIdx = coldStartEndBucketIdx; bucketIdx < endBucketIdx + 1; bucketIdx++) {
        buckets[bucketIdx].execution++
        buckets[bucketIdx].durationSplit[splitIdx].execution++
      }

      return buckets
    }, initialBuckets)

    return {
      bucketTimeRange,
      maxBucketOccupancy: buckets.reduce((max, bucket) => Math.max(max, bucket.coldStart + bucket.execution), 0),
      coloring,
      buckets
    }
  }

  private getFraction(numerator: number) {
    const denominator = this.state.maxBucketOccupancy
    return `${((numerator / denominator) * 100).toFixed(10).toString()}%`
  }

  private bar(occupancy: number, css: string, title?: string, needsOverlay = false) {
    return occupancy > 0 ? (
      <div
        key={`${css}-${needsOverlay}-${occupancy}`}
        className={css}
        style={{ height: this.getFraction(occupancy) }}
        title={title}
      >
        {needsOverlay ? <div className="kui--bar-overlay">&nbsp;</div> : <React.Fragment>&nbsp;</React.Fragment>}
      </div>
    ) : undefined
  }

  private buckets() {
    return (
      <div className="kui--timeline-buckets">
        {this.state.buckets.map((bucket, idx) => {
          const { coldStart = 0, execution = 0, durationSplit } = bucket
          const leftover = this.state.maxBucketOccupancy - coldStart - execution

          return (
            <div className="kui--timeline-bucket" key={`${idx}-${bucket.coldStart}-${bucket.execution}`}>
              {this.bar(leftover, 'leftover')}
              {durationSplit.reverse().map((split, idx) => {
                const splitIdx = durationSplit.length - idx - 1
                const range = this.state.coloring.durationRangeOfSplit(splitIdx)
                return (
                  <React.Fragment key={splitIdx}>
                    {this.bar(
                      split.execution,
                      this.state.coloring.durationCssForBucket(splitIdx),
                      strings(`concurrencyInDurationSplit`, split.execution, range)
                    )}
                    {this.bar(
                      split.coldStart,
                      this.state.coloring.durationCssForBucket(splitIdx),
                      strings(`concurrencyColdStartInDurationSplit`, split.coldStart, range),
                      true
                    )}
                  </React.Fragment>
                )
              })}
              {/* this.bar(execution, "execution") */}
              {/** durationSplit.map((split, idx) => this.bar(split.coldStart, durationCssForBucket(idx)))**/}
              {/* this.bar(coldStart, true) */}
            </div>
          )
        })}
      </div>
    )
  }

  private yAxis() {
    const nTicks = 3

    return (
      <div className="kui--timeline-y-axis">
        <div className="kui--timeline-ticks">
          <div className="kui--timeline-occupancy-line kui--timeline-tick">
            <div className="kui--timeline-occupancy-line-label">{this.state.maxBucketOccupancy} max concurrency</div>
          </div>
          {Array(nTicks)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="kui--timeline-tick">
                &nbsp;
              </div>
            ))}
        </div>
      </div>
    )
  }

  private xAxis() {
    return <React.Fragment />
  }

  public render() {
    if (!this.state) {
      return <React.Fragment />
    }

    return (
      <div className="kui--data-table-container kui--timeline-container">
        <div className="kui--timeline">
          {this.yAxis()}
          {this.xAxis()}
          {this.buckets()}
        </div>
      </div>
    )
  }
}
