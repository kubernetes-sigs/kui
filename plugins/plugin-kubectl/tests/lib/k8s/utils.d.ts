/*
 * Copyright 2019 The Kubernetes Authors
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

import { Common, CLI as ui, ReplExpect } from '@kui-shell/test'
import { Application } from 'spectron'
import { CLI as headless } from '@kui-shell/core/tests/lib/headless'

/**
 * Which sidecar mode should be visible upon loading a kubernetes entity
 *
 */
declare var defaultModeForGet: string

/**
 * Do singleton tables have a title decoration?
 *
 */
declare let singletonTablesHaveTitle: boolean

/**
 * Allocate a new unique namespace name
 *
 * @param prefix the (optional) prefix of the generated namespace name
 *
 */
declare function createNS (prefix?: string): string

/**
 * Install a mocha test to allocate the given namespace `ns`
 *
 */
declare function allocateNS (ctx: Common.ISuite, ns: string, command?: string, theCli?: headless): string

/**
 * Install a mocha test to delete the given namespace `ns`
 *
 */
declare function deleteNS (ctx: Common.ISuite, ns: string | string[], command?: string, theCli?: headless): void

/**
 * Execute a `command` to show a table;
 * wait for `name` to be green;
 *
 */
declare function list (ctx: Common.ISuite, command: string, name: string, wait?: boolean): Promise<string>

/**
 * Execute a `command` to show a table;
 * wait for `name` to be green;
 * click the `name` to open a sdiecar
 *
 */
declare function openSidecarByList (ctx: Common.ISuite, command: string, name: string, wait?: boolean, mode?: string): Promise<ReplExpect.AppAndCount>

/**
 * Install a mocha test to delete the given pod by name `pod`
 *
 */
declare function deletePodByName (ctx: Common.ISuite, pod: string, ns: string, command?: string, theCli?: headless): void


/**
 * Keep poking the given kind till no more such entities exist
 *
 */
declare function waitTillNone (kind: string, theCli?: headless, name?: string | string[], okToSurvive?: string, inNamespace?: string): (app: Application) => Promise<void>

/**
 * Wait till the given resource is Terminating
 *
 */
declare function waitTillTerminating (kind: string, theCli: headless, name: string, inNamespace?: string): (app: Application) => Promise<void>

/**
 * Wait for a green badge
 *
 */
declare function waitForGreen (app: Application, selector: string): Promise<string>

/**
 * Wait for a red badge
 *
 */
declare function waitForRed (app: Application, selector: string): Promise<string>

/**
 * Confirm that the table title matches
 *
 */
declare function assertTableTitleMatches(self: Common.ISuite, tableSelector: string, expectedTitle: string): Promise<never>

/**
 * Type slowly, this helps with some odd webpack+proxy issues
 *
 */
declare function typeSlowly(app: Application, txt: string): Promise<void>

/** kubectl kui headless impl */
declare var kubectl: headless

/**
 * Test Usage rendering
 *
 * @param cmd command to issue to the terminal
 * @param breadcrumbs array of expected breadcrumbs
 * @param modes array of expected nav menus (can be a subset)
 *
 */
declare function doHelp(this: Common.ISuite, cmd: string, breadcrumbs: string[], modes: string[], content?: string): Promise<void>

/** Get text from a Terminal-oriented tab */
declare function getTerminalText(this: Common.ISuite, res: ReplExpect.AppAndCount): Promise<string>

/** Wait for the given checker to be true, w.r.t. the log text in the view */
declare function waitForTerminalText(this: Common.ISuite, res: ReplExpect.AppAndCount, checker: string | RegExp | ((text: string) => boolean)): Promise<void>

/** URL of remote pod yaml */
declare const remotePodYaml: string

/** Name of remote pod */
declare const remotePodName: string

/** URL of second remote pod yaml */
declare const remotePodYaml2: string

/** Name of remote pod2 */
declare const remotePodName2: string
