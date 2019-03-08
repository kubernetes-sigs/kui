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

import { HookFunction, Context, Suite, TestFunction, SuiteFunction } from 'mocha'
import { Application } from 'spectron'

interface ISuite extends Suite {
  app: Application
}

interface IBeforeOptions {
  noApp?: boolean
}

declare function before (ctx: Suite, options?: IBeforeOptions): HookFunction
declare function after (ctx: Suite, f?: () => void): HookFunction
declare function oops (ctx: Suite): ((err: Error) => void)
declare function localIt (msg: String, f: Function): TestFunction
declare function localDescribe (msg: String, f: Function): SuiteFunction
declare function remoteIt (msg: String, f: Function): TestFunction

declare function rp (opts: Object): any
