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

import type { ParsedOptions } from '@kui-shell/core'
import { BaseHistoryEntry } from './CircularBuffer'

/** Helper to confirm equality of two commands, by comparing argvNoOptions */
function sameArray(A1: string[], A2: string[]) {
  return A1.length === A2.length && A1.every((a1, idx) => a1 === A2[idx])
}

/** Helper to confirm equality of two commands, by comparing two individual ParsedOptions for the same key */
function sameOption(o1: string | boolean | number | string[], o2: string | boolean | number | string[]) {
  return o1 === o2 || (Array.isArray(o1) && Array.isArray(o2) && sameArray(o1, o2))
}

/** Helper to confirm equality of two commands, by comparing ParsedOptions */
function sameOptions(O1: ParsedOptions, O2: ParsedOptions) {
  let N1 = 0
  for (const key in O1) {
    if (key !== '_' && !sameOption(O1[key], O2[key])) {
      return false
    }
    N1++
  }

  let N2 = 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const key in O2) {
    N2++
  }
  return N1 === N2
}

/** Confirm equality of two commands, by comparing the parsed argvNoOptions and ParsedOptions */
export default function sameCommand(
  expectedArgvNoOptions: string[],
  expectedParsedOptions: ParsedOptions,
  currentCwd: string
) {
  return (entry: BaseHistoryEntry) => {
    return (
      entry &&
      entry.cwd === currentCwd &&
      sameArray(entry.argvNoOptions, expectedArgvNoOptions) &&
      sameOptions(entry.parsedOptions, expectedParsedOptions)
    )
  }
}
