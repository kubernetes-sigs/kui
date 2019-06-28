/*
 * Copyright 2017,2019 IBM Corporation
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

import { transparent } from './util'
const debug = Debug('wrk/theme')

/**
 * Create a ChartJS theme that inherits from the current Kui theme.
 *
 * @param ctx this allows you e.g. to create gradients
 *
 */
export default () => {
  const theme = getComputedStyle(document.body)

  //
  // Notes. The trim() calls below are needed.  For some reason the
  // return value of getPropertyVavlue() is not a trimmed string!
  // Various other parts fail without trimmed strings, e.g. ./util's
  // use of Color.
  //

  // for historical reference: these work well together, cyan versus orange
  // --color-chart-01: #F4481D;
  // --color-chart-02: #32AEB8;

  const area = theme.getPropertyValue('--color-chart-0').trim()
  const base = [theme.getPropertyValue('--color-chart-1').trim(), area]

  debug('base0', base[0])
  debug('base1', base[1])

  return {
    fontFamily: theme.getPropertyValue('--font-monospace').trim(),
    bar: {
      latency50: { border: base[0], bg: base[0] },
      latency99: { border: base[0], bg: 'transparent' },
      latency25: { bg: transparent(base[0], 0.3), border: 'transparent' },
      latency75: { bg: transparent(base[0], 0.3), border: 'transparent' },
      latencyMinMax: { bg: transparent(base[0], 0.075), border: 'transparent' }
    },
    area,
    areaStroke: 'transparent',
    border: 'var(--color-base05)',
    chart: {
      backgroundColor: 'var(--color-base01)'
    },
    borderWidth: 5,
    areaBorderWidth: 4
  }
}
