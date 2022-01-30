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

const RE_KEY = /\+\+([^+]+)(\+([^+]+))*\+\+/g

/**
 * Allows us to support pymdown's `++ctrl+alt+delete` which they
 * transform to HTML5 <kbd>...</kbd>.
 */
export default function plugin(markdownText: string) {
  return markdownText.replace(RE_KEY, match => {
    return (
      '<span class="kui--markdown-keys">' +
      match
        .split(/\+/)
        .filter(Boolean)
        .map(_ => _.replace(/^"(.+)"$/, '$1'))
        .map(_ => `<kbd class="kui--markdown-key--${_}">${_}</kbd>`)
        .join('<span>+</span>') +
      '</span>'
    )
  })
}
