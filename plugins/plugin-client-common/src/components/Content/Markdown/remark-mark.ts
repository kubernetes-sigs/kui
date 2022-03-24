/*
 * Copyright 2022 The Kubernetes Authors
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
 * Allows us to support pymdown's `==hello==` which they transform to
 * HTML5 <mark>hello</mark> which seems to generally be presented with
 * highlighter background.
 */
export default function plugin(markdownText: string) {
  const RE_MARK_BASE0 = '==([^=]+)=='
  const RE_MARK_BASE = `${RE_MARK_BASE0}([^=])`
  const RE_MARK = new RegExp(`([^=])${RE_MARK_BASE}`, 'g')
  const RE_MARK_AT_TOP = new RegExp(`^${RE_MARK_BASE}`)
  const RE_MARK_AT_BOTTOM = new RegExp(`${RE_MARK_BASE0}$`)

  return markdownText
    .replace(RE_MARK_AT_TOP, '<mark>$1</mark>$2')
    .replace(RE_MARK, '$1<mark>$2</mark>$3')
    .replace(RE_MARK_AT_BOTTOM, '<mark>$1</mark>')
}
