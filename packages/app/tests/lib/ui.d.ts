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

declare var keys: Record<string, string>
declare var aliases: Record<string, string[]>

declare var apiHost: string

/** keyboard character for ctrl or meta, platform dependent */
declare var ctrlOrMeta: string

/** keyboard chording for ctrl+C */
declare var ctrlC: Array<string>

declare function normalizeHTML (str: string | Buffer): string

declare function getValueFromMonaco (app: Application, prefix?: string): Promise<string>
declare function waitForXtermInput (app: Application, N: number): Promise<void>
declare function getTextContent (app: Application, selector: string): Promise<string>

declare function expectArray (expected: Array<any>, failFast?: boolean): (actual: string | Array<any>) => boolean
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

declare class Selectors {
  APIHOST: string
  NAMESPACE: string
  CURRENT_TAB: string
  TAB_N: (N: number) => string
  SIDECAR_BASE: string
  SIDECAR_FULLSCREEN: string
  PROMPT_BLOCK: string
  OOPS: string
  SIDECAR: string
  SIDECAR_WITH_FAILURE: string
  SIDECAR_HIDDEN: string
  SIDECAR_FULLY_HIDDEN: string
  SIDECAR_ACTIVATION_TITLE: string
  SIDECAR_TITLE: string
  SIDECAR_PACKAGE_NAME_TITLE: string
  SIDECAR_CONTENT: string
  SIDECAR_WEB_ACTION_URL: string
  SIDECAR_ACTION_SOURCE: string
  SIDECAR_PACKAGE_PARAMETERS: string
  SIDECAR_ACTIVATION_RESULT: string
  SIDECAR_ACTIVATION_ID: string
  SIDECAR_RULE_CANVAS: string
  SIDECAR_RULE_CANVAS_NODES: string
  SIDECAR_SEQUENCE_CANVAS: string
  SIDECAR_SEQUENCE_CANVAS_NODES: string
  SIDECAR_SEQUENCE_CANVAS_NODE_N: (N: number) => string
  SIDECAR_LIMIT: (type: string) => string
  SIDECAR_BADGES: string
  SIDECAR_CUSTOM_CONTENT: string
  SIDECAR_MODE_BUTTONS: string
  SIDECAR_MODE_BUTTON: (mode: string) => string
  SIDECAR_MODE_BUTTON_SELECTED: (mode: string) => string
  SIDECAR_BACK_BUTTON: string
  SIDECAR_MAXIMIZE_BUTTON: string
  SIDECAR_CLOSE_BUTTON: string
  SIDECAR_FULLY_CLOSE_BUTTON: string
  PROCESSING_PROMPT_BLOCK: string
  CURRENT_PROMPT_BLOCK: string
  PROMPT_BLOCK_N: (N: number) => string
  PROCESSING_N: (N: number) => string
  CURRENT_PROMPT: string
  PROMPT_N: (N: number) => string
  OUTPUT_N: (N: number) => string
  PROMPT_BLOCK_LAST: string
  PROMPT_BLOCK_FINAL: string
  OUTPUT_LAST: string
  LIST_RESULTS_N: (N: number) => string
  LIST_RESULTS_BY_NAME_N: (N: number) => string
  LIST_RESULT_BY_N_FOR_NAME: (N: number, name: string) => string
  BY_NAME: (name: string) => string
  LIST_RESULT_BY_N_AND_NAME: (N: number, name: string) => string
  OK_N: (N: number) => string
  xtermRows: (N: number) => string
}
declare var selectors: Selectors

declare function verifyTextExists (this: ISuite, expectedSubstring: string)

/** sleep for the given number of milliseconds */
declare function sleep (millis: number): Promise<void>
