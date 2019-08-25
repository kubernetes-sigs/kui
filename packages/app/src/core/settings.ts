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

import { theme as t, env as e, config as c } from '@kui-shell/settings/config.json'

import { TableStyle } from '@kui-shell/core/webapp/models/table'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let devOverrides: Record<string, any>
try {
  devOverrides = require('@kui-shell/settings/config-dev.json')
} catch (err) {
  // no dev overrides
}

interface Theme {
  productName: string
  ogDescription?: string
  ogUrl?: string

  about?: SidecarMode[]
  gettingStarted?: string | Record<string, string>
  description?: string | Record<string, string>

  /** maximum number of watchers per tab (default: 2) */
  maxWatchersPerTab?: number

  /** context root */
  resourceRoot?: string

  /** prompt placeholder text (default: '') */
  placeholder?: string

  /** a short description of the product */
  byline?: string

  tableStyle?: keyof typeof TableStyle

  largeIcon?: string
  wideIcon?: string

  userAgent?: string

  /** final polling interval (default: 5s), watcher will stop increasing the interval beyond this. */
  tablePollingInterval?: number

  /** millis to wait for webpack->proxy connection before warning the user to explain the delay (default: 750ms) */
  millisBeforeProxyConnectionWarning?: number

  defaultTheme: string
  themes: { name: string; css: string; description?: string; style: string }[]
}

export const inBottomInputMode =
  typeof document !== 'undefined' && document.body.classList.contains('kui--bottom-input')

export const theme: Theme = t as Theme
export const env = e
export const config = Object.assign({}, c, devOverrides)
