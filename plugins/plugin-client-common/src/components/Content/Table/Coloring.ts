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

import type { Table } from '@kui-shell/core'
import prettyPrintDuration from 'pretty-ms'

export interface Coloring {
  nDurationBuckets(): number
  durationRangeOfSplit(idx: number): string
  durationBucket(duration: number): number
  durationCssForBucket(idx: number): string
  durationCss(duration: number, isError: boolean): string
}

abstract class AbstractColoring implements Coloring {
  // eslint-disable-next-line no-useless-constructor
  protected constructor(private readonly thresholds) {}

  public nDurationBuckets() {
    return this.thresholds.length + 1
  }

  public durationRangeOfSplit(idx: number) {
    try {
      return idx === 0
        ? `<${prettyPrintDuration(this.thresholds[0])}`
        : idx === this.nDurationBuckets() - 1
        ? `>${prettyPrintDuration(this.thresholds[idx - 1])}`
        : `${prettyPrintDuration(this.thresholds[idx - 1])}\u2014${prettyPrintDuration(this.thresholds[idx])}`
    } catch (err) {
      console.error('Internal error', idx, err)
      return ''
    }
  }

  public durationCssForBucket(idx: number) {
    return `color-latency${idx}`
  }

  public durationBucket(duration: number) {
    for (let idx = 0; idx < this.thresholds.length; idx++) {
      if (duration < this.thresholds[idx]) {
        return idx
      }
    }
    return this.thresholds.length
  }

  public durationCss(duration: number, isError: boolean) {
    if (isError) {
      return 'red-background'
    } else {
      return this.durationCssForBucket(this.durationBucket(duration))
    }
  }
}

export class FixedColoring extends AbstractColoring {
  public constructor() {
    super([2000, 4000, 6000, 8000])
  }

  public durationCssForBucket(idx: number) {
    // we want to skip over color-latency-2
    return `color-latency${idx < 2 ? idx : idx + 1}`
  }
}

export class StdevColoring extends AbstractColoring {
  public constructor(datapoints: Table | number[]) {
    super(
      StdevColoring.computeThresholdsFrom(
        Array.isArray(datapoints) ? datapoints : StdevColoring.datapointsFrom(datapoints)
      )
    )
  }

  private static datapointsFrom(table: Table) {
    const idx1 = table.startColumnIdx
    const idx2 = table.completeColumnIdx

    const datapoints = table.body
      .map(row => {
        const startCell = row.attributes[idx1]
        const startTime = startCell && startCell.value ? new Date(startCell.value).getTime() : 0

        const endCell = row.attributes[idx2]
        const endTime = endCell && endCell.value ? new Date(endCell.value).getTime() : 0

        return endTime - startTime
      })
      .filter(_ => !isNaN(_))
    return datapoints
  }

  private static computeThresholdsFrom(datapoints: number[]) {
    const N = datapoints.length
    const mean = datapoints.reduce((sum, n) => sum + n, 0) / N
    const sumOfSquares = datapoints.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0)
    const stdev = Math.sqrt(sumOfSquares / (N - 1))

    return [mean - stdev * 1.5, mean - stdev * 0.75, mean + stdev * 0.75, mean + stdev * 1.5, mean + stdev * 2]
  }
}

export default StdevColoring
