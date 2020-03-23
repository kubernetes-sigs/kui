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

import Debug from 'debug'
const debug = Debug('k8s/view/util/selectors')

interface Selector {
  [key: string]: string | Selector
}

export const selectorToString = (selector: Selector): string => {
  if (selector.matchLabels) {
    return selectorToString(selector.matchLabels as Selector)
  } else if (selector.matchExpressions) {
    // TODO
    return ''
  }

  const stringified = Object.keys(selector)
    .map(key => `-l ${key}=${selector[key]}`)
    .join(' ')

  debug('selectorToString', stringified, selector)

  return stringified
}
