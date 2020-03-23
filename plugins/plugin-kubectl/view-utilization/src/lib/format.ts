/*
 * Copyright 2019 IBM Corporation
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

import * as bytes from 'bytes-iec'

/**
 * @return the ratio a/b, pretty-printed as a percentage string
 *
 */
export function calcPercentage(a: number, b: number): string {
  if (a > 0 && b > 0) {
    return ((a * 100) / b).toFixed(2) + '%'
  } else if (b > 0) {
    return '0%'
  } else {
    return 'Err'
  }
}

/**
 * @param sum cpu consumption in units of milliseconds
 *
 * @return the same figure, in units of fractional seconds
 *
 */
export function cpuPretty(sum: number): string {
  const n = sum / 1000
  if (sum < 10000) {
    return n.toFixed(2)
  } else {
    return n.toFixed(0)
  }
}

/**
 * @param sum memory consumption, in units of bytes
 *
 * @return the same figure, pretty printed in a kb/MB/GB fashion
 *
 */
export function memPretty(sum: number): string {
  return bytes(sum, {})
}
