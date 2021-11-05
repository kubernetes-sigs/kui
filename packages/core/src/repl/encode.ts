/*
 * Copyright 2017 The Kubernetes Authors
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

/**
 * Add quotes if the argument needs it; compare to encodeURIComponent
 *
 */
export default (component: string | number | boolean, quote = '"'): string => {
  if (component === undefined) {
    return ''
  } else if (
    typeof component === 'string' &&
    /\s/.test(component) &&
    component.charAt(0) !== quote &&
    component.charAt(component.length - 1) !== quote
  ) {
    let quoted = ''
    let inBackslash = false
    let inTheirQuote = false
    let inOurQuote = false
    let inSpace = false
    for (let idx = 0; idx < component.length; idx++) {
      const c = component.charAt(idx)

      const escaped = inBackslash
      inBackslash = false

      if (/\s/.test(c) && !escaped) {
        inSpace = true
        if (!inTheirQuote) {
          inOurQuote = true
          quoted += quote
        }
      } else if (c === '\\') {
        inBackslash = true
      } else {
        if (inSpace && inOurQuote) {
          quoted += quote
          inOurQuote = false
        }
        inSpace = false
        if (c === quote && !escaped) {
          inTheirQuote = !inTheirQuote
        }
      }

      quoted += c
    }
    return quoted
  } else {
    return component.toString()
  }
}
