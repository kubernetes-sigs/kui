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

import { HookFunction, Suite } from 'mocha'

import { IBeforeOptions } from '@kui-shell/core/tests/lib/common'

interface IOpenWhiskBeforeOptions extends IBeforeOptions {
  fuzz?: Record<string, any>
}

declare function before (ctx: Suite, opts?: IOpenWhiskBeforeOptions): HookFunction
declare function after (ctx: Suite, f?: () => void): HookFunction

declare var entities: string[]

declare var apihost: string
declare var apihostIsLocal: boolean

declare function cleanAll (noDefault?: boolean | string, api_key?: string): Promise<void>
