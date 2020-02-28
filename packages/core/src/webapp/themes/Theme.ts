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

/** the latest apiVersion */
export const apiVersion = 'v2'

/** all known Theme apiVersions */
export type ThemeApiVersion = 'v1' | 'v2'

export default interface Theme {
  apiVersion?: ThemeApiVersion
  name: string
  description?: string
  css: string | string[]
  attrs?: string[]
  style: string
  topTabNames: 'command' | 'fixed'
}

export interface ThemeSet {
  /** import path prefix for all themes */
  plugin: string

  /** theme definitions */
  themes: Theme[]
}
