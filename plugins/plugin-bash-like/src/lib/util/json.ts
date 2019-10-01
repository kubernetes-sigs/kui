/*
 * Copyright 2018 IBM Corporation
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

import Debug from 'debug'
const debug = Debug('plugins/bash-like/util/json')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractJSON = (str: string): Record<string, any> => {
  const trimmed = str.substring(str.indexOf('{'))

  if (trimmed.length > 0) {
    try {
      const json = JSON.parse(trimmed)
      debug('successfully parsed out json', json)
      return json
    } catch (err) {
      // oh well, we tried!
    }
  }
}
