/*
 * Copyright 2017-18 IBM Corporation
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

import { DefaultExecOptions, LanguageBearing } from '@kui-shell/core/models/execOptions'

function isDate(object: Date | string | number): object is Date {
  return object && typeof object !== 'string' && typeof object !== 'number' && 'getMonth' in object
}

/** due to td styling issues, some CSS attrs are on td > span */
const span = (text: string): HTMLElement => {
  const inner = document.createElement('span')
  inner.innerText = text
  return inner
}

/**
 * Pretty print a timestamp
 *
 */
export const prettyPrintTime = (
  timestamp: Date | string | number,
  fmt = 'long',
  previousTimestamp?: Date | string | number,
  execOptions: LanguageBearing = new DefaultExecOptions()
) => {
  // compare now to then, to see if we need to show a year, etc.
  const now = new Date()
  const then = !isDate(timestamp) ? new Date(timestamp) : timestamp

  if (now.getFullYear() === then.getFullYear() && now.getMonth() === then.getMonth()) {
    // same year and month as now

    // same day as now: just print the time
    const prev: Date =
      previousTimestamp && (!isDate(previousTimestamp) ? new Date(previousTimestamp) : previousTimestamp)
    const prevOnSameDay = !!(
      prev &&
      (prev.getFullYear() === then.getFullYear() &&
        prev.getMonth() === then.getMonth() &&
        prev.getDate() === then.getDate())
    )
    const sameDay = () => {
      const delta = then.getTime() - prev.getTime()
      const verySmallDelta = Math.abs(delta) < 1000

      if (fmt === 'delta' || verySmallDelta) {
        if (delta === 0) {
          return span('')
        } else {
          // very small delta (or we were explicitly asked to print deltas)
          const sign = delta < 0 ? '' : '+' // the minus will appear for us
          return span(`${sign}${prettyPrintDuration(then.getTime() - prev.getTime())}`)
        }
      } else {
        const res = document.createElement('span')
        const prefix = document.createElement('span')

        prefix.classList.add('timestamp-same-day')
        prefix.innerText = ''
        res.appendChild(prefix)
        res.appendChild(document.createTextNode(then.toLocaleTimeString()))
        return res
      }
    }

    if (now.getDate() === then.getDate()) {
      // same day as today
      if (prevOnSameDay) {
        // and also same day as the previous timestamp we formatted
        return sameDay()
      } else {
        return span(`Today at ${then.toLocaleTimeString()}`)
      }
    } else {
      // same year and month, different day than now
      if (prevOnSameDay) {
        return sameDay()
      } else {
        return span(
          then.toLocaleString(execOptions.language, {
            weekday: fmt,
            month: fmt,
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          })
        )
      }
    }
  } else if (now.getFullYear() === then.getFullYear()) {
    return span(
      then.toLocaleString(execOptions.language, {
        weekday: fmt,
        month: fmt,
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })
    )
  } else {
    // different year or different month: print the long form
    return span(then.toLocaleString())
  }
}
