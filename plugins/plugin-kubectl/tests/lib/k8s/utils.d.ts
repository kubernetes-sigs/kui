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

import { Common, CLI as ui } from '@kui-shell/test'
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

/** Selectors of radio button */
declare var RADIO_BUTTON: string

declare var RADIO_BUTTON_SELECTED: string

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
declare function deleteNS (ctx: Common.ISuite, ns: string, command?: string, theCli?: headless): void

/**
 * Keep poking the given kind till no more such entities exist
 *
 */
declare function waitTillNone (kind: string, theCli?: headless, name?: string, okToSurvive?: string, inNamespace?: string): (app: Application) => Promise<void>

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
declare function doHelp(this: Common.ISuite, cmd: string, breadcrumbs: string[], modes: string[]): Promise<void>
