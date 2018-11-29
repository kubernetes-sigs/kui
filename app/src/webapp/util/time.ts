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

import prettyPrintDuration from 'pretty-ms'

function isDate (object: any): object is Date {
  return object && typeof object !== 'string' && typeof object !== 'number' && 'getMonth' in object
}

/**
 * Pretty print a timestamp
 *
 */
export const prettyPrintTime = (timestamp: Date | string | number, fmt = 'long', previousTimestamp?: Date | string | number) => {
  // compare now to then, to see if we need to show a year, etc.
  const now = new Date()
  const then = !isDate(timestamp) ? new Date(timestamp) : timestamp

  if (now.getFullYear() === then.getFullYear() &&
      now.getMonth() === then.getMonth()) {
    // same year and month as now

    // same day as now: just print the time
    const prev: Date = previousTimestamp &&
      (!isDate(previousTimestamp) ? new Date(previousTimestamp) : previousTimestamp)
    const prevOnSameDay = prev && (prev.getFullYear() === then.getFullYear() &&
                                   prev.getMonth() === then.getMonth() &&
                                   prev.getDate() === then.getDate())
    const sameDay = () => {
      const res = document.createElement('span')
      const prefix = document.createElement('span')

      prefix.classList.add('timestamp-same-day')
      prefix.innerText = 'Today at '
      res.appendChild(prefix)
      res.appendChild(document.createTextNode(then.toLocaleTimeString()))
      return res
    }

    if (now.getDate() === then.getDate()) {
      if (prevOnSameDay) {
        if (fmt === 'delta') {
          return document.createTextNode(`+${prettyPrintDuration(then.getTime() - prev.getTime())}`)
        } else {
          return sameDay()
        }
      } else {
        return document.createTextNode(`Today at ${then.toLocaleTimeString()}`)
      }
    } else {
      // same year and month, different day than now
      if (prevOnSameDay) {
        return sameDay()
      } else {
        return document.createTextNode(then.toLocaleString(navigator.language, {
          weekday: fmt, month: fmt, day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
        }))
      }
    }
  } else {
    // different year or different month: print the long form
    return document.createTextNode(then.toLocaleString())
  }
}
