/*
 * Copyright 2020 The Kubernetes Authors
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

import { Tab, ExecOptions } from '@kui-shell/core'

import Options from './options'
export { main } from './server'
export { getSessionForTab } from './sessionCache'
export { StdioChannelWebsocketSide } from './stdio-channel'

export const doExec = (
  tab: Tab,
  cmdline: string,
  argvNoOptions: string[],
  parsedOptions: Options,
  execOptions: ExecOptions
) => import('./client').then(_ => _.doExec(tab, cmdline, argvNoOptions, parsedOptions, execOptions))
