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

import { Application } from 'spectron'

import { ISuite } from './common'

declare var keys: any
declare var aliases: any
declare var selectors: any

declare var apiHost: string

/** keyboard character for ctrl or meta, platform dependent */
declare var ctrlOrMeta: string

/** keyboard chording for ctrl+C */
declare var ctrlC: Array<string>

declare function normalizeHTML (str: string | Buffer): string

declare function getValueFromMonaco (app: Application, prefix?: string): Promise<string>
declare function waitForXtermInput (app: Application, N: number): Promise<void>
declare function getTextContent (app: Application, selector: string): Promise<string>

declare function expectArray (expected: Array<any>, failFast?: boolean): (actual: Array<any>) => boolean
declare function expectStruct (struct1: object, noParse?: boolean, failFast?: boolean): (str: string) => boolean
declare function expectYAML (struct1: object, subset?: boolean, failFast?: boolean): (str: string) => boolean
declare function expectYAMLSubset (struct1: object, failFast?: boolean): (str: string) => boolean
declare function expectSubset (struct1: object, failFast?: boolean): (str: string) => boolean
declare function expectValidActivationId (): (activationId: string) => boolean

declare function expectedNamespace (space?: string, org?: string): string

interface IWaitOpts {
  name: string
}
type WaitForActivation = (app: Application, activationId: string, opts: IWaitOpts) => Promise<boolean>
declare var waitForActivation: WaitForActivation
declare var waitForSession: WaitForActivation

declare function validateNamespace (observedNamespace: string): void

type AppVerifier = (app: Application) => Promise<Application>

declare class Sidecar {
  expectOpen: AppVerifier
  expectOpenWithFailure: AppVerifier

  /** expect open fullscreen */
  expectFullscreen: AppVerifier

  /** either minimized or fully closed */
  expectClosed: AppVerifier

  /** fully closed, not just minimized */
  expectFullyClosed: AppVerifier

  expectSourceStruct: (expectedJSON: object) => AppVerifier
  expectSourceSubset: (expectedJSON: object) => AppVerifier
  expectSource: (expectedSource: string) => AppVerifier
  expectResult: (expectedResult: object, failFast?: boolean) => AppVerifier
  expectResultSubset: (expectedResult: object, failFast?: boolean) => AppVerifier
  expectBadge: (badge: string) => AppVerifier
  expectLimit: (aType: string, expectedValue: number | string) => AppVerifier
  expectSequence: (A: Array<string>) => AppVerifier

  /** helper method to close the sidecar */
  doClose: (app: Application) => AppVerifier

  /** helper method to open the sidecar */
  doOpen: (app: Application) => AppVerifier

  close: (ctx: ISuite) => void

  expectMode: (expectedMode: string) => AppVerifier
  expectShowing: (expectedName: string, expectedActivationId?: string, expectSubstringMatchOnName?: boolean, expectedPackageName?: string, expectType?: string, waitThisLong?: number) => AppVerifier
}
declare var sidecar: Sidecar

interface AppAndCount {
  app: Application
  count: number
}

type AppAndCountVerifier = (res: AppAndCount) => Promise<Application>

interface ICustomSpec {
  selector?: string
  errOk?: boolean
  expect?: string
  exact?: boolean
  passthrough?: boolean
}

declare class CLI {
  /** execute a command */
  do: (cmd: string, app: Application, noNewline?: boolean) => Promise<AppAndCount>

  /**
   * Exit code code for the given http status code; this is an identity function; for headless mode, there is the -256 part.
   * See headless.js for the analogous headless implementation.
   */
  exitCode: (statusCode: number | string) => number | string

  /** paste the given command `cmd` via the clipboard */
  paste: (cmd: string, app: Application, nLines?: number) => Promise<AppAndCount>

  /** wait for the REPL to be active */
  waitForRepl: AppVerifier

  expectContext: (expectedContext: string, expectedSelection) => AppAndCountVerifier

  makeCustom: (selector: string, expect?: string, exact?: boolean) => ICustomSpec
  expectError: (statusCode: number | string, expect?: string) => AppAndCountVerifier
  expectErrorWithPassthrough: (statusCode: number | string, expect?: string) => (res: AppAndCount) => Promise<number>
  expectBlankWithOpts: (opts: { nonBlankPromptOk?: boolean }) => AppAndCountVerifier
  expectBlank: AppAndCountVerifier
  expectOKWithCustom: (custom: ICustomSpec) => (res: AppAndCount) => any // FIXME; is string | Application
  expectOKWithString: (expect: string, exact?: boolean) => AppAndCountVerifier
  expectOKWithAny: AppAndCountVerifier /** as long as its ok, accept anything */
  expectOKWithOnly: (entityName: string) => AppAndCountVerifier /** expect ok and *only* the given result value */
  expectOKWith: (entityName: string) => AppAndCountVerifier /** expect ok and at least the given result value */
  expectOK: AppAndCountVerifier
  expectJustOK: AppAndCountVerifier /** expect just ok, and no result value */
  expectOKWithTextContent: (expect: string, exact?: boolean, failFast?: boolean, sel?: string) => AppAndCountVerifier
}
declare var cli: CLI

declare function verifyTextExists (this: ISuite, expectedSubstring: string)

/** sleep for the given number of milliseconds */
declare function sleep (millis: number): Promise<void>
