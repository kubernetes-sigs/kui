/*
 * Copyright 2021 The Kubernetes Authors
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

declare module 'trie-search' {
  interface ConverterOptions {
    /** The default foreground color used when reset color codes are encountered. */
    fg?: string
    /** The default background color used when reset color codes are encountered. */
    bg?: string
    /** Convert newline characters to `<br/>`. */
    newline?: boolean
    /** Generate HTML/XML entities. */
    escapeXML?: boolean
    /** Save style state across invocations of `toHtml()`. */
    stream?: boolean
    /** Can override specific colors or the entire ANSI palette. */
    colors?: string[] | {[code: number]: string}
  }

  class TrieSearch<V extends any> {
    constructor(name?: string)
    map(key: string, value: V): void
    get(key: string): V[]
  }

  export default TrieSearch
}
