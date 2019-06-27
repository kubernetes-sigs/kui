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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let devOverrides: Record<string, any>
try {
  devOverrides = require('@kui-shell/settings/config-dev.json')
} catch (err) {
  // no dev overrides
}

interface Theme {
  productName: string
  gettingStarted?: string
  ogDescription?: string

  largeIcon: string

  userAgent?: string

  defaultTheme: string
  themes: { name: string; css: string; description?: string; style: string }[]
}

export const theme: Theme = t
export const env = e
export const config = Object.assign({}, c, devOverrides)
