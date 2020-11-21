/*
 * Copyright 2019-2020 IBM Corporation
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

/** the latest apiVersion */
export const apiVersion = 'v2'

/** all known Theme apiVersions */
export type ThemeApiVersion = 'v1' | 'v2'

/** Properties that can be associated with <Kui/> component */
export interface ThemeProperties {
  components: 'carbon' | 'patternfly'
  topTabNames: 'command' | 'fixed'
}

type Theme = ThemeProperties & {
  apiVersion?: ThemeApiVersion
  name: string
  description?: string

  /** Source files */
  css: string | string[]

  /** Body attributes */
  attrs?: string[]

  /** Is this theme a light (e.g. black text on white background), or the inverse? */
  style: 'light' | 'dark'

  /** Present in a more terminal-like way (versus a more console-like way)? */
  lightweight?: boolean
}

export default Theme

export interface ThemeSet {
  /** import path prefix for all themes */
  plugin: string

  /** theme definitions */
  themes: Theme[]
}
