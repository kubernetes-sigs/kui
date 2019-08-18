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
  popup?: string[]
  noProxySessionWait?: boolean
  afterStart?: () => Promise<void>
  beforeStart?: () => Promise<void>
}

declare function before (ctx: Suite, options?: IBeforeOptions): HookFunction
declare function after (ctx: Suite, f?: () => void): HookFunction

/** only execute the test in local */
declare function localIt (msg: string, f: Function): TestFunction

/** only execute the test suite in local */
declare function localDescribe (msg: string, f: Function): SuiteFunction

/** only execute the test suite in an environment that has docker */
declare function dockerDescribe (msg: string, f: Function): SuiteFunction

/** only execute the test in non-proxy browser */
declare function remoteIt (msg: string, f: Function): TestFunction

/** only execute the test in proxy+browser client */
declare function proxyIt (msg: string, f: Function): TestFunction

/** only execute the test in electron or proxy+browser client */
declare function pit (msg: string, f: Function): TestFunction

// never versus void? https://github.com/Microsoft/TypeScript/issues/13625#issuecomment-274566197
declare function oops (ctx: Suite, wait?: boolean): ((err: Error) => never)

declare function rp (opts: Object): any

/** reload the app */
declare function refresh (ctx: Suite, wait?: boolean): Promise<void>

/** restart the app */
declare function restart (ctx: Suite): Promise<void>
  
declare var expectedVersion: string
